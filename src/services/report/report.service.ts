import { API_ROUTES } from '@/config/apiRoutes';
import { serverApi } from '@/lib/serverApi';

export const getReportData = async (type: string, searchParams: URLSearchParams) =>
    serverApi({
        url: API_ROUTES.reports(type),
        searchParams,
    });
