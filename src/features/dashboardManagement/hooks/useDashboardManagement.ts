'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { dashboardSummaryQueryOptions } from '../components/DashboardPage/utils';

export const useDashboardManagement = () => {
    const dashboardSummaryQuery = useQuery(queryOptions(dashboardSummaryQueryOptions()));

    return {
        dashboardSummaryQuery,
    };
};
