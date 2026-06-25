export interface Teacher {
    id: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
    email: string;
    empCode: string;
    udisecode: string;
    gender: string;
    address: string;
    gradeId?: string;
    subjectId?: string;
    regionId: string;
    schoolId: string;
    schoolName: string;
    regionName: string;
}

export interface TeacherFormValues {
    firstName: string;
    lastName: string;
    mobileNo: string;
    email: string;
    empCode: string;
    udisecode: string;
    gender?: string;
    address?: string;
    gradeId: string;
    subjectId: string;
    regionId?: string;
    schoolId?: string;
    schoolName?: string;
}

export interface UploadTeachersPayload {
    file: File | null;
    sheetUrl: string;
}

export interface TeacherListFilters {
    teacherName: string;
    regionId: string;
    schoolId: string;
    page: number;
    limit: number;
}

export interface TeacherListResponse {
    teachers: Teacher[];
    total: number;
    page: number;
    limit: number;
    isFallback?: boolean;
}

export interface RegionOption {
    id: string;
    name: string;
    selectValue?: keyof RegionOption;
    isFallback?: boolean;
}

export interface SchoolOption {
    id: string;
    name: string;
    udiseCode?: string;
    selectValue?: keyof SchoolOption;
    isFallback?: boolean;
}

export interface GradeOption {
    id: string;
    name: string;
}

export interface SubjectOption {
    id: string;
    name: string;
}
