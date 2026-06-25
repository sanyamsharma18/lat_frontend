import { NextResponse } from 'next/server';

const STUDENT_TEMPLATE_HEADERS = [
    'Student Name',
    'Grade',
    'Section',
    'Father Name',
    'Mother Name',
    'Gender',
    'DOB',
    'Status',
];

export async function GET() {
    const csvTemplate = `${STUDENT_TEMPLATE_HEADERS.join(',')}\n`;

    return new NextResponse(csvTemplate, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="student-upload-template.csv"',
        },
    });
}
