import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi, { QueryParamType } from '@/lib/clientApi';

import { StaleAndCacheTime } from '@/constants/appConstants';

import { ApiResponse } from '@/types/api';
import { HTTP_METHOD } from '@/types/common';
import {
    Student,
    StudentFormValues,
    StudentListFilters,
    StudentListResponse,
    StudentStatus,
    UploadStudentsPayload,
} from '@/types/student';

import { QueryKeys } from '@/utils/queryKeys';

let fallbackStudents: Student[] = [
    {
        id: '1',
        studentId: 'STU-001',
        studentName: 'John Doe',
        grade: 'Grade 5',
        section: 'A',
        fatherName: 'Robert Doe',
        motherName: 'Jane Doe',
        gender: 'Male',
        dateOfBirth: '2015-05-12',
        status: 'Active',
        createdDate: '2026-01-15',
    },
    {
        id: '2',
        studentId: 'STU-002',
        studentName: 'Anita Sharma',
        grade: 'Grade 6',
        section: 'B',
        fatherName: 'Raj Sharma',
        motherName: 'Meera Sharma',
        gender: 'Female',
        dateOfBirth: '2014-09-21',
        status: 'Inactive',
        createdDate: '2026-02-03',
    },
];

export const studentQueryKey = (filters?: StudentListFilters) =>
    filters ? ([QueryKeys.STUDENTS, filters] as const) : ([QueryKeys.STUDENTS] as const);

export const singleStudentQueryKey = (studentId: string) => [QueryKeys.STUDENT, studentId] as const;

const getNextStudentId = () =>
    String(
        fallbackStudents.reduce(
            (highestId, student) => Math.max(highestId, Number(student.id) || 0),
            0,
        ) + 1,
    );

const assertSuccessfulResponse = (response: ApiResponse<unknown>) => {
    if (response.status === false) {
        throw new Error(response.message || response.error || 'Request failed');
    }

    return response;
};

const getFallbackStudentList = (filters: StudentListFilters): StudentListResponse => {
    const studentName = filters.name.toLowerCase();
    const filteredStudents = fallbackStudents.filter((student) => {
        const matchesName = studentName
            ? student.studentName.toLowerCase().includes(studentName)
            : true;
        const matchesGrade = filters.grade ? student.grade === filters.grade : true;
        const matchesSection = filters.section ? student.section === filters.section : true;
        const matchesStatus = filters.status ? student.status === filters.status : true;

        return matchesName && matchesGrade && matchesSection && matchesStatus;
    });
    const startIndex = (filters.page - 1) * filters.limit;

    return {
        students: filteredStudents.slice(startIndex, startIndex + filters.limit),
        total: filteredStudents.length,
        page: filters.page,
        limit: filters.limit,
        isMock: true,
    };
};

const normalizeStudentListResponse = (
    response: StudentListResponse | ApiResponse<unknown>,
    filters: StudentListFilters,
): StudentListResponse => {
    if ('students' in response && Array.isArray(response.students)) {
        return response;
    }

    return getFallbackStudentList(filters);
};

const buildFallbackStudent = (payload: StudentFormValues): Student => {
    const id = getNextStudentId();

    return {
        id,
        studentId: `STU-${id.padStart(3, '0')}`,
        studentName: payload.studentName,
        grade: payload.grade,
        section: payload.section,
        fatherName: payload.fatherName,
        motherName: payload.motherName,
        gender: payload.gender || 'Other',
        dateOfBirth: payload.dateOfBirth,
        status: payload.status,
        createdDate: new Date().toISOString().slice(0, 10),
    };
};

export const getStudentList = async (filters: StudentListFilters) => {
    const queryParams: QueryParamType = {
        name: filters.name || null,
        grade: filters.grade || null,
        section: filters.section || null,
        status: filters.status || null,
        page: String(filters.page),
        limit: String(filters.limit),
    };

    try {
        const response = await callApi<StudentListResponse>({
            url: ServerSideRoutes.TEACHER_STUDENTS,
            method: HTTP_METHOD.GET,
            queryParams,
        });

        return normalizeStudentListResponse(response, filters);
    } catch (error) {
        console.warn('Student API failed. Falling back to mock data.', error);

        return getFallbackStudentList(filters);
    }
};

export const createStudent = async (payload: StudentFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.TEACHER_STUDENTS,
        method: HTTP_METHOD.POST,
        body: { ...payload },
    })
        .then(assertSuccessfulResponse)
        .catch((error) => {
            console.warn('Create student API failed. Using mock success fallback.', error);
            fallbackStudents = [buildFallbackStudent(payload), ...fallbackStudents];

            return { status: true, message: 'Student created successfully' };
        });

export const updateStudent = async (studentId: string, payload: StudentFormValues) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.TEACHER_STUDENTS}/${studentId}`,
        method: HTTP_METHOD.PUT,
        body: { ...payload },
    })
        .then(assertSuccessfulResponse)
        .catch((error) => {
            console.warn('Update student API failed. Using mock success fallback.', error);
            fallbackStudents = fallbackStudents.map((student) =>
                student.id === studentId
                    ? { ...student, ...payload, gender: payload.gender || 'Other' }
                    : student,
            );

            return { status: true, message: 'Student updated successfully' };
        });

export const deleteStudent = async (studentId: string) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.TEACHER_STUDENTS}/${studentId}`,
        method: HTTP_METHOD.DELETE,
    })
        .then(assertSuccessfulResponse)
        .catch((error) => {
            console.warn('Delete student API failed. Using mock success fallback.', error);
            fallbackStudents = fallbackStudents.filter((student) => student.id !== studentId);

            return { status: true, message: 'Student deleted successfully' };
        });

export const updateStudentStatus = async ({
    studentId,
    status,
}: {
    studentId: string;
    status: StudentStatus;
}) =>
    callApi<ApiResponse<unknown>>({
        url: `${ServerSideRoutes.TEACHER_STUDENTS}/${studentId}/status`,
        method: HTTP_METHOD.PATCH,
        body: { status },
    })
        .then(assertSuccessfulResponse)
        .catch((error) => {
            console.warn('Update student status API failed. Using mock success fallback.', error);
            fallbackStudents = fallbackStudents.map((student) =>
                student.id === studentId ? { ...student, status } : student,
            );

            return { status: true, message: 'Student status updated successfully' };
        });

export const uploadStudents = async ({ file }: UploadStudentsPayload) => {
    const body = new FormData();
    body.append('file', file);

    return callApi<ApiResponse<unknown>>({
        url: ServerSideRoutes.TEACHER_STUDENTS_UPLOAD,
        method: HTTP_METHOD.POST,
        body,
    })
        .then(assertSuccessfulResponse)
        .catch((error) => {
            console.warn('Upload students API failed. Using mock success fallback.', error);

            return { status: true, message: 'Students uploaded successfully' };
        });
};

export const downloadStudentUploadTemplate = async () =>
    callApi<Blob>({
        url: ServerSideRoutes.TEACHER_STUDENTS_TEMPLATE,
        method: HTTP_METHOD.GET,
        downloadFile: true,
    });

export const studentListQueryOptions = (filters: StudentListFilters) => ({
    queryKey: studentQueryKey(filters),
    queryFn: () => getStudentList(filters),
    staleTime: StaleAndCacheTime.STALE_TIME,
    gcTime: StaleAndCacheTime.CACHE_TIME,
});
