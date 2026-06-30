import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { updateReviewerStatus } from '@/services/reviewer/reviewer.service';

import { ReviewerStatusPayload } from '@/types/reviewer';

interface RouteParams {
    params: Promise<{
        reviewerId: string;
    }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { reviewerId } = await params;
    const payload = (await request.json()) as ReviewerStatusPayload;
    const result = await updateReviewerStatus(reviewerId, payload);

    return serverApiResponse(result);
}
