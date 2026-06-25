import { serverApiResponse } from '@/lib/serverApi';
import { getSubjects } from '@/services/teacher/teacher.service';

export async function GET() {
    const result = await getSubjects();

    return serverApiResponse(result);
}
