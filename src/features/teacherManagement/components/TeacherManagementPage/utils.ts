import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi, { QueryParamType } from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { HTTP_METHOD } from '@/types/common';
import { ApiResponse } from '@/types/api';
import {
    Teacher,
    TeacherFormValues,
    TeacherListFilters,
    TeacherListResponse,
    RegionOption,
    SchoolOption,
    UploadTeachersPayload,
    GradeOption,
    SubjectOption,
} from '@/types/teacher';

import { QueryKeys } from '@/utils/queryKeys';

export const teacherQueryKey = (filters?: TeacherListFilters) =>
    filters ? ([QueryKeys.TEACHERS, filters] as const) : ([QueryKeys.TEACHERS] as const);

export const regionQueryKey = () => [QueryKeys.REGIONS] as const;

export const schoolQueryKey = (regionId?: string) =>
    regionId ? ([QueryKeys.SCHOOLS, regionId] as const) : ([QueryKeys.SCHOOLS] as const);

export const gradeGroupQueryKey = () => ['GRADE_GROUP'] as const;
export const gradeQueryKey = (groupId?: string) => groupId ? ['GRADES', groupId] as const : ['GRADES'] as const;
export const subjectQueryKey = () => ['SUBJECTS'] as const;

const assertSuccessfulResponse = (response: any) => {
    if (response?.status === false || response?.success === false) {
        throw new Error(response.message || response?.error || 'Request failed');
    }
    return response;
};

const extractDataArray = (response: any): any[] => {
    if (Array.isArray(response)) return response;
    if (response?.response?.data && Array.isArray(response.response.data)) return response.response.data;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.response && Array.isArray(response.response)) return response.response;
    return [];
};

const extractPaginationTotal = (response: any): number => {
    if (response?.response?.total !== undefined) return response.response.total;
    if (response?.total !== undefined) return response.total;
    return 0;
};

export const getTeacherList = async (filters: TeacherListFilters): Promise<TeacherListResponse> => {
    const queryParams: QueryParamType = {
        page: String(filters.page),
        limit: String(filters.limit),
    };
    if (filters.teacherName) {
        queryParams.search = filters.teacherName;
    }
    if (filters.regionId) {
        queryParams.regionId = filters.regionId;
    }
    if (filters.schoolId) {
        queryParams.schoolId = filters.schoolId;
    }

    const response = await callApi<ApiResponse<any>>({
        url: ServerSideRoutes.ADMIN_TEACHERS,
        method: HTTP_METHOD.GET,
        queryParams,
    });

    assertSuccessfulResponse(response);

    const data = extractDataArray(response);
    const total = extractPaginationTotal(response) || data.length;

    const teachers: Teacher[] = data.map((item: any) => ({
        id: String(item.userId || ''),
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        mobileNo: item.mobileNo || '',
        email: item.email || '',
        empCode: item.employeeCode || '',
        udisecode: item.udiseCode || '',
        gender: item.gender || '',
        address: item.address || '',
        gradeId: String(item.gradeId || ''),
        subjectId: String(item.subjectId || ''),
        regionId: String(item.regionId || ''),
        schoolId: String(item.schoolId || ''),
        schoolName: item.schoolName || '',
        regionName: item.regionName || '',
    }));

    return {
        teachers,
        total,
        page: filters.page,
        limit: filters.limit,
    };
};

export const createTeacher = async (payload: TeacherFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.ADMIN_TEACHERS,
        method: HTTP_METHOD.POST,
        body: payload,
    }).then(assertSuccessfulResponse);

export const updateTeacher = async (teacherId: string, payload: TeacherFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.ADMIN_TEACHERS}/${teacherId}`,
        method: HTTP_METHOD.PUT,
        body: payload,
    }).then(assertSuccessfulResponse);

export const deleteTeacher = async (teacherId: string) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.ADMIN_TEACHERS}/${teacherId}`,
        method: HTTP_METHOD.DELETE,
    }).then(assertSuccessfulResponse);

export const uploadTeachers = async ({ file, sheetUrl }: UploadTeachersPayload) => {
    const body = new FormData();
    if (file) {
        body.append('file', file);
    }
    if (sheetUrl.trim()) {
        body.append('sheetUrl', sheetUrl.trim());
    }

    return callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.ADMIN_TEACHERS_UPLOAD,
        method: HTTP_METHOD.POST,
        body,
    }).then(assertSuccessfulResponse);
};

export const downloadTeacherUploadTemplate = async () =>
    callApi<Blob>({
        url: ServerSideRoutes.ADMIN_TEACHERS_TEMPLATE,
        method: HTTP_METHOD.GET,
        downloadFile: true,
    });

export const teacherListQueryOptions = (filters: TeacherListFilters) => ({
    queryKey: teacherQueryKey(filters),
    queryFn: () => getTeacherList(filters),
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const getRegions = async () => {
    const response = await callApi<ApiResponse<any>>({
        url: ServerSideRoutes.ADMIN_REGIONS,
        method: HTTP_METHOD.GET,
    });
    assertSuccessfulResponse(response);
    return extractDataArray(response).map((item: any) => ({
        id: String(item.id),
        name: item.name,
    })) as RegionOption[];
};

export const getSchoolsByRegion = async (regionId: string) => {
    const response = await callApi<ApiResponse<any>>({
        url: ServerSideRoutes.ADMIN_SCHOOLS,
        method: HTTP_METHOD.GET,
        queryParams: { regionId },
    });
    assertSuccessfulResponse(response);
    return extractDataArray(response).map((item: any) => ({
        id: String(item.id),
        name: item.schoolName,
        udiseCode: item.udiseCode,
    })) as SchoolOption[];
};

export const getGradeGroups = async () => {
    const response = await callApi<ApiResponse<any>>({
        url: ServerSideRoutes.GRADE_GROUP,
        method: HTTP_METHOD.GET,
    });
    assertSuccessfulResponse(response);
    return extractDataArray(response).map((item: any) => ({
        id: String(item.id),
        name: item.name,
    }));
};

export const getAllGrades = async () => {
    const response = await callApi<ApiResponse<any>>({
        url: ServerSideRoutes.GRADES,
        method: HTTP_METHOD.GET,
    });
    assertSuccessfulResponse(response);
    return extractDataArray(response).map((item: any) => ({
        id: String(item.id),
        name: item.name,
    })) as GradeOption[];
};

export const getSubjects = async () => {
    const response = await callApi<ApiResponse<any>>({
        url: ServerSideRoutes.SUBJECTS,
        method: HTTP_METHOD.GET,
    });
    assertSuccessfulResponse(response);
    return extractDataArray(response).map((item: any) => ({
        id: String(item.id),
        name: item.name,
    })) as SubjectOption[];
};

export const regionQueryOptions = () => ({
    queryKey: regionQueryKey(),
    queryFn: getRegions,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const schoolQueryOptions = (regionId: string) => ({
    queryKey: schoolQueryKey(regionId),
    queryFn: () => getSchoolsByRegion(regionId),
    enabled: Boolean(regionId),
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const gradeGroupQueryOptions = () => ({
    queryKey: gradeGroupQueryKey(),
    queryFn: getGradeGroups,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});



export const allGradesQueryOptions = () => ({
    queryKey: ['ALL_GRADES'] as const,
    queryFn: getAllGrades,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});

export const subjectQueryOptions = () => ({
    queryKey: subjectQueryKey(),
    queryFn: getSubjects,
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
