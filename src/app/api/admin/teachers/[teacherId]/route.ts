import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { deleteTeacher, updateTeacher } from '@/services/teacher/teacher.service';
import { TeacherFormValues } from '@/types/teacher';

interface TeacherRouteContext {
    params: Promise<{
        teacherId: string;
    }>;
}

export async function PUT(request: NextRequest, context: TeacherRouteContext) {
    const { teacherId } = await context.params;
    const body = (await request.json()) as TeacherFormValues;
    const result = await updateTeacher(teacherId, body);

    return serverApiResponse(result);
}

export async function DELETE(_request: NextRequest, context: TeacherRouteContext) {
    const { teacherId } = await context.params;
    const result = await deleteTeacher(teacherId);

    return serverApiResponse(result);
}
