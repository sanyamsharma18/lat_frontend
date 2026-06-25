export interface ApiDataEnvelope<TData> {
    success?: boolean;
    data?: TData;
}

export interface ApiResponse<TResponse = unknown, TData = unknown> {
    methodType?: string;
    status?: boolean;
    statusCode?: number;
    message?: string;
    error?: string;
    response?: TResponse;
    data?: TData;
    responseDate?: string;
    exception?: unknown;
}

export interface ApiDataEnvelopeResponse<TData>
    extends ApiResponse<ApiDataEnvelope<TData>, TData> {}
