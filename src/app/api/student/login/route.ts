import { serverApiResponse } from '@/lib/serverApi';
import { studentLogin } from '@/services/studentPortal/studentPortal.service';

export async function POST() {
    const result = await studentLogin();

    return serverApiResponse(result);
}
