import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi, { QueryParamType } from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import {
    ReviewerQuestion,
    ReviewerQuestionFilters,
    ReviewerQuestionListResponse,
    ReviewQuestionPayload,
} from '@/types/reviewerQuestion';

import { QueryKeys } from '@/utils/queryKeys';

export const reviewerQuestionsQueryKey = (filters?: ReviewerQuestionFilters) =>
    filters
        ? ([QueryKeys.REVIEWER_QUESTIONS, filters] as const)
        : ([QueryKeys.REVIEWER_QUESTIONS] as const);

const assertSuccessfulResponse = <T>(response: T) => {
    if ((response as ApiResponse<unknown>)?.status === false) {
        throw new Error(
            (response as ApiResponse<unknown>).message ||
                (response as ApiResponse<unknown>).error ||
                'Question request failed',
        );
    }

    return response;
};

const extractDataArray = (response: any): ReviewerQuestion[] => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.response)) return response.response;
    if (Array.isArray(response?.response?.questions)) return response.response.questions;
    if (Array.isArray(response?.response?.data)) return response.response.data;
    if (Array.isArray(response?.data)) return response.data;

    return [];
};

const extractTotal = (response: any, fallback: number) => {
    if (response?.response?.total !== undefined) return Number(response.response.total);
    if (response?.total !== undefined) return Number(response.total);

    return fallback;
};

export const getReviewerQuestions = async (
    filters: ReviewerQuestionFilters,
): Promise<ReviewerQuestionListResponse> => {
    const queryParams: QueryParamType = {
        page: String(filters.page),
        limit: String(filters.limit),
    };

    if (filters.search) queryParams.search = filters.search;
    if (filters.gradeGroup) queryParams.gradeGroup = filters.gradeGroup;
    if (filters.grade) queryParams.grade = filters.grade;
    if (filters.subject) queryParams.subject = filters.subject;
    if (filters.term) queryParams.term = filters.term;
    if (filters.competency) queryParams.competency = filters.competency;
    if (filters.status) queryParams.status = filters.status;

    const response = await callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.REVIEWER_QUESTIONS,
        method: HTTP_METHOD.GET,
        queryParams,
    });

    assertSuccessfulResponse(response);

    const questions = extractDataArray(response);

    return {
        questions,
        total: extractTotal(response, questions.length),
        page: filters.page,
        limit: filters.limit,
    };
};

export const reviewQuestion = async (questionId: string, payload: ReviewQuestionPayload) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.REVIEWER_QUESTIONS}/${questionId}/review`,
        method: HTTP_METHOD.PATCH,
        body: payload,
    }).then(assertSuccessfulResponse);

export const reviewerQuestionsQueryOptions = (filters: ReviewerQuestionFilters) => ({
    queryKey: reviewerQuestionsQueryKey(filters),
    queryFn: () => getReviewerQuestions(filters),
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

const extractDataArrayFromResponse = (res: any): any[] => {
    if (res?.response?.data && Array.isArray(res.response.data)) {
        return res.response.data;
    }
    if (res?.data && Array.isArray(res.data)) {
        return res.data;
    }
    if (res?.response && Array.isArray(res.response)) {
        return res.response;
    }
    if (Array.isArray(res)) {
        return res;
    }
    return [];
};

export const getGradeGroups = async () =>
    callApi<any>({
        url: ServerSideRoutes.GRADE_GROUP,
        method: HTTP_METHOD.GET,
    }).then(extractDataArrayFromResponse);

export const getGradesByGradeGroup = async (gradeGroupId: string) =>
    callApi<any>({
        url: `${ServerSideRoutes.GRADES_BY_GRADE_GROUP}/${gradeGroupId}`,
        method: HTTP_METHOD.GET,
    }).then(extractDataArrayFromResponse);

export const getSubjectsByGrade = async (gradeId: string) =>
    callApi<any>({
        url: `${ServerSideRoutes.SUBJECTS_BY_GRADE}/${gradeId}`,
        method: HTTP_METHOD.GET,
    }).then(extractDataArrayFromResponse);

export const gradeGroupQueryKey = () => ['gradeGroup'] as const;
export const gradeGroupQueryOptions = () => ({
    queryKey: gradeGroupQueryKey(),
    queryFn: getGradeGroups,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const getCompetenciesList = async (payload: { gradeId: number; subjectId: number; term: string }) =>
    callApi<any>({
        url: ServerSideRoutes.COMPETENCIES_LIST,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then((res) => {
        if (res?.response?.data && Array.isArray(res.response.data)) {
            return res.response.data;
        }
        if (res?.data && Array.isArray(res.data)) {
            return res.data;
        }
        if (res?.response && Array.isArray(res.response)) {
            return res.response;
        }
        if (Array.isArray(res)) {
            return res;
        }
        return [];
    });
