export interface Reviewer {
    id: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
    email: string;
    status: number;
    createdAt: string;
}

export interface ReviewerFormValues {
    firstName: string;
    lastName: string;
    mobileNo: string;
    email: string;
}

export interface ReviewerStatusPayload {
    status: number;
}

export interface ReviewerListFilters {
    search: string;
    page: number;
    limit: number;
}

export interface ReviewerListResponse {
    reviewers: Reviewer[];
    total: number;
    page: number;
    limit: number;
}
