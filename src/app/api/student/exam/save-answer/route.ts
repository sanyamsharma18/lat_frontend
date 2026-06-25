import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { saveExamAnswer } from '@/services/studentPortal/studentPortal.service';
import { SaveAnswerPayload } from '@/types/studentPortal';

export async function POST(request: NextRequest) {
    const body = (await request.json()) as SaveAnswerPayload;
    const result = await saveExamAnswer(body);

    return serverApiResponse(result);
}
