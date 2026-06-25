import { ReactNode } from 'react';

import AdminShell from '@/components/shared/AdminShell';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => <AdminShell>{children}</AdminShell>;

export default AdminLayout;
