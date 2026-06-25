import { HTTP_METHOD } from '@/types/common';

export const storeDataInServerSideCookies = async (route: string, payload: object) =>
    fetch(route, {
        method: HTTP_METHOD.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
    });
