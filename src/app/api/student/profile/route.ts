import { serverApiResponse } from '@/lib/serverApi';
import { getStudentProfile } from '@/services/studentPortal/studentPortal.service';

export async function GET() {
    const result = await getStudentProfile();

    return serverApiResponse(result);
}
