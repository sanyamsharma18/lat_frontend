export const JWT_TOKEN = 'x_tok';
export const USER_DETAIL = 'x_det';
export const CLIENT_USER_DETAIL = 'c_x_det';
export const USER_MENU_LIST = 'x_m_li';
export const STUDENT_EXAM_ID = 'student_exam_id';

export const USER_EMAIL = 'x-m';

export const AUTH_ROUTES = {
    login: '/',
    adminDashboard: '/admin/dashboard',
    teacherDashboard: '/teacher/dashboard',
    studentDashboard: '/student/dashboard',
    reviewerDashboard: '/reviewer/dashboard',
} as const;

export const PROTECTED_ROLE_SEGMENTS = ['admin', 'teacher', 'student', 'reviewer'] as const;

export type ProtectedRoleSegment = (typeof PROTECTED_ROLE_SEGMENTS)[number];
