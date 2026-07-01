'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showToast } from '@/components/ui/Toaster/constant';

import {
    GenerateQuestionsPayload,
    QuestionFormValues,
    QuestionOptionItem,
    QuestionRecord,
} from '@/types/questionGenerator';

import useDebounce from '@/utils/useDebounce';

import { QUESTION_PAGE_SIZE } from '../components/QuestionGeneratorPage/constant';
import {
    createQuestion,
    deleteQuestion,
    generateQuestions,
    questionListQueryOptions,
    questionQueryKey,
    updateQuestion,
    getGradeGroups,
    getGradesByGradeGroup,
    getSubjectsByGrade,
    getCompetenciesList,
    generateQuestionImage,
    uploadQuestionImage,
} from '../components/QuestionGeneratorPage/utils';

export type QuestionModalMode = 'add' | 'edit';

export const useQuestionGenerator = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [selectedGradeGroupFilter, setSelectedGradeGroupFilter] = useState<QuestionOptionItem | null>(null);
    const [selectedGradeFilter, setSelectedGradeFilter] = useState<QuestionOptionItem | null>(null);
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<QuestionOptionItem | null>(
        null,
    );
    const [selectedTermFilter, setSelectedTermFilter] = useState<QuestionOptionItem | null>(null);
    const [selectedCompetencyFilter, setSelectedCompetencyFilter] =
        useState<QuestionOptionItem | null>(null);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<QuestionOptionItem | null>(
        null,
    );

    const handleGradeGroupFilterChange = (val: QuestionOptionItem | null) => {
        setSelectedGradeGroupFilter(val);
        setSelectedGradeFilter(null);
        setSelectedSubjectFilter(null);
        setSelectedTermFilter(null);
        setSelectedCompetencyFilter(null);
        setPage(1);
    };

    const handleGradeFilterChange = (val: QuestionOptionItem | null) => {
        setSelectedGradeFilter(val);
        setSelectedSubjectFilter(null);
        setSelectedTermFilter(null);
        setSelectedCompetencyFilter(null);
        setPage(1);
    };

    const handleSubjectFilterChange = (val: QuestionOptionItem | null) => {
        setSelectedSubjectFilter(val);
        setSelectedTermFilter(null);
        setSelectedCompetencyFilter(null);
        setPage(1);
    };

    const handleTermFilterChange = (val: QuestionOptionItem | null) => {
        setSelectedTermFilter(val);
        setSelectedCompetencyFilter(null);
        setPage(1);
    };
    const [generateValues, setGenerateValues] = useState<GenerateQuestionsPayload>({
        gradeGroup: '',
        grade: '',
        subject: '',
        term: '',
        competencyIds: [],
        count: 2,
    });
    const [modalMode, setModalMode] = useState<QuestionModalMode>('add');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionRecord | null>(null);

    const debouncedSearch = useDebounce(searchValue, 400);

    const filters = useMemo(
        () => ({
            search: debouncedSearch.trim(),
            grade: selectedGradeFilter?.id ?? '',
            subject: selectedSubjectFilter?.id ?? '',
            competency: selectedCompetencyFilter?.id ?? '',
            status: selectedStatusFilter?.id ?? '',
            termId: selectedTermFilter?.id === 'Term 1' ? '1' : selectedTermFilter?.id === 'Term 2' ? '2' : '',
            page,
            limit: QUESTION_PAGE_SIZE,
        }),
        [
            debouncedSearch,
            page,
            selectedCompetencyFilter?.id,
            selectedGradeFilter?.id,
            selectedStatusFilter?.id,
            selectedSubjectFilter?.id,
            selectedTermFilter?.id,
        ],
    );

    const questionListQuery = useQuery(queryOptions(questionListQueryOptions(filters)));

    const gradeGroupsQuery = useQuery({
        queryKey: ['gradeGroupsList'],
        queryFn: getGradeGroups,
        staleTime: 5 * 60 * 1000,
    });

    const gradeGroupOptions: QuestionOptionItem[] = (gradeGroupsQuery.data || []).map((g: any) => ({
        id: String(g.id || g.name),
        name: String(g.name),
    }));

    const gradesQuery = useQuery({
        queryKey: ['gradesList', generateValues.gradeGroup],
        queryFn: () => getGradesByGradeGroup(generateValues.gradeGroup),
        enabled: !!generateValues.gradeGroup,
        staleTime: 5 * 60 * 1000,
    });

    const gradeOptions: QuestionOptionItem[] = (gradesQuery.data || []).map((g: any) => ({
        id: String(g.id || g.name),
        name: String(g.name),
    }));

    const subjectsQuery = useQuery({
        queryKey: ['subjectsList', generateValues.grade],
        queryFn: () => getSubjectsByGrade(generateValues.grade),
        enabled: !!generateValues.grade,
        staleTime: 5 * 60 * 1000,
    });

    const subjectOptions: QuestionOptionItem[] = (subjectsQuery.data || []).map((s: any) => ({
        id: String(s.id || s.name),
        name: String(s.name),
    }));

    const competenciesQuery = useQuery({
        queryKey: ['competenciesList', generateValues.grade, generateValues.subject, generateValues.term],
        queryFn: () => getCompetenciesList({
            gradeId: Number(generateValues.grade),
            subjectId: Number(generateValues.subject),
            term: generateValues.term,
        }),
        enabled: !!generateValues.grade && !!generateValues.subject && !!generateValues.term,
        staleTime: 5 * 60 * 1000,
    });

    const competencyOptions: QuestionOptionItem[] = (competenciesQuery.data || []).map((c: any) => ({
        id: String(c.id || c.name),
        name: String(c.name),
    }));

    const searchGradesQuery = useQuery({
        queryKey: ['searchGradesList', selectedGradeGroupFilter?.id],
        queryFn: () => getGradesByGradeGroup(selectedGradeGroupFilter?.id ?? ''),
        enabled: !!selectedGradeGroupFilter?.id,
        staleTime: 5 * 60 * 1000,
    });

    const searchGradeOptions: QuestionOptionItem[] = (searchGradesQuery.data || []).map((g: any) => ({
        id: String(g.id || g.name),
        name: String(g.name),
    }));

    const searchSubjectsQuery = useQuery({
        queryKey: ['searchSubjectsList', selectedGradeFilter?.id],
        queryFn: () => getSubjectsByGrade(selectedGradeFilter?.id ?? ''),
        enabled: !!selectedGradeFilter?.id,
        staleTime: 5 * 60 * 1000,
    });

    const searchSubjectOptions: QuestionOptionItem[] = (searchSubjectsQuery.data || []).map((s: any) => ({
        id: String(s.id || s.name),
        name: String(s.name),
    }));

    const searchCompetenciesQuery = useQuery({
        queryKey: ['searchCompetenciesList', selectedGradeFilter?.id, selectedSubjectFilter?.id, selectedTermFilter?.id],
        queryFn: () => getCompetenciesList({
            gradeId: Number(selectedGradeFilter?.id),
            subjectId: Number(selectedSubjectFilter?.id),
            term: selectedTermFilter?.id ?? '',
        }),
        enabled: !!selectedGradeFilter?.id && !!selectedSubjectFilter?.id && !!selectedTermFilter?.id,
        staleTime: 5 * 60 * 1000,
    });

    const searchCompetencyOptions: QuestionOptionItem[] = (searchCompetenciesQuery.data || []).map((c: any) => ({
        id: String(c.id || c.name),
        name: String(c.name),
    }));

    const invalidateQuestions = () =>
        queryClient.invalidateQueries({
            queryKey: questionQueryKey(),
        });

    const generateQuestionsMutation = useMutation({
        mutationFn: generateQuestions,
        onSuccess: () => {
            showToast({ message: 'Questions generated successfully', type: 'success' });
            setPage(1);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to generate questions',
                type: 'error',
            });
        },
        onSettled: invalidateQuestions,
    });

    const createQuestionMutation = useMutation({
        mutationFn: createQuestion,
        onSuccess: () => {
            showToast({ message: 'Question added successfully', type: 'success' });
            setIsFormModalOpen(false);
            setPage(1);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to add question',
                type: 'error',
            });
        },
        onSettled: invalidateQuestions,
    });

    const updateQuestionMutation = useMutation({
        mutationFn: ({ questionId, payload }: { questionId: string; payload: QuestionFormValues }) =>
            updateQuestion(questionId, payload),
        onSuccess: () => {
            showToast({ message: 'Question updated successfully', type: 'success' });
            setIsFormModalOpen(false);
            setSelectedQuestion(null);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to update question',
                type: 'error',
            });
        },
        onSettled: invalidateQuestions,
    });

    const deleteQuestionMutation = useMutation({
        mutationFn: deleteQuestion,
        onSuccess: () => {
            showToast({ message: 'Question deleted successfully', type: 'success' });
            setIsDeleteModalOpen(false);
            setSelectedQuestion(null);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to delete question',
                type: 'error',
            });
        },
        onSettled: invalidateQuestions,
    });

    const generateImageMutation = useMutation({
        mutationFn: generateQuestionImage,
        onSuccess: () => {
            showToast({ message: 'Image generated successfully', type: 'success' });
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to generate image',
                type: 'error',
            });
        },
        onSettled: invalidateQuestions,
    });

    const uploadImageMutation = useMutation({
        mutationFn: uploadQuestionImage,
        onSuccess: () => {
            showToast({ message: 'Image uploaded successfully', type: 'success' });
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to upload image',
                type: 'error',
            });
        },
        onSettled: invalidateQuestions,
    });

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };

    const handleGenerateValueChange = (
        key: keyof GenerateQuestionsPayload,
        value: string | number | string[],
    ) => {
        setGenerateValues((previous) => {
            const next = { ...previous, [key]: value };
            // Cascading reset: changing a parent clears all children
            if (key === 'gradeGroup') {
                next.grade = '';
                next.subject = '';
                next.term = '';
                next.competencyIds = [];
            } else if (key === 'grade') {
                next.subject = '';
                next.term = '';
                next.competencyIds = [];
            } else if (key === 'subject') {
                next.term = '';
                next.competencyIds = [];
            } else if (key === 'term') {
                next.competencyIds = [];
            }
            return next;
        });
    };

    const handleGenerateQuestions = () => {
        if (
            !generateValues.gradeGroup ||
            !generateValues.grade ||
            !generateValues.subject ||
            !generateValues.term ||
            generateValues.count < 1
        ) {
            showToast({ message: 'Please complete all generate fields', type: 'error' });
            return;
        }

        generateQuestionsMutation.mutate(generateValues);
    };

    const handleResetFilters = () => {
        setSearchValue('');
        setSelectedGradeGroupFilter(null);
        setSelectedGradeFilter(null);
        setSelectedSubjectFilter(null);
        setSelectedTermFilter(null);
        setSelectedCompetencyFilter(null);
        setSelectedStatusFilter(null);
        setPage(1);
    };

    const handleResetGenerateFilters = () => {
        setGenerateValues({
            gradeGroup: '',
            grade: '',
            subject: '',
            term: '',
            competencyIds: [],
            count: 2,
        });
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedQuestion(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (question: QuestionRecord) => {
        setModalMode('edit');
        setSelectedQuestion(question);
        setIsFormModalOpen(true);
    };

    const handleOpenPreviewModal = (question: QuestionRecord) => {
        setSelectedQuestion(question);
        setIsPreviewModalOpen(true);
    };

    const handleOpenDeleteModal = (question: QuestionRecord) => {
        setSelectedQuestion(question);
        setIsDeleteModalOpen(true);
    };

    const handleSubmitQuestion = (payload: QuestionFormValues) => {
        if (modalMode === 'edit' && selectedQuestion) {
            updateQuestionMutation.mutate({ questionId: selectedQuestion.id, payload });
            return;
        }

        createQuestionMutation.mutate(payload);
    };

    const handleSaveQuestionEditor = (payload: QuestionFormValues) => {
        if (!selectedQuestion) {
            return;
        }

        updateQuestionMutation.mutate({ questionId: selectedQuestion.id, payload });
        setIsPreviewModalOpen(false);
    };

    const handleDeleteQuestion = () => {
        if (selectedQuestion) {
            deleteQuestionMutation.mutate(selectedQuestion.id);
        }
    };

    const total = questionListQuery.data?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / QUESTION_PAGE_SIZE), 1);
    const hasActiveFilters = Boolean(
        searchValue.trim() ||
        selectedGradeGroupFilter ||
        selectedGradeFilter ||
        selectedSubjectFilter ||
        selectedTermFilter ||
        selectedCompetencyFilter ||
        selectedStatusFilter,
    );

    return {
        filters,
        generateValues,
        handleDeleteQuestion,
        handleGenerateQuestions,
        handleGenerateValueChange,
        handleOpenAddModal,
        handleOpenDeleteModal,
        handleOpenEditModal,
        handleOpenPreviewModal,
        handleResetFilters,
        handleResetGenerateFilters,
        handleSearchChange,
        handleSaveQuestionEditor,
        handleSubmitQuestion,
        hasActiveFilters,
        isDeleteModalOpen,
        isDeleting: deleteQuestionMutation.isPending,
        isGeneratingImage: generateImageMutation.isPending,
        generateImageMutation,
        uploadImageMutation,
        isUploadingImage: uploadImageMutation.isPending,
        isFormModalOpen,
        isGenerating: generateQuestionsMutation.isPending,
        isPreviewModalOpen,
        isSubmitting: createQuestionMutation.isPending || updateQuestionMutation.isPending,
        modalMode,
        page,
        questionListQuery,
        searchValue,
        selectedCompetencyFilter,
        selectedGradeFilter,
        selectedQuestion,
        selectedStatusFilter,
        selectedSubjectFilter,
        setIsDeleteModalOpen,
        setIsFormModalOpen,
        setIsPreviewModalOpen,
        setPage,
        setSelectedCompetencyFilter,
        setSelectedGradeFilter,
        setSelectedStatusFilter,
        setSelectedSubjectFilter,
        totalPages,
        gradeGroupOptions,
        gradeOptions,
        subjectOptions,
        competencyOptions,
        selectedGradeGroupFilter,
        setSelectedGradeGroupFilter,
        selectedTermFilter,
        setSelectedTermFilter,
        searchGradeOptions,
        searchSubjectOptions,
        searchCompetencyOptions,
        handleGradeGroupFilterChange,
        handleGradeFilterChange,
        handleSubjectFilterChange,
        handleTermFilterChange,
    };
};
