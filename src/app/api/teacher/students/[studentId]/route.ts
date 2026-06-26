import { NextRequest } from 'next/server';
import { updateStudent, deleteStudent } from '@/services/student/student.service';
import { serverApiResponse } from '@/lib/serverApi';
import { StudentFormValues } from '@/types/student';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { studentId: string } }
) {
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

    const [response] = await Promise.all([
        updateStudent(params.studentId, mappedPayload as any),
        updateStudentStatus(params.studentId, payload.status === 'Active' || payload.status === '1' ? 1 : 0)
    ]);
    return serverApiResponse(response);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { studentId: string } }
) {
    const response = await deleteStudent(params.studentId);
    return serverApiResponse(response);
}
