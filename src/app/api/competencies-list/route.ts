import { NextRequest } from 'next/server';
import { serverApiResponse } from '@/lib/serverApi';
import { getCompetenciesList } from '@/services/teacher/teacher.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const result = await getCompetenciesList(body);

    return serverApiResponse(result);
}
