'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { reviewerDashboardQueryOptions } from '../components/ReviewerDashboardPage/utils';

export const useReviewerDashboard = () => {
    const reviewerDashboardQuery = useQuery(queryOptions(reviewerDashboardQueryOptions()));

    return {
        reviewerDashboardQuery,
    };
};
