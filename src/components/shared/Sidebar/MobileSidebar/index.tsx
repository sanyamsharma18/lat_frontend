'use client';

import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import cx from 'classnames';

import Drawer from '@/components/shared/Drawer';
import Text from '@/components/ui/Text';

import SignOut from '@/assets/svg/sidebar-icon/sign-out.svg';

import { FontType } from '@/types/typographyCommon';

import { UserRoleDetail } from '@/types/auth';
import {
    getSidebarMenuByRole,
    MenuItem,
    SIDEBAR_CONTENT as constantData,
    UserRole,
} from '../constant';

import styles from './styles.module.scss';

interface MobileSidebarProps {
    userRole: UserRole | '';
    drawerOpen: boolean;
    setDrawerOpen: (value: boolean) => void;
    setLogoutModal: Dispatch<SetStateAction<boolean>>;
    fullName: string | undefined;
    email: string | undefined;
    role: UserRoleDetail | undefined;
}

const MobileSidebar = ({
    userRole,
    drawerOpen,
    setDrawerOpen,
    setLogoutModal,
    fullName,
    email,
    role,
}: MobileSidebarProps) => {
    const pathname = usePathname();

    const primaryMenu = getSidebarMenuByRole(userRole);

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleSignOut = () => {
        setLogoutModal(true);
        setDrawerOpen(false);
    };

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.path;

        return (
            <Link
                href={item.path}
                key={item.menuId}
                className={cx(styles.menuItem, isActive && styles.active)}
                onClick={handleCloseDrawer}
            >
                <span className={styles.icon}>{item.icon}</span>

                <Text
                    font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                    color={isActive ? 'amber-500' : 'slate-400'}
                    className={styles.menuText}
                >
                    {item.menuName}
                </Text>
            </Link>
        );
    };

    return (
        <Drawer anchor='left' drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}>
            <div className={styles.sidebarWrapper}>
                <div>
                    <div className={styles.titleContainer}>
                        <div className={styles.sidebarLoggedPosition}>
                            <Text
                                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                color='white'
                            >
                                {constantData.companyName}
                            </Text>

                            <Text
                                font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                color='slate-500'
                            >
                                {role?.name}
                            </Text>
                        </div>
                    </div>

                    <div className={styles.sidebarOption}>
                        <div className={styles.panel}>{primaryMenu.map(renderMenuItem)}</div>
                    </div>
                </div>

                <div className={styles.footerWrapper}>
                    <div className={styles.userDetail}>
                        <div className={styles.textLogo}>
                            <Text
                                font={[FontType.text_xs_semibold, FontType.text_xs_semibold]}
                                color='white'
                            >
                                S
                            </Text>
                        </div>

                        <div className={styles.sidebarLoggedPosition}>
                            <Text
                                font={[FontType.text_xs_medium, FontType.text_xs_medium]}
                                color='white'
                            >
                                {fullName}
                            </Text>

                            <Text
                                font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                color='slate-500'
                            >
                                {email}
                            </Text>
                        </div>
                    </div>

                    <button
                        type='button'
                        className={styles.signOutContainer}
                        onClick={handleSignOut}
                    >
                        <SignOut className={styles.icon} />

                        <Text
                            className={styles.menuText}
                            font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                            color='slate-500'
                        >
                            {constantData.signOutText}
                        </Text>
                    </button>
                </div>
            </div>
        </Drawer>
    );
};

export default MobileSidebar;
