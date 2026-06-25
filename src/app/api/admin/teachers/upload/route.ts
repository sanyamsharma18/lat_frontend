import { NextRequest } from 'next/server';

import { serverApiResponse } from '@/lib/serverApi';
import { uploadTeachers } from '@/services/teacher/teacher.service';

export async function POST(request: NextRequest) {
    const body = await request.formData();
    const result = await uploadTeachers(body);

    return serverApiResponse(result);
}
