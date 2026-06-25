import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import { ExamInstructionsResponse, StudentProfile } from '@/types/studentPortal';

import { QueryKeys } from '@/utils/queryKeys';

export const studentProfileQueryKey = () => [QueryKeys.STUDENT_PROFILE] as const;

export const examInstructionsQueryKey = () => [QueryKeys.EXAM_INSTRUCTIONS] as const;

const assertSuccessfulResponse = <TResponse>(response: ApiResponse<TResponse>) => {
    if (response.status === false || !response.response) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response.response;
};

export const getStudentProfile = async () => {
    const response = await callApi<ApiResponse<StudentProfile>>({
        url: ServerSideRoutes.STUDENT_PROFILE,
        method: HTTP_METHOD.GET,
    });

    return assertSuccessfulResponse(response);
};

export const getExamInstructions = async () => {
    const response = await callApi<ApiResponse<ExamInstructionsResponse>>({
        url: ServerSideRoutes.STUDENT_EXAM_INSTRUCTIONS,
        method: HTTP_METHOD.GET,
    });

    return assertSuccessfulResponse(response);
};

export const studentProfileQueryOptions = () => ({
    queryKey: studentProfileQueryKey(),
    queryFn: getStudentProfile,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const examInstructionsQueryOptions = () => ({
    queryKey: examInstructionsQueryKey(),
    queryFn: getExamInstructions,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
