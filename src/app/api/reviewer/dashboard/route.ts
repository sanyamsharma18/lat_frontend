import { serverApiResponse } from '@/lib/serverApi';
import { getReviewerDashboard } from '@/services/reviewer/reviewer.service';

export async function GET() {
    const result = await getReviewerDashboard();
    return serverApiResponse(result);
}
