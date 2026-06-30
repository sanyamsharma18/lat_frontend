import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import Cookies from 'js-cookie';

import { StaleAndCacheTime } from '@/constants/appConstants';
import { API_ROUTES } from '@/config/apiRoutes';
import { JWT_TOKEN } from '@/constants/authSession';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import {
    BackendExamQuestion,
    ExamQuestionsResponse,
    SaveAnswerPayload,
    StudentExamQuestionsPayload,
    SubmitExamPayload,
} from '@/types/studentPortal';

import { getClientUserDetails } from '@/utils/cookieManager';
import { QueryKeys } from '@/utils/queryKeys';

export const examQuestionsQueryKey = () => [QueryKeys.EXAM_QUESTIONS] as const;

const DEFAULT_EXAM_ID = 1;
const DEFAULT_EXAM_TERM_ID = 1;
const DEFAULT_EXAM_DURATION_MINUTES = 60;
const DEFAULT_EXAM_TITLE = 'Annual Assessment';

interface ClientStudentDetail {
    id?: string | number;
}

const assertSuccessfulResponse = <TResponse>(response: ApiResponse<TResponse>) => {
    if (response.status === false || !response.response) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response.response;
};

const getLoggedInStudentId = () => {
    const userDetail = getClientUserDetails() as ClientStudentDetail | null;
    const studentId = Number(userDetail?.id);

    if (!Number.isFinite(studentId) || studentId <= 0) {
        throw new Error('Student details are unavailable. Please login again.');
    }

    return studentId;
};

const getBackendImageUrl = (imageUrl?: string | null) => {
    const normalizedImageUrl = String(imageUrl ?? '').trim();

    return normalizedImageUrl || null;
};

const buildExamQuestionsPayload = (): StudentExamQuestionsPayload => ({
    studentId: getLoggedInStudentId(),
    termId: DEFAULT_EXAM_TERM_ID,
});

const mapBackendQuestionsToExam = (
    backendQuestions: BackendExamQuestion[],
): ExamQuestionsResponse => {
    const questions = backendQuestions.map((question, questionIndex) => {
        const optionLabels: Record<string, string> = {};
        const optionLetters: Record<string, string> = {};
        const optionImageUrls: Record<string, string | null> = {};
        const optionIds = question.options.map((option) => {
            optionLabels[option.id] = option.option_text;
            optionLetters[option.id] = option.option_letter;
            optionImageUrls[option.id] = getBackendImageUrl(option.image_url || option.imageUrl);

            return option.id;
        });

        return {
            id: Number(question.id) || questionIndex + 1,
            question: question.question_text,
            instruction: question.instruction,
            stimulus: question.stimulus,
            imageUrl: getBackendImageUrl(question.image_url || question.imageUrl),
            type: 'single-choice' as const,
            options: optionIds,
            optionLabels,
            optionLetters,
            optionImageUrls,
            correctAnswer: '',
        };
    });

    return {
        examId: DEFAULT_EXAM_ID,
        title: DEFAULT_EXAM_TITLE,
        duration: DEFAULT_EXAM_DURATION_MINUTES,
        totalQuestions: questions.length,
        questions,
    };
};

export const getExamQuestions = async () => {
    const response = await callApi<ApiResponse<BackendExamQuestion[]>>({
        url: ServerSideRoutes.STUDENT_EXAM_QUESTIONS,
        method: HTTP_METHOD.POST,
        body: buildExamQuestionsPayload(),
    });

    return mapBackendQuestionsToExam(assertSuccessfulResponse(response));
};

export const saveExamAnswer = async (payload: SaveAnswerPayload) =>
    callApi<ApiResponse<SaveAnswerPayload>>({
        url: ServerSideRoutes.STUDENT_EXAM_SAVE_ANSWER,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then(assertSuccessfulResponse);

export const submitExam = async (payload: SubmitExamPayload) => {
    const token = Cookies.get(JWT_TOKEN);

    if (!token) {
        throw new Error('Unable to verify student session. Please login again.');
    }

    return callApi<ApiResponse<unknown>>({
        url: API_ROUTES.studentExamSubmit,
        method: HTTP_METHOD.POST,
        headers: {
            accept: '*/*',
            Authorization: `Bearer ${token}`,
        },
        body: payload,
    }).then((response) => {
        if (response.status === false) {
            throw new Error(response.message || response.error || 'Unable to submit examination');
        }

        return response;
    });
};

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
