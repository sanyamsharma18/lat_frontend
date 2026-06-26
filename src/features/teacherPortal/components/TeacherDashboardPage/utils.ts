import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import { TeacherDashboardSummary } from '@/types/student';

import { QueryKeys } from '@/utils/queryKeys';

export const MOCK_TEACHER_DASHBOARD: TeacherDashboardSummary = {
    totalStudents: 120,
    activeStudents: 95,
    inactiveStudents: 25,
    totalQuestionsAttempted: 4580,
    isMock: true,
};

export const teacherDashboardQueryKey = () => [QueryKeys.TEACHER_DASHBOARD] as const;

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

const normalizeTeacherDashboard = (response: unknown): TeacherDashboardSummary => {
    const source = getSummarySource(response);

    if (!isRecord(source)) {
        return MOCK_TEACHER_DASHBOARD;
    }

    return {
        totalStudents: getNumberValue(source, ['totalStudents']),
        activeStudents: getNumberValue(source, ['activeStudents']),
        inactiveStudents: getNumberValue(source, ['inactiveStudents']),
        totalQuestionsAttempted: getNumberValue(source, ['totalQuestionsAttempted']),
        isMock: source.isMock === true,
    };
};

const assertSuccessfulResponse = (response: ApiResponse<unknown>) => {
    if (response.status === false) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response;
};

export const getTeacherDashboard = async () => {
    try {
        const response = await callApi<ApiResponse<unknown>>({
            url: ServerSideRoutes.TEACHER_DASHBOARD,
            method: HTTP_METHOD.GET,
        });

        return normalizeTeacherDashboard(assertSuccessfulResponse(response));
    } catch (error) {
        console.error('Teacher dashboard API failed.', error);
        throw error;
    }
};

export const teacherDashboardQueryOptions = () => ({
    queryKey: teacherDashboardQueryKey(),
    queryFn: getTeacherDashboard,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
