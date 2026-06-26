import { NextRequest } from 'next/server';
import { updateStudentStatus } from '@/services/student/student.service';
import { serverApiResponse } from '@/lib/serverApi';

interface StudentStatusRouteContext {
    params: Promise<{
        studentId: string;
    }>;
}

export async function PATCH(request: NextRequest, context: StudentStatusRouteContext) {
    const { studentId } = await context.params;
    const payload = await request.json();
    let numericStatus = payload.status;
    if (payload.status === 'Active') numericStatus = 1;
    if (payload.status === 'Inactive') numericStatus = 0;
    if (payload.status === '1' || payload.status === '0') numericStatus = Number(payload.status);

    const response = await updateStudentStatus(studentId, numericStatus);
    return serverApiResponse(response);
}
