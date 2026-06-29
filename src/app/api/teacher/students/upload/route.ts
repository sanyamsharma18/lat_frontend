import { NextRequest, NextResponse } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { uploadStudents } from '@/services/student/student.service';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
        return NextResponse.json(
            { status: false, message: 'Student upload file is required' },
            { status: 400 },
        );
    }

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await uploadStudents(backendFormData);

    return serverApiResponse(response);
}
