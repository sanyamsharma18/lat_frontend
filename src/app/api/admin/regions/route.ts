import { serverApiResponse } from '@/lib/serverApi';
import { getRegions } from '@/services/teacher/teacher.service';

export async function GET() {
    const result = await getRegions();

    return serverApiResponse(result);
}
