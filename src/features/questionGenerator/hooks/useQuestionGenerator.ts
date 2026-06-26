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
} from '../components/QuestionGeneratorPage/utils';

export type QuestionModalMode = 'add' | 'edit';

export const useQuestionGenerator = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [selectedGradeFilter, setSelectedGradeFilter] = useState<QuestionOptionItem | null>(null);
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<QuestionOptionItem | null>(
        null,
    );
    const [selectedCompetencyFilter, setSelectedCompetencyFilter] =
        useState<QuestionOptionItem | null>(null);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<QuestionOptionItem | null>(
        null,
    );
    const [generateValues, setGenerateValues] = useState<GenerateQuestionsPayload>({
        gradeGroup: '',
        grade: '',
        subject: '',
        competencyIds: [],
        count: 10,
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
        ],
    );

    const questionListQuery = useQuery(queryOptions(questionListQueryOptions(filters)));

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

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };

    const handleGenerateValueChange = (
        key: keyof GenerateQuestionsPayload,
        value: string | number | string[],
    ) => {
        setGenerateValues((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const handleGenerateQuestions = () => {
        if (
            !generateValues.gradeGroup ||
            !generateValues.grade ||
            !generateValues.subject ||
            !generateValues.competencyIds.length ||
            generateValues.count < 1
        ) {
            showToast({ message: 'Please complete all generate fields', type: 'error' });
            return;
        }

        generateQuestionsMutation.mutate(generateValues);
    };

    const handleResetFilters = () => {
        setSearchValue('');
        setSelectedGradeFilter(null);
        setSelectedSubjectFilter(null);
        setSelectedCompetencyFilter(null);
        setSelectedStatusFilter(null);
        setPage(1);
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
            selectedGradeFilter ||
            selectedSubjectFilter ||
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
        handleSearchChange,
        handleSaveQuestionEditor,
        handleSubmitQuestion,
        hasActiveFilters,
        isDeleteModalOpen,
        isDeleting: deleteQuestionMutation.isPending,
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
    };
};
