import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { createQuestion, getQuestions } from '@/services/questionGenerator/questionGenerator.service';
import { QuestionFormValues, QuestionListFilters } from '@/types/questionGenerator';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const filters: QuestionListFilters = {
        search: searchParams.get('search') ?? '',
        grade: searchParams.get('grade') ?? '',
        subject: searchParams.get('subject') ?? '',
        competency: searchParams.get('competency') ?? '',
        status: searchParams.get('status') ?? '',
        page: Number(searchParams.get('page') ?? 1),
        limit: Number(searchParams.get('limit') ?? 10),
    };
    const result = await getQuestions(filters);

    return serverApiResponse(result);
}

export async function POST(request: NextRequest) {
    const body = (await request.json()) as QuestionFormValues;
    const result = await createQuestion(body);

    return serverApiResponse(result);
}
