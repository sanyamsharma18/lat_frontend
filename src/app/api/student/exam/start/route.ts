import { NextRequest, NextResponse } from 'next/server';

import { startStudentExam } from '@/services/studentPortal/studentPortal.service';

import { STUDENT_EXAM_ID } from '@/constants/authSession';

import {
    StudentExamStartPayload,
    StudentExamStartResponse,
} from '@/types/studentPortal';

interface StudentExamStartApiResponse {
    status?: boolean;
    response?: StudentExamStartResponse;
}

export async function POST(request: NextRequest) {
    const body = (await request.json()) as StudentExamStartPayload;
    const result = await startStudentExam(body);
    const data = result.data as StudentExamStartApiResponse;
    const studentExamId = data?.response?.studentExamId;
    const response = NextResponse.json(result.data, { status: result.status });

    if (result.ok && data?.status !== false && studentExamId) {
        response.cookies.set({
            name: STUDENT_EXAM_ID,
            value: String(studentExamId),
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 4,
        });
    }

    return response;
}
