import { API_ROUTES } from '@/config/apiRoutes';
import { serverApi } from '@/lib/serverApi';
import { TeacherFormValues } from '@/types/teacher';

export const getTeachers = async (searchParams: URLSearchParams) =>
    serverApi({
        url: API_ROUTES.adminTeachers,
        searchParams,
    });

export const createTeacher = async (payload: TeacherFormValues) =>
    serverApi({
        url: API_ROUTES.adminTeachers,
        method: 'POST',
        body: payload,
    });

export const updateTeacher = async (teacherId: string, payload: TeacherFormValues) =>
    serverApi({
        url: `${API_ROUTES.adminTeachers}/${teacherId}`,
        method: 'PUT',
        body: payload,
    });

export const deleteTeacher = async (teacherId: string) =>
    serverApi({
        url: `${API_ROUTES.adminTeachers}/${teacherId}`,
        method: 'DELETE',
    });

export const uploadTeachers = async (payload: FormData) =>
    serverApi({
        url: API_ROUTES.uploadTeachers,
        method: 'POST',
        body: payload,
    });

export const getRegions = async () =>
    serverApi({
        url: API_ROUTES.regions,
    });

export const getSchoolsByRegion = async (searchParams: URLSearchParams) => {
    const regionId = searchParams.get('regionId') || '';
    searchParams.delete('regionId');
    return serverApi({
        url: API_ROUTES.schools(regionId),
        searchParams,
    });
};

export const getSubjects = async () =>
    serverApi({
        url: API_ROUTES.subjects,
    });

export const getGradeGroups = async () =>
    serverApi({
        url: API_ROUTES.gradeGroup,
    });

export const getGrades = async () =>
    serverApi({
        url: API_ROUTES.grades,
    });
