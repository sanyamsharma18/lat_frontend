import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { CLIENT_USER_DETAIL, JWT_TOKEN, USER_DETAIL, USER_MENU_LIST } from '@/utils/cookieManager';

const AUTH_COOKIE_NAMES = [JWT_TOKEN, USER_MENU_LIST, USER_DETAIL, CLIENT_USER_DETAIL];

export async function POST() {
    const cookieStore = await cookies();
    const cookieNames = new Set([
        ...AUTH_COOKIE_NAMES,
        ...cookieStore.getAll().map((cookie) => cookie.name),
    ]);

    cookieNames.forEach((cookieName) => {
        cookieStore.set(cookieName, '', { maxAge: 0, path: '/' });
    });

    return NextResponse.json({ message: 'Logged out successfully', status: true });
}
