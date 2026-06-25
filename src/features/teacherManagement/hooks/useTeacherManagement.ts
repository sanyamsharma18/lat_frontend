'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showToast } from '@/components/ui/Toaster/constant';

import {
    RegionOption,
    SchoolOption,
    Teacher,
    TeacherFormValues,
    UploadTeachersPayload,
} from '@/types/teacher';

import useDebounce from '@/utils/useDebounce';

import { TEACHER_PAGE_SIZE } from '../components/TeacherManagementPage/constant';
import {
    createTeacher,
    deleteTeacher,
    downloadTeacherUploadTemplate,
    regionQueryOptions,
    schoolQueryOptions,
    teacherListQueryOptions,
    teacherQueryKey,
    updateTeacher,
    uploadTeachers,
} from '../components/TeacherManagementPage/utils';

export type TeacherModalMode = 'add' | 'edit';

export const useTeacherManagement = () => {
    const queryClient = useQueryClient();
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [modalMode, setModalMode] = useState<TeacherModalMode>('add');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<RegionOption | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);

    const debouncedSearch = useDebounce(searchValue, 400);

    const filters = useMemo(
        () => ({
            teacherName: debouncedSearch.trim(),
            regionId: selectedRegion?.id ?? '',
            schoolId: selectedSchool?.id ?? '',
            page,
            limit: TEACHER_PAGE_SIZE,
        }),
        [debouncedSearch, page, selectedRegion?.id, selectedSchool?.id],
    );

    const teacherListQuery = useQuery(queryOptions(teacherListQueryOptions(filters)));
    const regionListQuery = useQuery(queryOptions(regionQueryOptions()));
    const schoolListQuery = useQuery(queryOptions(schoolQueryOptions(selectedRegion?.id ?? '')));

    const invalidateTeacherList = () =>
        queryClient.invalidateQueries({
            queryKey: teacherQueryKey(),
        });

    const downloadTemplateFile = (blob: Blob, fileName: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    const createTeacherMutation = useMutation({
        mutationFn: createTeacher,
        onSuccess: () => {
            showToast({ message: 'Teacher added successfully', type: 'success' });
            setIsFormModalOpen(false);
            setPage(1);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to add teacher',
                type: 'error',
            });
        },
        onSettled: invalidateTeacherList,
    });

    const updateTeacherMutation = useMutation({
        mutationFn: ({ teacherId, payload }: { teacherId: string; payload: TeacherFormValues }) =>
            updateTeacher(teacherId, payload),
        onSuccess: () => {
            showToast({ message: 'Teacher updated successfully', type: 'success' });
            setIsFormModalOpen(false);
            setSelectedTeacher(null);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to update teacher',
                type: 'error',
            });
        },
        onSettled: invalidateTeacherList,
    });

    const deleteTeacherMutation = useMutation({
        mutationFn: deleteTeacher,
        onSuccess: () => {
            showToast({ message: 'Teacher deleted successfully', type: 'success' });
            setIsDeleteModalOpen(false);
            setSelectedTeacher(null);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to delete teacher',
                type: 'error',
            });
        },
        onSettled: invalidateTeacherList,
    });

    const uploadTeachersMutation = useMutation({
        mutationFn: uploadTeachers,
        onSuccess: () => {
            showToast({ message: 'Teachers uploaded successfully', type: 'success' });
            setIsUploadModalOpen(false);
            setPage(1);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to upload teachers',
                type: 'error',
            });
        },
        onSettled: invalidateTeacherList,
    });

    const downloadTemplateMutation = useMutation({
        mutationFn: downloadTeacherUploadTemplate,
        onSuccess: (blob) => {
            downloadTemplateFile(blob, 'teacher-upload-template.csv');
            showToast({ message: 'Teacher template downloaded successfully', type: 'success' });
        },
        onError: (error) => {
            showToast({
                message:
                    error instanceof Error ? error.message : 'Unable to download teacher template',
                type: 'error',
            });
        },
    });

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };

    const handleRegionChange = (region: RegionOption) => {
        setSelectedRegion(region);
        setSelectedSchool(null);
        setPage(1);
    };

    const handleSchoolChange = (school: SchoolOption) => {
        setSelectedSchool(school);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchValue('');
        setSelectedRegion(null);
        setSelectedSchool(null);
        setPage(1);
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedTeacher(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (teacher: Teacher) => {
        setModalMode('edit');
        setSelectedTeacher(teacher);
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsDeleteModalOpen(true);
    };

    const handleOpenUploadModal = () => {
        setIsUploadModalOpen(true);
    };

    const handleSubmitTeacher = (payload: TeacherFormValues) => {
        if (modalMode === 'edit' && selectedTeacher) {
            updateTeacherMutation.mutate({ teacherId: selectedTeacher.id, payload });
            return;
        }

        createTeacherMutation.mutate(payload);
    };

    const handleDeleteTeacher = () => {
        if (selectedTeacher) {
            deleteTeacherMutation.mutate(selectedTeacher.id);
        }
    };

    const handleUploadTeachers = (payload: UploadTeachersPayload) => {
        uploadTeachersMutation.mutate(payload);
    };

    const handleDownloadTeacherTemplate = () => {
        downloadTemplateMutation.mutate();
    };

    const total = teacherListQuery.data?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / TEACHER_PAGE_SIZE), 1);
    const hasActiveFilters = Boolean(searchValue.trim() || selectedRegion || selectedSchool);

    return {
        filters,
        handleClearFilters,
        handleDeleteTeacher,
        handleDownloadTeacherTemplate,
        handleOpenAddModal,
        handleOpenDeleteModal,
        handleOpenEditModal,
        handleOpenUploadModal,
        handleRegionChange,
        handleSearchChange,
        handleSchoolChange,
        handleSubmitTeacher,
        handleUploadTeachers,
        hasActiveFilters,
        isDeleteModalOpen,
        isDeleting: deleteTeacherMutation.isPending,
        isFormModalOpen,
        isSubmitting: createTeacherMutation.isPending || updateTeacherMutation.isPending,
        isUploadModalOpen,
        isUploading: uploadTeachersMutation.isPending,
        isTemplateDownloading: downloadTemplateMutation.isPending,
        modalMode,
        page,
        regionListQuery,
        searchValue,
        schoolListQuery,
        selectedTeacher,
        selectedRegion,
        selectedSchool,
        setIsDeleteModalOpen,
        setIsFormModalOpen,
        setIsUploadModalOpen,
        setPage,
        teacherListQuery,
        totalPages,
    };
};
