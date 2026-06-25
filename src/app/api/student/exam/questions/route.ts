import { serverApiResponse } from '@/lib/serverApi';
import { getExamQuestions } from '@/services/studentPortal/studentPortal.service';

export async function GET() {
    const result = await getExamQuestions();

    return serverApiResponse(result);
}
