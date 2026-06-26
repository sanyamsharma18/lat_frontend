import { NextRequest } from 'next/server';
import { updateStudentStatus } from '@/services/student/student.service';
import { serverApiResponse } from '@/lib/serverApi';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { studentId: string } }
) {
    const payload = await request.json();
    let numericStatus = payload.status;
    if (payload.status === 'Active') numericStatus = 1;
    if (payload.status === 'Inactive') numericStatus = 0;
    if (payload.status === '1' || payload.status === '0') numericStatus = Number(payload.status);

    const response = await updateStudentStatus(params.studentId, numericStatus);
    return serverApiResponse(response);
}
