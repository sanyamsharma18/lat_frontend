import { NextRequest } from 'next/server';
import { serverApiResponse } from '@/lib/serverApi';
import { getTeacherDashboard } from '@/services/student/student.service';

export async function GET(_request: NextRequest) {
    const result = await getTeacherDashboard();
    return serverApiResponse(result);
}
