import { NextRequest } from 'next/server';
import { serverApiResponse } from '@/lib/serverApi';
import { getGradeGroups } from '@/services/teacher/teacher.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const result = await getGradeGroups();

    return serverApiResponse(result);
}
