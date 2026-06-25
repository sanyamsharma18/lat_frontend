import { serverApiResponse } from '@/lib/serverApi';
import { getDashboardSummary } from '@/services/dashboard/dashboard.service';

export async function GET() {
    const result = await getDashboardSummary();

    return serverApiResponse(result);
}
