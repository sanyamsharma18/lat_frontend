import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { createReviewer, getReviewers } from '@/services/reviewer/reviewer.service';

import { ReviewerFormValues } from '@/types/reviewer';

export async function GET(request: NextRequest) {
    const result = await getReviewers(request.nextUrl.searchParams);

    return serverApiResponse(result);
}

export async function POST(request: NextRequest) {
    const payload = (await request.json()) as ReviewerFormValues;
    const result = await createReviewer(payload);

    return serverApiResponse(result);
}
