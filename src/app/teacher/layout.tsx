import { ReactNode } from 'react';

import AdminShell from '@/components/shared/AdminShell';
import { UserRoleDetail } from '@/types/auth';

interface TeacherLayoutProps {
    children: ReactNode;
}

const TEACHER_ROLE: UserRoleDetail = {
    id: 2,
    createdAt: '',
    updatedAt: '',
    name: 'Teacher',
    status: 1,
};

const TeacherLayout = ({ children }: TeacherLayoutProps) => (
    <AdminShell
        userRole='TEACHER'
        fullName='Teacher User'
        email='teacher@latportal.com'
        role={TEACHER_ROLE}
    >
        {children}
    </AdminShell>
);

export default TeacherLayout;
