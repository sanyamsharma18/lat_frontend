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

export const updateReviewerStatus = async (
    reviewerId: string,
    payload: ReviewerStatusPayload,
) =>
    serverApi({
        url: `${API_ROUTES.adminReviewers}/${reviewerId}/status`,
        method: 'PATCH',
        body: payload,
    });
