import { API_ROUTES } from '@/config/apiRoutes';
import { serverApi } from '@/lib/serverApi';
import { DashboardSummary } from '@/types/dashboard';

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
    totalTeachers: 125,
    totalStudents: 4250,
    totalQuestionsGenerated: 25840,
    totalQuestionsAttemptedLastYear: 18520,
    isMock: true,
};

export const getDashboardSummary = async () => {
    const result = await serverApi<DashboardSummary>({
        url: API_ROUTES.dashboardSummary,
    });

    if (!result.ok) {
        throw new Error('Failed to fetch dashboard summary');
    }

    return result;
};
