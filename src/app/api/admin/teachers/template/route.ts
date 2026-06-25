import { NextResponse } from 'next/server';

const TEACHER_TEMPLATE_HEADERS = ['Teacher Name', 'Grade', 'Subject', 'Region', 'School'];

export async function GET() {
    const csvTemplate = `${TEACHER_TEMPLATE_HEADERS.join(',')}\n`;

    return new NextResponse(csvTemplate, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="teacher-upload-template.csv"',
        },
    });
}
