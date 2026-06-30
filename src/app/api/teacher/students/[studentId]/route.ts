import { NextRequest } from 'next/server';
import { updateStudent, deleteStudent, updateStudentStatus } from '@/services/student/student.service';
import { serverApiResponse } from '@/lib/serverApi';
import { StudentFormValues } from '@/types/student';

interface StudentRouteContext {
    params: Promise<{
        studentId: string;
    }>;
}

export async function PATCH(request: NextRequest, context: StudentRouteContext) {
    const { studentId } = await context.params;
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
        dob: payload.dateOfBirth?.split('-').reverse().join('-'),
        parentMobile: payload.parentMobile,
        rollNo: payload.rollNo,
        udisecode: payload.udisecode,
        address: payload.address,
    };

    const statusValue = String(payload.status);

    const [response] = await Promise.all([
        updateStudent(studentId, mappedPayload as any),
        updateStudentStatus(studentId, statusValue === 'Active' || statusValue === '1' ? 1 : 0),
    ]);
    return serverApiResponse(response);
}

export async function DELETE(_request: NextRequest, context: StudentRouteContext) {
    const { studentId } = await context.params;
    const response = await deleteStudent(studentId);

    return serverApiResponse(response);
}
