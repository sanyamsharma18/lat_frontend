import { API_ROUTES } from '@/config/apiRoutes';
import { serverApi } from '@/lib/serverApi';

import { ReviewerFormValues, ReviewerStatusPayload } from '@/types/reviewer';

export const getReviewers = async (searchParams: URLSearchParams) =>
    serverApi({
        url: API_ROUTES.adminReviewers,
        searchParams,
    });

export const createReviewer = async (payload: ReviewerFormValues) =>
    serverApi({
        url: API_ROUTES.adminReviewers,
        method: 'POST',
        body: payload,
    });

export const updateReviewer = async (reviewerId: string, payload: ReviewerFormValues) =>
    serverApi({
        url: `${API_ROUTES.adminReviewers}/${reviewerId}`,
        method: 'PATCH',
        body: payload,
    });

export const getReviewerDashboard = async () =>
    serverApi({
        url: API_ROUTES.reviewerDashboard,
    });

export const updateReviewerStatus = async (
    reviewerId: string,
    payload: ReviewerStatusPayload,
) =>
    serverApi({
        url: `${API_ROUTES.adminReviewers}/${reviewerId}/status`,
        method: 'PATCH',
        body: payload,
    });

export interface ReviewerQuestionListFilters {
    search?: string;
    gradeGroup?: string;
    grade?: string;
    subject?: string;
    term?: string;
    competency?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export const getReviewerQuestions = async (filters: ReviewerQuestionListFilters) => {
    const searchParams = new URLSearchParams();
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.gradeGroup) searchParams.set('gradeGroup', filters.gradeGroup);
    if (filters.grade) searchParams.set('grade', filters.grade);
    if (filters.subject) searchParams.set('subject', filters.subject);
    if (filters.term) searchParams.set('termId', filters.term);
    if (filters.competency) searchParams.set('competency', filters.competency);
    if (filters.status) searchParams.set('status', filters.status);
    if (filters.page) searchParams.set('page', String(filters.page));
    if (filters.limit) searchParams.set('limit', String(filters.limit));

    return serverApi({
        url: API_ROUTES.adminQuestions,
        searchParams,
    });
};
