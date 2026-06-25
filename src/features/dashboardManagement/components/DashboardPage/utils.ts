import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import { DashboardSummary } from '@/types/dashboard';

import { QueryKeys } from '@/utils/queryKeys';

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
    totalTeachers: 125,
    totalStudents: 4250,
    totalQuestionsGenerated: 25840,
    totalQuestionsAttemptedLastYear: 18520,
    isMock: true,
};

export const dashboardSummaryQueryKey = () => [QueryKeys.DASHBOARD_SUMMARY] as const;

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

    if (isRecord(response.data)) {
        return response.data;
    }

    if (isRecord(response.response)) {
        return response.response;
    }

    return response;
};

const normalizeDashboardSummary = (response: unknown): DashboardSummary => {
    const source = getSummarySource(response);

    if (!isRecord(source)) {
        return MOCK_DASHBOARD_SUMMARY;
    }

    return {
        totalTeachers: getNumberValue(source, ['totalTeachers', 'teachersCount']),
        totalStudents: getNumberValue(source, ['totalStudents', 'studentsCount']),
        totalQuestionsGenerated: getNumberValue(source, [
            'totalQuestionsGenerated',
            'questionsGenerated',
        ]),
        totalQuestionsAttemptedLastYear: getNumberValue(source, [
            'totalQuestionsAttemptedLastYear',
            'questionsAttemptedLastYear',
        ]),
        isMock: source.isMock === true,
    };
};

const assertSuccessfulResponse = (response: ApiResponse<unknown>) => {
    if (response.status === false) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response;
};

export const getDashboardSummary = async () => {
    try {
        const response = await callApi<ApiResponse<unknown>>({
            url: ServerSideRoutes.ADMIN_DASHBOARD,
            method: HTTP_METHOD.GET,
        });

        return normalizeDashboardSummary(assertSuccessfulResponse(response));
    } catch (error) {
        console.warn('Dashboard summary API failed. Falling back to mock data.', error);

        return MOCK_DASHBOARD_SUMMARY;
    }
};

export const dashboardSummaryQueryOptions = () => ({
    queryKey: dashboardSummaryQueryKey(),
    queryFn: getDashboardSummary,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
