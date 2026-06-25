import { serverApiResponse } from '@/lib/serverApi';
import { getGrades } from '@/services/teacher/teacher.service';

export async function GET() {
    const result = await getGrades();

    return serverApiResponse(result);
}
