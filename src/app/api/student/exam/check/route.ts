import { NextRequest, NextResponse } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { checkStudentExamStatus } from '@/services/studentPortal/studentPortal.service';
import { StudentExamCheckPayload } from '@/types/studentPortal';

const DEFAULT_EXAM_CONTEXT = {
    termId: 1,
    subjectId: 1,
};

const readRequestBody = async (request: NextRequest) => {
    try {
        return (await request.json()) as Partial<StudentExamCheckPayload>;
    } catch {
        return {};
    }
};

const isValidPositiveNumber = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value) && value > 0;

export async function POST(request: NextRequest) {
    const body = await readRequestBody(request);

    if (!isValidPositiveNumber(body.studentId)) {
        return NextResponse.json(
            {
                status: false,
                message: 'Unable to identify logged-in student',
            },
            { status: 400 },
        );
    }

    const payload: StudentExamCheckPayload = {
        studentId: body.studentId,
        termId: body.termId ?? DEFAULT_EXAM_CONTEXT.termId,
        subjectId: body.subjectId ?? DEFAULT_EXAM_CONTEXT.subjectId,
    };

    const response = await checkStudentExamStatus(payload);

    return serverApiResponse(response);
}
