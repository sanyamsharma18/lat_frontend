import { serverApiResponse } from '@/lib/serverApi';
import { getExamQuestions } from '@/services/studentPortal/studentPortal.service';

import { StudentExamQuestionsPayload } from '@/types/studentPortal';

export async function POST(request: Request) {
    const payload = (await request.json()) as StudentExamQuestionsPayload;
    const result = await getExamQuestions(payload);

    return serverApiResponse(result);
}
