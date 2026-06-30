'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showToast } from '@/components/ui/Toaster/constant';

import {
    Student,
    StudentFormValues,
    StudentOption,
    UploadStudentsPayload,
} from '@/types/student';

import useDebounce from '@/utils/useDebounce';

import { STUDENT_PAGE_SIZE } from '../components/StudentManagementPage/constant';
import {
    createStudent,
    downloadStudentUploadTemplate,
    studentListQueryOptions,
    studentQueryKey,
    updateStudent,
    updateStudentStatus,
    uploadStudents,
} from '../components/StudentManagementPage/utils';

export type StudentModalMode = 'add' | 'edit';

export const useStudentManagement = () => {
    const queryClient = useQueryClient();
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [modalMode, setModalMode] = useState<StudentModalMode>('add');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<StudentOption | null>(null);
    const [selectedSection, setSelectedSection] = useState<StudentOption | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<StudentOption | null>(null);

    const debouncedSearch = useDebounce(searchValue, 400);

    const filters = useMemo(
        () => ({
            name: debouncedSearch.trim(),
            grade: selectedGrade?.id ?? '',
            section: selectedSection?.id ?? '',
            status: selectedStatus?.id ?? '',
            page,
            limit: STUDENT_PAGE_SIZE,
        }),
        [debouncedSearch, page, selectedGrade?.id, selectedSection?.id, selectedStatus?.id],
    );

    const studentListQuery = useQuery(queryOptions(studentListQueryOptions(filters)));

    const invalidateStudentList = () =>
        queryClient.invalidateQueries({
            queryKey: studentQueryKey(),
        });

    const downloadTemplateFile = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    const createStudentMutation = useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            showToast({ message: 'Student added successfully', type: 'success' });
            setIsFormModalOpen(false);
            setPage(1);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to add student',
                type: 'error',
            });
        },
        onSettled: invalidateStudentList,
    });

    const updateStudentMutation = useMutation({
        mutationFn: ({ studentId, payload }: { studentId: string; payload: StudentFormValues }) =>
            updateStudent(studentId, payload),
        onSuccess: () => {
            showToast({ message: 'Student updated successfully', type: 'success' });
            setIsFormModalOpen(false);
            setSelectedStudent(null);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to update student',
                type: 'error',
            });
        },
        onSettled: invalidateStudentList,
    });

    const updateStatusMutation = useMutation({
        mutationFn: updateStudentStatus,
        onSuccess: () => {
            showToast({ message: 'Student status updated successfully', type: 'success' });
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to update student status',
                type: 'error',
            });
        },
        onSettled: invalidateStudentList,
    });

    const uploadStudentsMutation = useMutation({
        mutationFn: uploadStudents,
        onSuccess: (response) => {
            const successCount = response.response?.successCount;
            const message =
                response.response?.message ||
                response.message ||
                (typeof successCount === 'number'
                    ? `${successCount} students uploaded successfully`
                    : 'Students uploaded successfully');

            showToast({ message, type: 'success' });
            setIsUploadModalOpen(false);
            setPage(1);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to upload students',
                type: 'error',
            });
        },
        onSettled: invalidateStudentList,
    });

    const downloadTemplateMutation = useMutation({
        mutationFn: downloadStudentUploadTemplate,
        onSuccess: (blob) => {
            downloadTemplateFile(blob, 'student-upload-template.csv');
            showToast({ message: 'Student template downloaded successfully', type: 'success' });
        },
        onError: (error) => {
            showToast({
                message:
                    error instanceof Error ? error.message : 'Unable to download student template',
                type: 'error',
            });
        },
    });

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };

    const handleGradeChange = (grade: StudentOption) => {
        setSelectedGrade(grade);
        setPage(1);
    };

    const handleSectionChange = (section: StudentOption) => {
        setSelectedSection(section);
        setPage(1);
    };

    const handleStatusChange = (status: StudentOption) => {
        setSelectedStatus(status);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchValue('');
        setSelectedGrade(null);
        setSelectedSection(null);
        setSelectedStatus(null);
        setPage(1);
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedStudent(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (student: Student) => {
        setModalMode('edit');
        setSelectedStudent(student);
        setIsFormModalOpen(true);
    };

    const handleSubmitStudent = (payload: StudentFormValues) => {
        if (modalMode === 'edit' && selectedStudent) {
            updateStudentMutation.mutate({ studentId: selectedStudent.id, payload });
            return;
        }

        createStudentMutation.mutate(payload);
    };

    const handleToggleStatus = (isActive: boolean, studentId: string) => {
        updateStatusMutation.mutate({
            studentId,
            status: (isActive ? 1 : 0) as any,
        });
    };

    const handleUploadStudents = (payload: UploadStudentsPayload) => {
        uploadStudentsMutation.mutate(payload);
    };

    const handleDownloadStudentTemplate = () => {
        downloadTemplateMutation.mutate();
    };

    const total = studentListQuery.data?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / STUDENT_PAGE_SIZE), 1);
    const hasActiveFilters = Boolean(
        searchValue.trim() || selectedGrade || selectedSection || selectedStatus,
    );

    return {
        filters,
        handleClearFilters,
        handleDownloadStudentTemplate,
        handleGradeChange,
        handleOpenAddModal,
        handleOpenEditModal,
        handleSearchChange,
        handleSectionChange,
        handleStatusChange,
        handleSubmitStudent,
        handleToggleStatus,
        handleUploadStudents,
        hasActiveFilters,
        isFormModalOpen,
        isSubmitting: createStudentMutation.isPending || updateStudentMutation.isPending,
        isUploadModalOpen,
        isUploading: uploadStudentsMutation.isPending,
        isTemplateDownloading: downloadTemplateMutation.isPending,
        modalMode,
        page,
        searchValue,
        selectedGrade,
        selectedSection,
        selectedStatus,
        selectedStudent,
        setIsFormModalOpen,
        setIsUploadModalOpen,
        setPage,
        studentListQuery,
        totalPages,
    };
};
