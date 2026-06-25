'use client';

import SidebarDrawer from '@/assets/svg/sidebar-drawer.svg';

import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import { UserRoleDetail } from '@/types/auth';

import styles from './styles.module.scss';

interface MobileHeaderProps {
    drawerOpen: boolean;
    setDrawerOpen: (value: boolean) => void;
    role: UserRoleDetail | undefined;
    isLoading: boolean;
}

const MobileHeader = ({ setDrawerOpen, drawerOpen, role, isLoading }: MobileHeaderProps) => {
    const handleOpenDrawer = () => {
        setDrawerOpen(true);
    };

    return (
        <header className={styles.mainContainer}>
            <button
                type='button'
                className={styles.drawerButton}
                onClick={handleOpenDrawer}
                aria-label='Open sidebar'
            >
                <SidebarDrawer />
            </button>
            {!drawerOpen && (
                <div className={styles.headerContent}>
                    <Text font={[FontType.text_xs_regular, FontType.text_xs_regular]} color='white'>
                        Sol Tracker
                    </Text>
                    {!isLoading ? (
                        <Text
                            font={[FontType.text_xxs_regular, FontType.text_xxs_regular]}
                            color='slate-500'
                        >
                            {role && role.name}
                        </Text>
                    ) : (
                        <div className={`${styles.shimmer} ${styles['shimmer-text-container']}`} />
                    )}
                </div>
            )}
        </header>
    );
};

export default MobileHeader;
