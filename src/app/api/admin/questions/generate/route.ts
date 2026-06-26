import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { generateQuestions } from '@/services/questionGenerator/questionGenerator.service';
import { GenerateQuestionsPayload } from '@/types/questionGenerator';

export async function POST(request: NextRequest) {
    const body = (await request.json()) as GenerateQuestionsPayload;
    const result = await generateQuestions(body);

    return serverApiResponse(result);
}
