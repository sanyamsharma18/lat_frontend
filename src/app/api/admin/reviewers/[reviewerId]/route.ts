import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { updateReviewer } from '@/services/reviewer/reviewer.service';

import { ReviewerFormValues } from '@/types/reviewer';

interface RouteParams {
    params: Promise<{
        reviewerId: string;
    }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { reviewerId } = await params;
    const payload = (await request.json()) as ReviewerFormValues;
    const result = await updateReviewer(reviewerId, payload);

    return serverApiResponse(result);
}
