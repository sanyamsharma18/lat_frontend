import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import {
    deleteQuestion,
    updateQuestion,
} from '@/services/questionGenerator/questionGenerator.service';
import { QuestionFormValues } from '@/types/questionGenerator';

interface QuestionRouteContext {
    params: Promise<{
        questionId: string;
    }>;
}

export async function PUT(request: NextRequest, context: QuestionRouteContext) {
    const { questionId } = await context.params;
    const body = (await request.json()) as QuestionFormValues;
    const result = await updateQuestion(questionId, body);

    return serverApiResponse(result);
}

export async function DELETE(_request: NextRequest, context: QuestionRouteContext) {
    const { questionId } = await context.params;
    const result = await deleteQuestion(questionId);

    return serverApiResponse(result);
}
