import { NextRequest } from 'next/server';

import { serverApi, serverApiResponse } from '@/lib/serverApi';

export const proxyGet = async (url: string, searchParams?: URLSearchParams) => {
    const result = await serverApi({
        url,
        searchParams,
    });

    return serverApiResponse(result);
};

export const proxyJsonPost = async (request: NextRequest, url: string) => {
    const body = (await request.json()) as Record<string, unknown>;
    const result = await serverApi({
        url,
        method: 'POST',
        body,
    });

    return serverApiResponse(result);
};

export const proxyFormPost = async (request: NextRequest, url: string) => {
    const body = await request.formData();
    const result = await serverApi({
        url,
        method: 'POST',
        body,
    });

    return serverApiResponse(result);
};
