'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showToast } from '@/components/ui/Toaster/constant';

import { Reviewer, ReviewerFormValues } from '@/types/reviewer';

import useDebounce from '@/utils/useDebounce';

import { REVIEWER_PAGE_SIZE } from '../components/ReviewerManagementPage/constant';
import {
    createReviewer,
    reviewerListQueryOptions,
    reviewerQueryKey,
    updateReviewer,
    updateReviewerStatus,
} from '../components/ReviewerManagementPage/utils';

export type ReviewerModalMode = 'add' | 'edit';

export const useReviewerManagement = () => {
    const queryClient = useQueryClient();
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ReviewerModalMode>('add');
    const [selectedReviewer, setSelectedReviewer] = useState<Reviewer | null>(null);

    const debouncedSearch = useDebounce(searchValue, 400);

    const filters = useMemo(
        () => ({
            search: debouncedSearch.trim(),
            page,
            limit: REVIEWER_PAGE_SIZE,
        }),
        [debouncedSearch, page],
    );

    const reviewerListQuery = useQuery(queryOptions(reviewerListQueryOptions(filters)));

    const invalidateReviewerList = () =>
        queryClient.invalidateQueries({
            queryKey: reviewerQueryKey(),
        });

    const createReviewerMutation = useMutation({
        mutationFn: createReviewer,
        onSuccess: () => {
            showToast({ message: 'Reviewer added successfully', type: 'success' });
            setIsFormModalOpen(false);
            setSelectedReviewer(null);
            setPage(1);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to add reviewer',
                type: 'error',
            });
        },
        onSettled: invalidateReviewerList,
    });

    const updateReviewerMutation = useMutation({
        mutationFn: ({ reviewerId, payload }: { reviewerId: string; payload: ReviewerFormValues }) =>
            updateReviewer(reviewerId, payload),
        onSuccess: () => {
            showToast({ message: 'Reviewer updated successfully', type: 'success' });
            setIsFormModalOpen(false);
            setSelectedReviewer(null);
        },
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to update reviewer',
                type: 'error',
            });
        },
        onSettled: invalidateReviewerList,
    });

    const updateReviewerStatusMutation = useMutation({
        mutationFn: ({ reviewerId, status }: { reviewerId: string; status: number }) =>
            updateReviewerStatus(reviewerId, { status }),
        onSuccess: () => {
            showToast({ message: 'Reviewer status updated successfully', type: 'success' });
        },
        onError: (error) => {
            showToast({
                message:
                    error instanceof Error ? error.message : 'Unable to update reviewer status',
                type: 'error',
            });
        },
        onSettled: invalidateReviewerList,
    });

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchValue('');
        setPage(1);
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedReviewer(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (reviewer: Reviewer) => {
        setModalMode('edit');
        setSelectedReviewer(reviewer);
        setIsFormModalOpen(true);
    };

    const handleSubmitReviewer = (payload: ReviewerFormValues) => {
        if (modalMode === 'edit' && selectedReviewer) {
            updateReviewerMutation.mutate({ reviewerId: selectedReviewer.id, payload });
            return;
        }

        createReviewerMutation.mutate(payload);
    };

    const handleToggleReviewerStatus = (reviewer: Reviewer) => {
        updateReviewerStatusMutation.mutate({
            reviewerId: reviewer.id,
            status: reviewer.status === 1 ? 0 : 1,
        });
    };

    const total = reviewerListQuery.data?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / REVIEWER_PAGE_SIZE), 1);
    const hasActiveFilters = Boolean(searchValue.trim());

    return {
        handleClearFilters,
        handleOpenAddModal,
        handleOpenEditModal,
        handleSearchChange,
        handleSubmitReviewer,
        handleToggleReviewerStatus,
        hasActiveFilters,
        isFormModalOpen,
        isStatusUpdating: updateReviewerStatusMutation.isPending,
        isSubmitting: createReviewerMutation.isPending || updateReviewerMutation.isPending,
        modalMode,
        page,
        reviewerListQuery,
        searchValue,
        selectedReviewer,
        setIsFormModalOpen,
        setPage,
        totalPages,
    };
};
