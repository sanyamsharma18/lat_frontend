import { serverApiResponse } from '@/lib/serverApi';
import { getGradeGroups } from '@/services/teacher/teacher.service';

export async function GET() {
    const result = await getGradeGroups();

    return serverApiResponse(result);
}
