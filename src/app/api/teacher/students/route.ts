import { NextRequest, NextResponse } from 'next/server';

import { Student, StudentFormValues } from '@/types/student';

let mockStudents: Student[] = [
    {
        id: '1',
        studentId: 'STU-001',
        studentName: 'John Doe',
        grade: 'Grade 5',
        section: 'A',
        fatherName: 'Robert Doe',
        motherName: 'Jane Doe',
        gender: 'Male',
        dateOfBirth: '2015-05-12',
        status: 'Active',
        createdDate: '2026-01-15',
    },
    {
        id: '2',
        studentId: 'STU-002',
        studentName: 'Anita Sharma',
        grade: 'Grade 6',
        section: 'B',
        fatherName: 'Raj Sharma',
        motherName: 'Meera Sharma',
        gender: 'Female',
        dateOfBirth: '2014-09-21',
        status: 'Inactive',
        createdDate: '2026-02-03',
    },
];

const getNextStudentId = () =>
    String(
        mockStudents.reduce((highestId, student) => Math.max(highestId, Number(student.id)), 0) + 1,
    );

const buildStudent = (payload: StudentFormValues): Student => {
    const id = getNextStudentId();

    return {
        id,
        studentId: `STU-${id.padStart(3, '0')}`,
        studentName: payload.studentName,
        grade: payload.grade,
        section: payload.section,
        fatherName: payload.fatherName,
        motherName: payload.motherName,
        gender: payload.gender || 'Other',
        dateOfBirth: payload.dateOfBirth,
        status: payload.status,
        createdDate: new Date().toISOString().slice(0, 10),
    };
};

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const name = (searchParams.get('name') ?? '').toLowerCase();
    const grade = searchParams.get('grade') ?? '';
    const section = searchParams.get('section') ?? '';
    const status = searchParams.get('status') ?? '';
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '10');

    const filteredStudents = mockStudents.filter((student) => {
        const matchesName = name ? student.studentName.toLowerCase().includes(name) : true;
        const matchesGrade = grade ? student.grade === grade : true;
        const matchesSection = section ? student.section === section : true;
        const matchesStatus = status ? student.status === status : true;

        return matchesName && matchesGrade && matchesSection && matchesStatus;
    });
    const startIndex = (page - 1) * limit;

    return NextResponse.json({
        students: filteredStudents.slice(startIndex, startIndex + limit),
        total: filteredStudents.length,
        page,
        limit,
        isMock: true,
    });
}

export async function POST(request: NextRequest) {
    const payload = (await request.json()) as StudentFormValues;
    const student = buildStudent(payload);
    mockStudents = [student, ...mockStudents];

    return NextResponse.json({
        status: true,
        message: 'Student created successfully',
        data: student,
    });
}
