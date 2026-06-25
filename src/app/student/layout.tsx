import { ReactNode } from 'react';

import StudentShell from '@/components/shared/StudentShell';

interface StudentLayoutProps {
    children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => (
    <StudentShell>{children}</StudentShell>
);

export default StudentLayout;
