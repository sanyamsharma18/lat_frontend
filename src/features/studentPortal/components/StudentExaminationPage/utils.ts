import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import {
    ExamQuestionsResponse,
    SaveAnswerPayload,
    SubmitExamPayload,
} from '@/types/studentPortal';

import { QueryKeys } from '@/utils/queryKeys';

export const examQuestionsQueryKey = () => [QueryKeys.EXAM_QUESTIONS] as const;

const assertSuccessfulResponse = <TResponse>(response: ApiResponse<TResponse>) => {
    if (response.status === false || !response.response) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response.response;
};

export const getExamQuestions = async () => {
    const response = await callApi<ApiResponse<ExamQuestionsResponse>>({
        url: ServerSideRoutes.STUDENT_EXAM_QUESTIONS,
        method: HTTP_METHOD.GET,
    });

    return assertSuccessfulResponse(response);
};

export const saveExamAnswer = async (payload: SaveAnswerPayload) =>
    callApi<ApiResponse<SaveAnswerPayload>>({
        url: ServerSideRoutes.STUDENT_EXAM_SAVE_ANSWER,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then(assertSuccessfulResponse);

export const submitExam = async (payload: SubmitExamPayload) =>
    callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.STUDENT_EXAM_SUBMIT,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then((response) => {
        if (response.status === false) {
            throw new Error(response.message || response.error || 'Unable to submit examination');
        }

        return response;
    });

export const examQuestionsQueryOptions = () => ({
    queryKey: examQuestionsQueryKey(),
    queryFn: getExamQuestions,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const formatTime = (totalSeconds: number | null) => {
    const safeTotalSeconds = Math.max(totalSeconds ?? 0, 0);
    const hours = Math.floor(safeTotalSeconds / 3600);
    const minutes = Math.floor((safeTotalSeconds % 3600) / 60);
    const seconds = safeTotalSeconds % 60;

    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
};
