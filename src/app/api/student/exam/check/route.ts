import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { serverApiResponse } from '@/lib/serverApi';
import { checkStudentExamStatus } from '@/services/studentPortal/studentPortal.service';
import { StudentExamCheckPayload } from '@/types/studentPortal';
import { JWT_TOKEN, USER_DETAIL } from '@/utils/cookieManager';

interface ServerUserDetail {
    id?: string | number;
}

const readRequestBody = async (request: NextRequest) => {
    try {
        return (await request.json()) as Partial<StudentExamCheckPayload>;
    } catch {
        return {};
    }
};

const getStudentIdFromCookie = async () => {
    const userDetailCookie = (await cookies()).get(USER_DETAIL)?.value;

    if (!userDetailCookie) {
        return null;
    }

    try {
        const userDetail = JSON.parse(decodeURIComponent(userDetailCookie)) as ServerUserDetail;
        const studentId = Number(userDetail.id);

        return Number.isFinite(studentId) && studentId > 0 ? studentId : null;
    } catch {
        return null;
    }
};

export async function POST(request: NextRequest) {
    const body = await readRequestBody(request);
    const authToken = (await cookies()).get(JWT_TOKEN)?.value;
    const studentId = await getStudentIdFromCookie();

    if (!authToken) {
        return NextResponse.json(
            {
                status: false,
                message: 'Unable to verify student session',
            },
            { status: 401 },
        );
    }

    if (!studentId) {
        return NextResponse.json(
            {
                status: false,
                message: 'Unable to identify logged-in student',
            },
            { status: 401 },
        );
    }

    const payload: StudentExamCheckPayload = {
        studentId,
        termId: body.termId ?? 1,
        subjectId: body.subjectId ?? 1,
    };

    try {
        const result = await checkStudentExamStatus(payload, authToken);

        return serverApiResponse(result);
    } catch {
        return NextResponse.json(
            {
                status: false,
                message: 'Unable to verify student exam status',
            },
            { status: 503 },
        );
    }
}
