import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi, { QueryParamType } from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import {
    GenerateQuestionsPayload,
    QuestionFormValues,
    QuestionListFilters,
    QuestionListResponse,
} from '@/types/questionGenerator';

import { QueryKeys } from '@/utils/queryKeys';

export const questionQueryKey = (filters?: QuestionListFilters) =>
    filters ? ([QueryKeys.QUESTIONS, filters] as const) : ([QueryKeys.QUESTIONS] as const);

const assertSuccessfulResponse = <TResponse>(response: ApiResponse<TResponse>) => {
    if (response.status === false || !response.response) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response.response;
};

export const getQuestionList = async (filters: QuestionListFilters) => {
    const queryParams: QueryParamType = {
        search: filters.search || null,
        grade: filters.grade || null,
        subject: filters.subject || null,
        competency: filters.competency || null,
        status: filters.status || null,
        page: String(filters.page),
        limit: String(filters.limit),
    };

    const response = await callApi<ApiResponse<QuestionListResponse>>({
        url: ServerSideRoutes.ADMIN_QUESTIONS,
        method: HTTP_METHOD.GET,
        queryParams,
    });

    return assertSuccessfulResponse(response);
};

export const createQuestion = async (payload: QuestionFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.ADMIN_QUESTIONS,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then(assertSuccessfulResponse);

export const updateQuestion = async (questionId: string, payload: QuestionFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.ADMIN_QUESTIONS}/${questionId}`,
        method: HTTP_METHOD.PUT,
        body: payload,
    }).then(assertSuccessfulResponse);

export const deleteQuestion = async (questionId: string) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.ADMIN_QUESTIONS}/${questionId}`,
        method: HTTP_METHOD.DELETE,
    }).then(assertSuccessfulResponse);

export const generateQuestions = async (payload: GenerateQuestionsPayload) =>
    callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.ADMIN_QUESTIONS_GENERATE,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then(assertSuccessfulResponse);

export const questionListQueryOptions = (filters: QuestionListFilters) => ({
    queryKey: questionQueryKey(filters),
    queryFn: () => getQuestionList(filters),
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
