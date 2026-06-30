import { NextRequest, NextResponse } from 'next/server';

import { ReviewQuestionPayload } from '@/types/reviewerQuestion';

interface RouteParams {
    params: Promise<{
        questionId: string;
    }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { questionId } = await params;
    const payload = (await request.json()) as ReviewQuestionPayload;

    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: `Question ${payload.status.toLowerCase()} successfully`,
        response: {
            questionId,
            ...payload,
        },
    });
}
