import { serverApiResponse } from '@/lib/serverApi';
import { getExamInstructions } from '@/services/studentPortal/studentPortal.service';

export async function GET() {
    const result = await getExamInstructions();

    return serverApiResponse(result);
}
