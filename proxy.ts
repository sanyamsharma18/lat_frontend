import { NextRequest } from 'next/server';

import { proxy as appProxy } from './src/proxy';

export function proxy(request: NextRequest) {
    return appProxy(request);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)',
    ],
};
