import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import { ReviewerDashboardSummary } from '@/types/reviewerDashboard';

import { QueryKeys } from '@/utils/queryKeys';

import { DEFAULT_REVIEWER_SUMMARY } from './constant';

export const reviewerDashboardQueryKey = () => [QueryKeys.REVIEWER_DASHBOARD] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const getNumberValue = (source: Record<string, unknown>, keys: string[]) => {
    const value = keys.map((key) => source[key]).find((item) => typeof item === 'number');

    return typeof value === 'number' ? value : 0;
};

const getSummarySource = (response: unknown) => {
    if (!isRecord(response)) {
        return {};
    }

    if (isRecord(response.response) && isRecord(response.response.data)) {
        return response.response.data;
    }

    if (isRecord(response.data)) {
        return response.data;
    }

    if (isRecord(response.response)) {
        return response.response;
    }

    return response;
};

const normalizeReviewerDashboard = (response: unknown): ReviewerDashboardSummary => {
    const source = getSummarySource(response);

    if (!isRecord(source)) {
        return DEFAULT_REVIEWER_SUMMARY;
    }

    return {
        totalQuestions: getNumberValue(source, ['totalQuestions', 'totalQuestionCount']),
        approvedQuestions: getNumberValue(source, ['approvedQuestions', 'approvedQuestionCount']),
        rejectedQuestions: getNumberValue(source, ['rejectedQuestions', 'rejectedQuestionCount']),
        pendingQuestions: getNumberValue(source, ['pendingQuestions', 'pendingQuestionCount']),
        isMock: source.isMock === true,
    };
};

const assertSuccessfulResponse = (response: ApiResponse<unknown>) => {
    if (response.status === false) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response;
};

export const getReviewerDashboard = async () => {
    const response = await callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.REVIEWER_DASHBOARD,
        method: HTTP_METHOD.GET,
    });

    return normalizeReviewerDashboard(assertSuccessfulResponse(response));
};

export const reviewerDashboardQueryOptions = () => ({
    queryKey: reviewerDashboardQueryKey(),
    queryFn: getReviewerDashboard,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
