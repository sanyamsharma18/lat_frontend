import styles from './styles.module.scss';

const DesktopSidebarShimmer = () => (
    <div className={styles.sidebarWrapperShimmer}>
        <div>
            {/* Header */}
            <div className={styles.titleContainerShimmer}>
                <div className={`${styles.shimmer} ${styles.logoShimmer}`} />

                <div className={styles.companyDetails}>
                    <div className={`${styles.shimmer} ${styles.companyNameShimmer}`} />
                    <div className={`${styles.shimmer} ${styles.roleShimmer}`} />
                </div>
            </div>

            {/* Menu */}
            <div className={styles.menuWrapperShimmer}>
                {Array.from({ length: 4 }).map(() => (
                    <div className={styles.menuItemShimmer}>
                        <div className={`${styles.shimmer} ${styles.menuIconShimmer}`} />

                        <div className={`${styles.shimmer} ${styles.menuTextShimmer}`} />
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
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
);

export default DesktopSidebarShimmer;
