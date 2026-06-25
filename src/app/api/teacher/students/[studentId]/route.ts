import { NextRequest, NextResponse } from 'next/server';

import { StudentFormValues } from '@/types/student';

export async function PUT(request: NextRequest) {
    const payload = (await request.json()) as StudentFormValues;

    return NextResponse.json({
        status: true,
        message: 'Student updated successfully',
        data: payload,
    });
}

export async function DELETE() {
    return NextResponse.json({ status: true, message: 'Student deleted successfully' });
}
