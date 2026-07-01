import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { API_ROUTES } from '@/config/apiRoutes';
import { JWT_TOKEN } from '@/utils/cookieManager';

const DEFAULT_FILE_NAME = 'LAT_Admin_Report.pdf';

export async function GET() {
    const token = (await cookies()).get(JWT_TOKEN)?.value;

    const response = await fetch(API_ROUTES.downloadPdf, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            accept: 'application/pdf',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const responseBody = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/pdf';
    const contentDisposition =
        response.headers.get('content-disposition') ||
        `attachment; filename="${DEFAULT_FILE_NAME}"`;

    return new NextResponse(responseBody, {
        status: response.status,
        headers: {
            'content-type': contentType,
            'content-disposition': contentDisposition,
        },
    });
}
