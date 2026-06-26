import { NextRequest } from 'next/server';
import { serverApiResponse } from '@/lib/serverApi';
import { getGradesByGradeGroup } from '@/services/teacher/teacher.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getGradesByGradeGroup(id);

    return serverApiResponse(result);
}
