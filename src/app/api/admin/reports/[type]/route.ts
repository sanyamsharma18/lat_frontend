import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { getReportData } from '@/services/report/report.service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
    const { type } = await params;
    const result = await getReportData(type, request.nextUrl.searchParams);

    return serverApiResponse(result);
}
