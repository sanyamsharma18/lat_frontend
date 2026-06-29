import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import Cookies from 'js-cookie';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import {
    ExamInstructionsResponse,
    StudentExamCheckPayload,
    StudentExamCheckResponse,
    StudentProfile,
} from '@/types/studentPortal';

import { QueryKeys } from '@/utils/queryKeys';
import { API_ROUTES } from '@/config/apiRoutes';
import { JWT_TOKEN } from '@/constants/authSession';

export const studentProfileQueryKey = () => [QueryKeys.STUDENT_PROFILE] as const;

export const examInstructionsQueryKey = () => [QueryKeys.EXAM_INSTRUCTIONS] as const;

export const studentExamStatusQueryKey = (studentId?: string) =>
    [QueryKeys.STUDENT_EXAM_STATUS, studentId] as const;

const DEFAULT_EXAM_CONTEXT = {
    termId: 1,
};

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

export const getStudentExamStatus = async (studentId: string) => {
    const token = Cookies.get(JWT_TOKEN);

    const numericStudentId = Number(studentId);

    if (!token) {
        throw new Error('Unable to verify student session');
    }

    if (!Number.isFinite(numericStudentId) || numericStudentId <= 0) {
        throw new Error('Unable to identify logged-in student');
    }

    const payload: StudentExamCheckPayload = {
        studentId: numericStudentId,
        ...DEFAULT_EXAM_CONTEXT,
    };

    const response = await callApi<ApiResponse<StudentExamCheckResponse>>({
        url: API_ROUTES.studentExamCheck,
        method: HTTP_METHOD.POST,
        body: payload,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return assertSuccessfulResponse(response);
};

export const studentProfileQueryOptions = (initialData?: StudentProfile) => ({
    queryKey: studentProfileQueryKey(),
    queryFn: getStudentProfile,
    initialData,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const examInstructionsQueryOptions = (initialData?: ExamInstructionsResponse) => ({
    queryKey: examInstructionsQueryKey(),
    queryFn: getExamInstructions,
    initialData,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const studentExamStatusQueryOptions = (
    studentId?: string,
    initialData?: StudentExamCheckResponse,
) => ({
    queryKey: studentExamStatusQueryKey(studentId),
    queryFn: () => getStudentExamStatus(studentId ?? ''),
    enabled: Boolean(studentId),
    initialData,
    staleTime: 0,
    gcTime: StaleAndCacheTime.CACHE_TIME,
    refetchOnMount: 'always' as const,
});
