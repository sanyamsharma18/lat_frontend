import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { getSchoolsByRegion } from '@/services/teacher/teacher.service';

export async function GET(request: NextRequest) {
    const result = await getSchoolsByRegion(request.nextUrl.searchParams);

    return serverApiResponse(result);
}
