import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { JWT_TOKEN } from '@/utils/cookieManager';

/**
 *
 * @param request
 * @returns
 */

export async function POST(request: Request) {
    const { token } = await request.json();

    (await cookies()).set({
        name: JWT_TOKEN,
        value: token,
        httpOnly: false,
        secure: false,
        sameSite: 'lax', // for local dev
        path: '/',
        maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ message: 'token stored successfully' });
}
