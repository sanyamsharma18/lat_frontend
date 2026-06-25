import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ status: true, message: 'Students uploaded successfully' });
}
