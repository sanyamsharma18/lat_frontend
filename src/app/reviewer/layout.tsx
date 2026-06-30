import { ReactNode } from 'react';

import AdminShell from '@/components/shared/AdminShell';

interface ReviewerLayoutProps {
    children: ReactNode;
}

const REVIEWER_ROLE = {
    id: 4,
    createdAt: '',
    updatedAt: '',
    name: 'Reviewer',
    status: 1 as const,
};

const ReviewerLayout = ({ children }: ReviewerLayoutProps) => (
    <AdminShell
        userRole='REVIEWER'
        fullName='Reviewer User'
        email='reviewer@latportal.com'
        role={REVIEWER_ROLE}
    >
        {children}
    </AdminShell>
);

export default ReviewerLayout;
