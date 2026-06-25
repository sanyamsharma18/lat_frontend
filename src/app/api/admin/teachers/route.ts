import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { createTeacher, getTeachers } from '@/services/teacher/teacher.service';
import { TeacherFormValues } from '@/types/teacher';

export async function GET(request: NextRequest) {
    const result = await getTeachers(request.nextUrl.searchParams);

    return serverApiResponse(result);
}

export async function POST(request: NextRequest) {
    const body = (await request.json()) as TeacherFormValues;
    const result = await createTeacher(body);

    return serverApiResponse(result);
}
