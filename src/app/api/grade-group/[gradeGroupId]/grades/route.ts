import { NextRequest } from 'next/server';
import { serverApiResponse } from '@/lib/serverApi';
import { getGradesByGradeGroup } from '@/services/teacher/teacher.service';

export async function GET(
    request: NextRequest,
    { params }: { params: { gradeGroupId: string } }
) {
    const result = await getGradesByGradeGroup(params.gradeGroupId);

    return serverApiResponse(result);
}
