import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { getReviewerQuestions, ReviewerQuestionListFilters } from '@/services/reviewer/reviewer.service';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const filters: ReviewerQuestionListFilters = {
        search: searchParams.get('search') || undefined,
        gradeGroup: searchParams.get('gradeGroup') || undefined,
        grade: searchParams.get('grade') || undefined,
        subject: searchParams.get('subject') || undefined,
        term: searchParams.get('term') || undefined,
        competency: searchParams.get('competency') || undefined,
        status: searchParams.get('status') || undefined,
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 10,
    };

    const result = await getReviewerQuestions(filters);
    return serverApiResponse(result);
}
