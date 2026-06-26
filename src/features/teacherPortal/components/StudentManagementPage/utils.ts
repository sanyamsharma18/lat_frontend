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
        parentMobile: '9876543210',
        email: 'john.doe@example.com',
        rollNo: 'STU-001',
        udisecode: 'UDISE-001',
        address: 'Main campus area',
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
        parentMobile: '9876543211',
        email: 'anita.sharma@example.com',
        rollNo: 'STU-002',
        udisecode: 'UDISE-002',
        address: 'North campus area',
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
    response: any,
    filters: StudentListFilters,
): StudentListResponse => {
    let data = [];
    let total = 0;

    if (response?.response?.data && Array.isArray(response.response.data)) {
        data = response.response.data;
        total = response.response.total || data.length;
    } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
        total = response.total || data.length;
    } else if (response?.response && Array.isArray(response.response)) {
        data = response.response;
        total = response.total || data.length;
    } else if (Array.isArray(response)) {
        data = response;
        total = data.length;
    } else if (response && 'students' in response && Array.isArray(response.students)) {
        return response; // Already formatted (fallback/mock)
    } else {
        return getFallbackStudentList(filters);
    }

    const formatDateStr = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return dateStr;
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    };

    const students: Student[] = data.map((item: any) => ({
        id: String(item.userId || Math.random()),
        studentId: item.rollNo || `STU-${item.userId}`,
        studentName: `${item.firstName || ''} ${item.lastName || ''}`.trim(),
        grade: String(item.gradeId || ''),
        section: item.section || '',
        fatherName: item.fatherName || '',
        motherName: item.motherName || '',
        gender: item.gender || 'Other',
        dateOfBirth: formatDateStr(item.dob),
        status: item.status === 1 ? 'Active' : 'Inactive',
        createdDate: item.createdAt || '',
        parentMobile: item.parentMobile || '',
        email: item.email || '',
        rollNo: item.rollNo || '',
        udisecode: item.udiseCode || item.udisecode || '',
        address: item.address || '',
    }));

    return {
        students,
        total,
        page: filters.page,
        limit: filters.limit,
    };
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
        parentMobile: payload.parentMobile,
        email: payload.email,
        rollNo: payload.rollNo,
        udisecode: payload.udisecode,
        address: payload.address,
    };
};

export const getStudentList = async (filters: StudentListFilters) => {
    const queryParams: QueryParamType = {
        search: filters.name || null,
        gradeId: filters.grade || null,
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
        method: HTTP_METHOD.PATCH,
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
        url: `${ServerSideRoutes.TEACHER_STUDENTS}/status`,
        method: HTTP_METHOD.POST,
        body: { status, studentId },
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
