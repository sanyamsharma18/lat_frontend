import Drawer from '@/components/shared/Drawer';

import styles from '../DesktopShimmerSidebar/styles.module.scss';

interface MobileSidebarShimmerProps {
    drawerOpen: boolean;
    setDrawerOpen: (value: boolean) => void;
}

const MobileSidebarShimmer = ({ drawerOpen, setDrawerOpen }: MobileSidebarShimmerProps) => (
    <Drawer anchor='left' drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}>
        <div className={styles.sidebarWrapperShimmer}>
            <div>
                <div className={styles.titleContainerShimmer}>
                    <div className={`${styles.shimmer} ${styles.logoShimmer}`} />

                    <div className={styles.companyDetailsShimmer}>
                        <div className={`${styles.shimmer} ${styles.companyNameShimmer}`} />

                        <div className={`${styles.shimmer} ${styles.roleShimmer}`} />
                    </div>
                </div>

                <div className={styles.menuWrapperShimmer}>
                    {Array.from({ length: 4 }).map(() => (
                        <div className={styles.menuItemShimmer}>
                            <div className={`${styles.shimmer} ${styles.menuIconShimmer}`} />
                            <div className={`${styles.shimmer} ${styles.menuTextShimmer}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.footerWrapperShimmer}>
                <div className={styles.userDetailShimmer}>
                    <div className={`${styles.shimmer} ${styles.avatarShimmer}`} />

                    <div className={styles.userInfoShimmer}>
                        <div className={`${styles.shimmer} ${styles.userNameShimmer}`} />

                        <div className={`${styles.shimmer} ${styles.emailShimmer}`} />
                    </div>
                </div>

                <div className={styles.signOutShimmer}>
                    <div className={`${styles.shimmer} ${styles.menuIconShimmer}`} />

                    <div className={`${styles.shimmer} ${styles.signOutTextShimmer}`} />
                </div>
            </div>
        </div>
    </Drawer>
);

export default MobileSidebarShimmer;
