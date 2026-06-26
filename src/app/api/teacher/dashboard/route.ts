import { serverApiResponse } from '@/lib/serverApi';
import { getTeacherDashboard } from '@/services/student/student.service';

export async function GET() {
    const result = await getTeacherDashboard();
    return serverApiResponse(result);
}
