import { NextRequest } from 'next/server';
import { serverApiResponse } from '@/lib/serverApi';
import { getGradesByGradeGroup } from '@/services/teacher/teacher.service';

interface GradeGroupRouteContext {
    params: Promise<{
        gradeGroupId: string;
    }>;
}

export async function GET(_request: NextRequest, context: GradeGroupRouteContext) {
    const { gradeGroupId } = await context.params;
    const result = await getGradesByGradeGroup(gradeGroupId);

    return serverApiResponse(result);
}
