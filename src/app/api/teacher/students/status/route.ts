import { NextRequest } from 'next/server';
import { updateStudentStatus } from '@/services/student/student.service';
import { serverApiResponse } from '@/lib/serverApi';

export async function POST(request: NextRequest) {
    const { studentId, status } = await request.json();
    let numericStatus = status;
    if (status === 'Active') numericStatus = 1;
    if (status === 'Inactive') numericStatus = 0;
    if (status === '1' || status === '0') numericStatus = Number(status);

    const response = await updateStudentStatus(studentId, numericStatus);
    return serverApiResponse(response);
}
