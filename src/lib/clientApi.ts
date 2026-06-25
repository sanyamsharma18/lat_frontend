import { Dayjs } from 'dayjs';

import { ApiResponse } from '@/types/api';

export type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface QueryParamType {
    [key: string]: string | null;
}

interface ApiBodyRecord {
    [key: string]: string | number | boolean;
}

interface ApiBodyObject {
    [key: string]:
        | null
        | string
        | number
        | boolean
        | number[]
        | string[]
        | undefined
        | FileList
        | FileList[]
        | Dayjs
        | ApiBodyRecord[]
        | ApiBodyRecord;
}

type ApiBody = ApiBodyObject | FormData;


interface ClientApiArgs {
    url: string;
    method: METHOD;
    headers?: HeadersInit;
    body?: ApiBody;
    queryParams?: QueryParamType;
    downloadFile?: boolean;
}

const DEFAULT_HEADERS: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
};

const buildUrl = (url: string, queryParams?: QueryParamType) => {
    const searchParams = queryParams
        ? Object.entries(queryParams)
              .filter(([, value]) => value !== null)
              .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
              .join('&')
        : '';

    return searchParams ? `${url}?${searchParams}` : url;
};

const callApi = async <TResponse = ApiResponse>({
    url,
    method,
    headers,
    body,
    queryParams,
    downloadFile,
}: ClientApiArgs): Promise<TResponse> => {
    const requestHeaders = new Headers(DEFAULT_HEADERS);

    if (headers) {
        new Headers(headers).forEach((value, key) => requestHeaders.set(key, value));
    }

    const options: RequestInit = {
        method,
        headers: requestHeaders,
    };

    if (body) {
        if (body instanceof FormData) {
            options.body = body;
            requestHeaders.delete('Content-Type');
        } else {
            options.body = JSON.stringify(body);
        }
    }

    const response = await fetch(buildUrl(url, queryParams), options);

    return (downloadFile ? response.blob() : response.json()) as Promise<TResponse>;
};

export default callApi;
