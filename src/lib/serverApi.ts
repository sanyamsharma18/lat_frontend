import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { METHOD } from '@/lib/clientApi';
import { JWT_TOKEN } from '@/utils/cookieManager';

type ServerApiAuth = 'cookie' | 'none';


interface ServerApiArgs {
    url: string;
    method?: METHOD;
    body?: BodyInit | Record<string, unknown> | null;
    headers?: HeadersInit;
    searchParams?: URLSearchParams;
    auth?: ServerApiAuth;
    bearerToken?: string;
}

interface ServerApiResult<TData = unknown> {
    data: TData;
    status: number;
    ok: boolean;
}

const missingBackendConfig = {
    status: false,
    message: 'NEXT_PUBLIC_APP_URL is not configured',
};

const buildBackendUrl = (url: string, searchParams?: URLSearchParams) => {
    const backendUrl = new URL(url);

    searchParams?.forEach((value, key) => {
        backendUrl.searchParams.set(key, value);
    });

    return backendUrl;
};

const readResponseData = async (response: Response) => {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
};

export const serverApi = async <TData = unknown>({
    url,
    method = 'GET',
    body,
    headers,
    searchParams,
    auth = 'cookie',
    bearerToken,
}: ServerApiArgs): Promise<ServerApiResult<TData>> => {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
        return {
            data: missingBackendConfig as TData,
            status: 500,
            ok: false,
        };
    }

    const cookieToken = auth === 'cookie' ? (await cookies()).get(JWT_TOKEN)?.value : null;
    const token = bearerToken || cookieToken;
    const isFormDataBody = body instanceof FormData;
    const requestBody = isFormDataBody ? body : body ? JSON.stringify(body) : undefined;

    const response = await fetch(buildBackendUrl(url, searchParams), {
        method,
        cache: 'no-store',
        headers: {
            accept: '*/*',
            ...(body && !isFormDataBody ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...(requestBody ? { body: requestBody } : {}),
    });

    return {
        data: (await readResponseData(response)) as TData,
        status: response.status,
        ok: response.ok,
    };
};

export const serverApiResponse = <TData>(result: ServerApiResult<TData>) =>
    NextResponse.json(result.data, { status: result.status });

export const setAuthTokenCookie = async (token: string) => {
    (await cookies()).set({
        name: JWT_TOKEN,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });
};
