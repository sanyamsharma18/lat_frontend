import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi, { QueryParamType } from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import {
    Reviewer,
    ReviewerFormValues,
    ReviewerListFilters,
    ReviewerListResponse,
    ReviewerStatusPayload,
} from '@/types/reviewer';

import { QueryKeys } from '@/utils/queryKeys';

export const reviewerQueryKey = (filters?: ReviewerListFilters) =>
    filters ? ([QueryKeys.REVIEWERS, filters] as const) : ([QueryKeys.REVIEWERS] as const);

const assertSuccessfulResponse = <T>(response: T) => {
    if ((response as any)?.status === false || (response as any)?.success === false) {
        throw new Error(
            (response as any).message || (response as any)?.error || 'Reviewer request failed',
        );
    }

    return response;
};

const extractDataArray = (response: any): any[] => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.response)) return response.response;
    if (Array.isArray(response?.response?.data)) return response.response.data;
    if (Array.isArray(response?.response?.items)) return response.response.items;
    if (Array.isArray(response?.response?.reviewers)) return response.response.reviewers;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.reviewers)) return response.reviewers;

    return [];
};

const extractPaginationTotal = (response: any, fallback: number) => {
    if (response?.response?.total !== undefined) return Number(response.response.total);
    if (response?.response?.count !== undefined) return Number(response.response.count);
    if (response?.total !== undefined) return Number(response.total);
    if (response?.count !== undefined) return Number(response.count);

    return fallback;
};

const normalizeReviewer = (item: any): Reviewer => ({
    id: String(item.id || item.userId || item.reviewerId || ''),
    firstName: item.firstName || '',
    lastName: item.lastName || '',
    mobileNo: item.mobileNo || item.mobile || item.phone || '',
    email: item.email || '',
    status: Number(item.status ?? item.isActive ?? 0),
    createdAt: item.createdAt || item.createdDate || '',
});

export const getReviewerList = async (
    filters: ReviewerListFilters,
): Promise<ReviewerListResponse> => {
    const queryParams: QueryParamType = {
        page: String(filters.page),
        limit: String(filters.limit),
    };

    if (filters.search) {
        queryParams.search = filters.search;
    }

    const response = await callApi<ApiResponse<any>>({
        url: ServerSideRoutes.ADMIN_REVIEWERS,
        method: HTTP_METHOD.GET,
        queryParams,
    });

    assertSuccessfulResponse(response);

    const data = extractDataArray(response);
    const reviewers = data.map(normalizeReviewer);

    return {
        reviewers,
        total: extractPaginationTotal(response, reviewers.length),
        page: filters.page,
        limit: filters.limit,
    };
};

export const createReviewer = async (payload: ReviewerFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.ADMIN_REVIEWERS,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then(assertSuccessfulResponse);

export const updateReviewer = async (reviewerId: string, payload: ReviewerFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.ADMIN_REVIEWERS}/${reviewerId}`,
        method: HTTP_METHOD.PATCH,
        body: payload,
    }).then(assertSuccessfulResponse);

export const updateReviewerStatus = async (
    reviewerId: string,
    payload: ReviewerStatusPayload,
) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.ADMIN_REVIEWERS}/${reviewerId}/status`,
        method: HTTP_METHOD.PATCH,
        body: payload,
    }).then(assertSuccessfulResponse);

export const reviewerListQueryOptions = (filters: ReviewerListFilters) => ({
    queryKey: reviewerQueryKey(filters),
    queryFn: () => getReviewerList(filters),
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
