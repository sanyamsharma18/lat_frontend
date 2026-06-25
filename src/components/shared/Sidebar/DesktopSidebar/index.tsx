'use client';

import { Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';

import cx from 'classnames';

import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import Link from 'next/link';

import SignOut from '@/assets/svg/sidebar-icon/sign-out.svg';

import { UserRoleDetail } from '@/types/auth';
import {
    getSidebarMenuByRole,
    MenuItem,
    SIDEBAR_CONTENT as constantData,
    UserRole,
} from '../constant';

import styles from './styles.module.scss';

interface SidebarProps {
    userRole: UserRole | '';
    setLogoutModal: Dispatch<SetStateAction<boolean>>;
    fullName: string | undefined;
    email: string | undefined;
    role: UserRoleDetail | undefined;
}

const Sidebar = ({ userRole, setLogoutModal, fullName, email, role }: SidebarProps) => {
    const pathname = usePathname();

    const primaryMenu = getSidebarMenuByRole(userRole);

    const renderMenuItem = (item: MenuItem) => {
        const isActive = pathname === item.path;
        return (
            <Link
                href={item?.path}
                key={item?.menuId}
                className={cx(styles.menuItem, isActive && styles.active)}
            >
                <span className={styles.icon}>{item?.icon}</span>

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

    const handleSignOut = () => {
        setLogoutModal(true);
    };

    return (
        <div className={styles['sidebar-wrapper']}>
            <div>
                <div className={styles['title-container']}>
                    <div className={styles['sidebar-logged-position']}>
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
                <div className={styles['sidebar-option']}>
                    <div className={styles.panel}>{primaryMenu?.map(renderMenuItem)}</div>
                </div>
            </div>
            <div className={styles['footer-wrapper']}>
                <div className={styles['user-detail']}>
                    <div className={styles['text-logo']}>
                        <Text
                            font={[FontType.text_xs_semibold, FontType.text_xs_semibold]}
                            color='white'
                        >
                            {fullName?.[0]}
                        </Text>
                    </div>
                    <div className={styles['sidebar-logged-position']}>
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

                <div
                    className={styles['signOut-container']}
                    onClick={handleSignOut}
                    aria-hidden='true'
                >
                    <SignOut className={styles.icon} />

                    <Text
                        className={styles.menuText}
                        font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                        color='slate-500'
                    >
                        {constantData.signOutText}
                    </Text>
                </div>
            </div>
        </div>
    );
};
export default Sidebar;
