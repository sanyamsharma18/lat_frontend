'use client';

import { ReactNode, useState } from 'react';

import DesktopSidebar from '@/components/shared/Sidebar/DesktopSidebar';
import MobileHeader from '@/components/shared/MobileHeader';
import MobileSidebar from '@/components/shared/Sidebar/MobileSidebar';

import { UserRoleDetail } from '@/types/auth';
import { UserRole } from '@/components/shared/Sidebar/constant';

import LogoutModal from '@/assets/Modals/LogoutModal';

import styles from './styles.module.scss';

interface AdminShellProps {
    children: ReactNode;
    fullName?: string;
    email?: string;
    role?: UserRoleDetail;
    userRole?: UserRole;
}

const FALLBACK_ADMIN_ROLE: UserRoleDetail = {
    id: 1,
    createdAt: '',
    updatedAt: '',
    name: 'Admin',
    status: 1,
};

const AdminShell = ({
    children,
    fullName = 'Admin User',
    email = 'admin@latportal.com',
    role = FALLBACK_ADMIN_ROLE,
    userRole = 'ADMIN',
}: AdminShellProps) => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [logoutModal, setLogoutModal] = useState<boolean>(false);

    return (
        <div className={styles.shell}>
            {logoutModal && <LogoutModal open={logoutModal} setOpen={setLogoutModal} />}
            <aside className={styles.desktopSidebar}>
                <DesktopSidebar
                    userRole={userRole}
                    setLogoutModal={setLogoutModal}
                    fullName={fullName}
                    email={email}
                    role={role}
                />
            </aside>

            <div className={styles.contentWrapper}>
                <div className={styles.mobileHeader}>
                    <MobileHeader
                        drawerOpen={drawerOpen}
                        setDrawerOpen={setDrawerOpen}
                        role={role}
                        isLoading={false}
                    />
                </div>

                <MobileSidebar
                    userRole={userRole}
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                    setLogoutModal={setLogoutModal}
                    fullName={fullName}
                    email={email}
                    role={role}
                />

                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default AdminShell;
