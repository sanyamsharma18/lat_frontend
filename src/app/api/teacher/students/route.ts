import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { getStudents, createStudent } from '@/services/student/student.service';
import { CreateStudentPayload, StudentFormValues } from '@/types/student';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const response = await getStudents(searchParams);
    return serverApiResponse(response);
}

export async function POST(request: NextRequest) {
    const payload = (await request.json()) as StudentFormValues;
    const [firstName, ...rest] = payload.studentName.trim().split(/\s+/);

    const mappedPayload: CreateStudentPayload = {
        firstName: firstName || '',
        lastName: rest.join(' '),
        parentMobile: payload.parentMobile.trim(),
        email: payload.email.trim(),
        rollNo: payload.rollNo.trim(),
        gradeId: Number(String(payload.grade).replace(/\D/g, '')),
        section: payload.section.replace(/^Section\s+/i, '').trim().toLowerCase(),
        udisecode: payload.udisecode.trim(),
        fatherName: payload.fatherName.trim(),
        motherName: payload.motherName.trim(),
        gender: payload.gender,
        dob: payload.dateOfBirth,
        address: payload.address.trim(),
    };

    const response = await createStudent(mappedPayload);
    return serverApiResponse(response);
}
