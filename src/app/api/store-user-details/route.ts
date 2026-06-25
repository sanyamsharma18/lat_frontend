import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { USER_DETAIL } from '@/utils/cookieManager';

export async function POST(request: Request) {
    const { userDetail } = await request.json();

    (await cookies()).set({
        name: USER_DETAIL,
        value: JSON.stringify(userDetail),
        httpOnly: true,
        secure: false,
        sameSite: 'lax', // for local dev
        path: '/',
        maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ message: 'User Details stored successfully' });
}
