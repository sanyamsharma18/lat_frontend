import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
    const payload = await request.json();

    return NextResponse.json({
        status: true,
        message: 'Student status updated successfully',
        data: payload,
    });
}
