'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showToast } from '@/components/ui/Toaster/constant';

import { QuestionOptionItem } from '@/types/questionGenerator';
import { ReviewerQuestion, ReviewQuestionPayload } from '@/types/reviewerQuestion';

import useDebounce from '@/utils/useDebounce';

import { REVIEWER_QUESTION_PAGE_SIZE } from '../components/ReviewerQuestionManagementPage/constant';
import {
    getCompetenciesList,
    gradeGroupQueryOptions,
    getGradesByGradeGroup,
    getSubjectsByGrade,
    reviewerQuestionsQueryKey,
    reviewerQuestionsQueryOptions,
    reviewQuestion,
} from '../components/ReviewerQuestionManagementPage/utils';

export const useReviewerQuestionManagement = () => {
    const queryClient = useQueryClient();
    const [searchValue, setSearchValue] = useState('');
    const [selectedGradeGroup, setSelectedGradeGroup] = useState<QuestionOptionItem | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<QuestionOptionItem | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<QuestionOptionItem | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<QuestionOptionItem | null>(null);
    const [selectedCompetency, setSelectedCompetency] = useState<QuestionOptionItem | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<QuestionOptionItem | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<ReviewerQuestion | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(searchValue, 400);

    const gradeGroupsQuery = useQuery(gradeGroupQueryOptions());

    const gradeGroupsQueryData = gradeGroupsQuery.data ?? [];
    const gradeGroupOptions: QuestionOptionItem[] = useMemo(
        () =>
            (gradeGroupsQueryData as any[]).map((g: any) => ({
                id: String(g.id),
                name: String(g.name),
            })),
        [gradeGroupsQueryData],
    );

    const gradesQuery = useQuery({
        queryKey: ['gradesByGradeGroup', selectedGradeGroup?.id],
        queryFn: () => getGradesByGradeGroup(selectedGradeGroup!.id),
        enabled: !!selectedGradeGroup,
        staleTime: 5 * 60 * 1000,
    });

    const gradesQueryData = gradesQuery.data ?? [];
    const gradeOptions: QuestionOptionItem[] = useMemo(
        () =>
            (gradesQueryData as any[]).map((g: any) => ({
                id: String(g.id),
                name: String(g.name),
            })),
        [gradesQueryData],
    );

    const subjectsQuery = useQuery({
        queryKey: ['subjectsByGrade', selectedGrade?.id],
        queryFn: () => getSubjectsByGrade(selectedGrade!.id),
        enabled: !!selectedGrade,
        staleTime: 5 * 60 * 1000,
    });

    const subjectsQueryData = subjectsQuery.data ?? [];
    const subjectOptions: QuestionOptionItem[] = useMemo(
        () =>
            (subjectsQueryData as any[]).map((s: any) => ({
                id: String(s.id),
                name: String(s.name),
            })),
        [subjectsQueryData],
    );

    const competenciesQuery = useQuery({
        queryKey: ['competencies', selectedGrade?.id, selectedSubject?.id, selectedTerm?.id],
        queryFn: () =>
            getCompetenciesList({
                gradeId: Number(selectedGrade!.id),
                subjectId: Number(selectedSubject!.id),
                term: selectedTerm!.id,
            }),
        enabled: !!selectedGrade && !!selectedSubject && !!selectedTerm,
        staleTime: 5 * 60 * 1000,
    });

    const competenciesQueryData = competenciesQuery.data ?? [];
    const competencyOptions: QuestionOptionItem[] = useMemo(
        () =>
            (competenciesQueryData as any[]).map((c: any) => ({
                id: String(c.id),
                name: String(c.name),
            })),
        [competenciesQueryData],
    );

    const handleGradeGroupChange = (option: QuestionOptionItem | null) => {
        setSelectedGradeGroup(option);
        setSelectedGrade(null);
        setSelectedSubject(null);
        setSelectedTerm(null);
        setSelectedCompetency(null);
        setPage(1);
    };

    const handleGradeChange = (option: QuestionOptionItem | null) => {
        setSelectedGrade(option);
        setSelectedSubject(null);
        setSelectedTerm(null);
        setSelectedCompetency(null);
        setPage(1);
    };

    const handleSubjectChange = (option: QuestionOptionItem | null) => {
        setSelectedSubject(option);
        setSelectedTerm(null);
        setSelectedCompetency(null);
        setPage(1);
    };

    const handleTermChange = (option: QuestionOptionItem | null) => {
        setSelectedTerm(option);
        setSelectedCompetency(null);
        setPage(1);
    };

    const filters = useMemo(
        () => ({
            search: debouncedSearch.trim(),
            grade: selectedGrade?.id ?? '',
            subject: selectedSubject?.id ?? '',
            term: selectedTerm?.id ?? '',
            competency: selectedCompetency?.id ?? '',
            status: selectedStatus?.id ?? '',
            page,
            limit: REVIEWER_QUESTION_PAGE_SIZE,
        }),
        [
            debouncedSearch,
            page,
            selectedCompetency?.id,
            selectedGrade?.id,
            selectedStatus?.id,
            selectedSubject?.id,
            selectedTerm?.id,
        ],
    );

    const questionListQuery = useQuery(queryOptions(reviewerQuestionsQueryOptions(filters)));

    const invalidateQuestions = () =>
        queryClient.invalidateQueries({
            queryKey: reviewerQuestionsQueryKey(),
        });

    const reviewQuestionMutation = useMutation({
        mutationFn: ({
            questionId,
            payload,
        }: {
            questionId: string;
            payload: ReviewQuestionPayload;
        }) => reviewQuestion(questionId, payload),
        onSuccess: (_, variables) => {
            showToast({
                message: `Question ${variables.payload.status.toLowerCase()} successfully`,
                type: 'success',
            });
            setIsPreviewOpen(false);
            setSelectedQuestion(null);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to review question',
                type: 'error',
            });
        },
        onSettled: invalidateQuestions,
    });

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };

    const handleResetFilters = () => {
        setSearchValue('');
        setSelectedGradeGroup(null);
        setSelectedGrade(null);
        setSelectedSubject(null);
        setSelectedTerm(null);
        setSelectedCompetency(null);
        setSelectedStatus(null);
        setPage(1);
    };

    const handleOpenPreview = (question: ReviewerQuestion) => {
        setSelectedQuestion(question);
        setIsPreviewOpen(true);
    };

    const handleReviewQuestion = (payload: ReviewQuestionPayload) => {
        if (!selectedQuestion) return;

        reviewQuestionMutation.mutate({
            questionId: selectedQuestion.id,
            payload,
        });
    };

    const total = questionListQuery.data?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / REVIEWER_QUESTION_PAGE_SIZE), 1);
    const hasActiveFilters = Boolean(
        searchValue.trim() ||
            selectedGradeGroup ||
            selectedGrade ||
            selectedSubject ||
            selectedTerm ||
            selectedCompetency ||
            selectedStatus,
    );

    return {
        competencyOptions,
        gradeGroupOptions,
        gradeOptions,
        gradeGroupLoading: gradeGroupsQuery.isLoading,
        gradesLoading: gradesQuery.isLoading,
        subjectsLoading: subjectsQuery.isLoading,
        competenciesLoading: competenciesQuery.isLoading,
        handleGradeChange,
        handleGradeGroupChange,
        handleOpenPreview,
        handleResetFilters,
        handleReviewQuestion,
        handleSearchChange,
        handleSubjectChange,
        handleTermChange,
        hasActiveFilters,
        isPreviewOpen,
        isReviewing: reviewQuestionMutation.isPending,
        page,
        questionListQuery,
        searchValue,
        selectedCompetency,
        selectedGrade,
        selectedGradeGroup,
        selectedQuestion,
        selectedStatus,
        selectedSubject,
        selectedTerm,
        setIsPreviewOpen,
        setPage,
        setSelectedCompetency,
        setSelectedStatus,
        subjectOptions,
        totalPages,
    };
};
