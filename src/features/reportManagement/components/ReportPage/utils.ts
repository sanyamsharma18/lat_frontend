import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi, { QueryParamType } from '@/lib/clientApi';
import { HTTP_METHOD } from '@/types/common';
import { ApiResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export interface ReportFilters {
    regionId?: string;
    gradeId?: string;
    subjectId?: string;
    academicYear?: string;
    assessmentCycle?: string;
    schoolId?: string;
    assessmentId?: string;
    competencyId?: string;
    dateFrom?: string;
    dateTo?: string;
}

const getReportData = async (type: string, filters: ReportFilters) => {
    const queryParams: QueryParamType = { ...filters };

    // Clean up empty filters
    Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key]) {
            delete queryParams[key];
        }
    });

    const response = await callApi<ApiResponse<any>>({
        url: `${ServerSideRoutes.ADMIN_REPORTS}/${type}`,
        method: HTTP_METHOD.GET,
        queryParams,
    });

    if (response.status === false || !response.response) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response.response.data || [];
};

export const useReportQuery = (type: string, filters: ReportFilters) => {
    return useQuery({
        queryKey: ['REPORTS', type, filters],
        queryFn: () => getReportData(type, filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
