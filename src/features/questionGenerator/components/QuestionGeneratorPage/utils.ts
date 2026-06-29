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
        termId: filters.termId || null,
        page: String(filters.page),
        limit: String(filters.limit),
    };

    const response = await callApi<ApiResponse<QuestionListResponse>>({
        url: 'http://192.168.0.233:3001/api/v1/questions',
        method: HTTP_METHOD.GET,
        queryParams,
    });

    return assertSuccessfulResponse(response);
};

export const generateQuestionImage = async (payload: {
    questionId: number;
    prompt: string;
    optionLetter?: string;
}) =>
    callApi<ApiResponse<{ imageUrl: string; fileName: string }>>({
        url: 'http://192.168.0.233:3001/api/v1/questions/generate-image',
        method: HTTP_METHOD.POST,
        body: payload,
    }).then(assertSuccessfulResponse);

export const uploadQuestionImage = async (payload: {
    questionId: number;
    file: File;
    optionLetter?: string;
}) => {
    const formData = new FormData();
    formData.append('questionId', String(payload.questionId));
    formData.append('file', payload.file);
    if (payload.optionLetter) {
        formData.append('optionLetter', payload.optionLetter);
    }

    const response = await fetch('http://192.168.0.233:3001/api/v1/questions/upload-image', {
        method: 'POST',
        body: formData,
    });

    const data: ApiResponse<{ imageUrl: string; fileName: string }> = await response.json();
    return assertSuccessfulResponse(data);
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

export const getGradesByGradeGroup = async (gradeGroupId: string) =>
    callApi<any>({
        url: `${ServerSideRoutes.GRADES_BY_GRADE_GROUP}/${gradeGroupId}`,
        method: HTTP_METHOD.GET,
    }).then((res) => {
        // Handle deeply nested NextJS/Backend wrapped response: { response: { data: [...] } }
        if (res?.response?.data && Array.isArray(res.response.data)) {
            return res.response.data;
        } else if (res?.data && Array.isArray(res.data)) {
            return res.data;
        } else if (res?.response && Array.isArray(res.response)) {
            return res.response;
        } else if (Array.isArray(res)) {
            return res;
        }

        // If it reaches here, the API returned something unexpected or failed
        return [];
    });

export const getGradeGroups = async () =>
    callApi<any>({
        url: ServerSideRoutes.GRADE_GROUP,
        method: HTTP_METHOD.GET,
    }).then((res) => {
        // Handle deeply nested NextJS/Backend wrapped response: { response: { data: [...] } }
        if (res?.response?.data && Array.isArray(res.response.data)) {
            return res.response.data;
        } else if (res?.data && Array.isArray(res.data)) {
            return res.data;
        } else if (res?.response && Array.isArray(res.response)) {
            return res.response;
        } else if (Array.isArray(res)) {
            return res;
        }

        return [];
    });

export const getSubjectsByGradeGroup = async (gradeGroupId: string) =>
    callApi<any>({
        url: `${ServerSideRoutes.SUBJECTS_BY_GRADE_GROUP}/${gradeGroupId}`,
        method: HTTP_METHOD.GET,
    }).then((res) => {
        if (res?.response?.data && Array.isArray(res.response.data)) {
            return res.response.data;
        } else if (res?.data && Array.isArray(res.data)) {
            return res.data;
        } else if (res?.response && Array.isArray(res.response)) {
            return res.response;
        } else if (Array.isArray(res)) {
            return res;
        }
        return [];
    });

export const getSubjectsByGrade = async (gradeId: string) =>
    callApi<any>({
        url: `${ServerSideRoutes.SUBJECTS_BY_GRADE}/${gradeId}`,
        method: HTTP_METHOD.GET,
    }).then((res) => {
        if (res?.response?.data && Array.isArray(res.response.data)) {
            return res.response.data;
        } else if (res?.data && Array.isArray(res.data)) {
            return res.data;
        } else if (res?.response && Array.isArray(res.response)) {
            return res.response;
        } else if (Array.isArray(res)) {
            return res;
        }
        return [];
    });

export const getCompetenciesList = async (payload: { gradeId: number; subjectId: number; term: string }) =>
    callApi<any>({
        url: ServerSideRoutes.COMPETENCIES_LIST,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then((res) => {
        if (res?.response?.data && Array.isArray(res.response.data)) {
            return res.response.data;
        } else if (res?.data && Array.isArray(res.data)) {
            return res.data;
        } else if (res?.response && Array.isArray(res.response)) {
            return res.response;
        } else if (Array.isArray(res)) {
            return res;
        }
        return [];
    });
