import { NextRequest } from 'next/server';

import { serverApi, serverApiResponse } from '@/lib/serverApi';
import { API_ROUTES } from '@/config/apiRoutes';
import { ReviewQuestionPayload } from '@/types/reviewerQuestion';

interface RouteParams {
    params: Promise<{
        questionId: string;
    }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { questionId } = await params;
    const payload = (await request.json()) as ReviewQuestionPayload;

    const body = {
        questionId: Number(questionId),
        status: payload.status === 'Approved' ? 1 : 0,
        remark: payload.remark || undefined,
    };

    const result = await serverApi({
        url: API_ROUTES.reviewQuestion(questionId),
        method: 'PATCH',
        body,
    });

    return serverApiResponse(result);
}
