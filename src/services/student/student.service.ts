import { API_ROUTES } from '@/config/apiRoutes';
import { serverApi } from '@/lib/serverApi';
import { StudentFormValues, StudentStatus } from '@/types/student';

export const getTeacherDashboard = async () =>
    serverApi({
        url: API_ROUTES.teacherDashboard,
    });

export const getStudents = async (searchParams: URLSearchParams) =>
    serverApi({
        url: API_ROUTES.teacherStudents,
        searchParams,
    });

export const createStudent = async (payload: StudentFormValues) =>
    serverApi({
        url: API_ROUTES.teacherStudents,
        method: 'POST',
        body: { ...payload },
    });

export const updateStudent = async (studentId: string, payload: StudentFormValues) =>
    serverApi({
        url: `${API_ROUTES.teacherStudents}/${studentId}`,
        method: 'PATCH',
        body: { ...payload },
    });

export const deleteStudent = async (studentId: string) =>
    serverApi({
        url: `${API_ROUTES.teacherStudents}/${studentId}`,
        method: 'DELETE',
    });

export const updateStudentStatus = async (studentId: string, status: StudentStatus | number) =>
    serverApi({
        url: `${API_ROUTES.teacherStudents}/status`,
        method: 'POST',
        body: { status, studentId },
    });

export const uploadStudents = async (payload: FormData) =>
    serverApi({
        url: `${API_ROUTES.teacherStudents}/upload`,
        method: 'POST',
        body: payload,
    });
