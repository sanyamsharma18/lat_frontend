import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { submitExam } from '@/services/studentPortal/studentPortal.service';
import { SubmitExamPayload } from '@/types/studentPortal';

export async function POST(request: NextRequest) {
    const body = (await request.json()) as SubmitExamPayload;
    const result = await submitExam(body);

    return serverApiResponse(result);
}
