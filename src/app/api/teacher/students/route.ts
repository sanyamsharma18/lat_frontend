import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { getStudents, createStudent } from '@/services/student/student.service';
import { StudentFormValues } from '@/types/student';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const response = await getStudents(searchParams);
    return serverApiResponse(response);
}

export async function POST(request: NextRequest) {
    const payload = (await request.json()) as StudentFormValues;
    
    const [firstName, ...rest] = payload.studentName.split(' ');
    const lastName = rest.join(' ');

    const mappedPayload = {
        firstName,
        lastName,
        gradeId: Number(String(payload.grade).replace('Grade ', '')),
        section: payload.section,
        fatherName: payload.fatherName,
        motherName: payload.motherName,
        gender: payload.gender,
        dob: payload.dateOfBirth,
        parentMobile: payload.parentMobile,
        email: payload.email,
        rollNo: payload.rollNo,
        udisecode: payload.udisecode,
        address: payload.address
    };

    // Note: status is set sequentially if needed, but usually default is Active on creation
    const response = await createStudent(mappedPayload as any);
    return serverApiResponse(response);
}
