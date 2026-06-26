export type StudentGender = 'Male' | 'Female' | 'Other';
export type StudentStatus = 'Active' | 'Inactive';

export interface Student {
    id: string;
    studentId: string;
    studentName: string;
    grade: string;
    section: string;
    fatherName: string;
    motherName: string;
    gender: StudentGender;
    dateOfBirth: string;
    status: StudentStatus;
    createdDate: string;
    parentMobile: string;
    email: string;
    rollNo: string;
    udisecode: string;
    address: string;
}

export interface StudentFormValues {
    studentName: string;
    grade: string;
    section: string;
    fatherName: string;
    motherName: string;
    gender: StudentGender | '';
    dateOfBirth: string;
    status: StudentStatus;
    parentMobile: string;
    email: string;
    rollNo: string;
    udisecode: string;
    address: string;
}

export interface StudentListFilters {
    name: string;
    grade: string;
    section: string;
    status: string;
    page: number;
    limit: number;
}

export interface StudentListResponse {
    students: Student[];
    total: number;
    page: number;
    limit: number;
    isMock?: boolean;
}

export interface StudentOption {
    id: string;
    name: string;
    selectValue?: keyof StudentOption;
}

export interface StudentUploadValidationError {
    row: number;
    message: string;
}

export interface StudentUploadPreview {
    fileName: string;
    totalRecords: number;
    successCount: number;
    validationErrors: StudentUploadValidationError[];
}

export interface UploadStudentsPayload {
    file: File;
    preview: StudentUploadPreview;
}

export interface TeacherDashboardSummary {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    totalQuestionsAttempted: number;
    isMock?: boolean;
}
