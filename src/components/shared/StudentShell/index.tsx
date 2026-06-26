'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import cx from 'classnames';

import LogoutModal from '@/assets/Modals/LogoutModal';

import Text from '@/components/ui/Text';

import useClickOutside from '@/hooks/useClickOutside';

import { FontType } from '@/types/typographyCommon';

import { getClientUserDetails } from '@/utils/cookieManager';

import styles from './styles.module.scss';

interface StudentShellProps {
    children: ReactNode;
}

interface ClientStudentDetail {
    fullName?: string;
    firstName?: string;
    lastName?: string;
}

const getDisplayName = (userDetail: ClientStudentDetail | null) => {
    if (!userDetail) {
        return 'Student';
    }

    const fullName =
        userDetail.fullName || `${userDetail.firstName || ''} ${userDetail.lastName || ''}`.trim();

    return fullName || 'Student';
};

const StudentShell = ({ children }: StudentShellProps) => {
    const pathname = usePathname();
    const [studentName, setStudentName] = useState('Student');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setIsMenuOpen(false));

    useEffect(() => {
        setStudentName(getDisplayName(getClientUserDetails() as ClientStudentDetail | null));
    }, []);

    const handleLogoutClick = () => {
        setIsMenuOpen(false);
        setLogoutModal(true);
    };

    const showProfileMenu = pathname !== '/student/examination';

    return (
        <div className={styles.shell}>
            {logoutModal && <LogoutModal open={logoutModal} setOpen={setLogoutModal} />}

            <header className={styles.header}>
                <div>
                    <Text
                        tagType='strong'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        Lat Portal&nbsp;
                    </Text>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        Student Examination Portal
                    </Text>
                </div>

                {showProfileMenu ? (
                    <div className={styles.profileMenu} ref={menuRef}>
                        <button
                            type='button'
                            className={cx(
                                styles.profileButton,
                                isMenuOpen && styles.profileButtonOpen,
                            )}
                            onClick={() => setIsMenuOpen((previous) => !previous)}
                            aria-expanded={isMenuOpen}
                            aria-haspopup='menu'
                        >
                            <div className={styles.profileInfo}>
                                <div className={styles.avatar}>
                                    {studentName?.charAt(0)?.toUpperCase()}
                                </div>

                                <div className={styles.userDetails}>
                                    <Text
                                        color='black'
                                        font={[FontType.text_md_regular, FontType.text_md_regular]}
                                    >
                                        Welcome
                                    </Text>
                                    <Text
                                        color='black'
                                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                    >
                                        {studentName}
                                    </Text>
                                </div>
                            </div>

                            <span
                                className={cx(styles.arrow, isMenuOpen && styles.arrowOpen)}
                                aria-hidden='true'
                            >
                                ▼
                            </span>
                        </button>

                        {isMenuOpen && (
                            <div className={styles.menu} role='menu'>
                                <button
                                    type='button'
                                    className={styles.menuItem}
                                    onClick={handleLogoutClick}
                                    role='menuitem'
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.examLockStatus} aria-live='polite'>
                        <span className={styles.lockDot} />
                        <Text
                            font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                            color='slate-600'
                        >
                            Examination in progress
                        </Text>
                    </div>
                )}
            </header>

            <main className={styles.content}>{children}</main>
        </div>
    );
};

export default StudentShell;
