'use client';

import { useMemo } from 'react';

import { DashboardStatCard, DashboardTone } from '@/components/ui/DashboardWidgets';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import { useReviewerDashboard } from '../../hooks/useReviewerDashboard';

import {
    DEFAULT_REVIEWER_SUMMARY,
    REVIEWER_DASHBOARD_METRICS,
    REVIEWER_DASHBOARD_TEXT,
} from './constant';

import styles from './styles.module.scss';

const formatMetricValue = (value: number) => new Intl.NumberFormat('en-US').format(value);

const ReviewerDashboardPage = () => {
    const { reviewerDashboardQuery } = useReviewerDashboard();
    const summary = reviewerDashboardQuery.data ?? DEFAULT_REVIEWER_SUMMARY;

    const metrics = useMemo(
        () =>
            REVIEWER_DASHBOARD_METRICS.map(({ Icon, getValue, tone, ...metric }) => ({
                ...metric,
                tone: tone as DashboardTone,
                value: formatMetricValue(getValue(summary)),
                icon: <Icon />,
            })),
        [summary],
    );

    const renderSummaryCards = () => {
        if (reviewerDashboardQuery.isLoading) {
            return Array.from({ length: 4 }).map((_, index) => (
                <ShimmerUiContainer
                    key={`reviewer-dashboard-loading-${index + 1}`}
                    className={styles.shimmerCard}
                />
            ));
        }

        return metrics.map((metric) => <DashboardStatCard key={metric.id} {...metric} />);
    };

    return (
        <main className={styles.page}>
            <section className={styles.header}>
                <Text
                    tagType='h1'
                    font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}
                    color='black'
                >
                    {REVIEWER_DASHBOARD_TEXT.title}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {REVIEWER_DASHBOARD_TEXT.subtitle}
                </Text>
            </section>

            {reviewerDashboardQuery.isError ? (
                <div className={styles.errorState} role='alert'>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='red-600'
                    >
                        {REVIEWER_DASHBOARD_TEXT.errorTitle}
                    </Text>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        {REVIEWER_DASHBOARD_TEXT.errorDescription}
                    </Text>
                </div>
            ) : null}

            {summary.isMock ? (
                <div className={styles.warningAlert} role='status'>
                    <Text
                        font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                        color='amber-700'
                    >
                        {REVIEWER_DASHBOARD_TEXT.mockAlert}
                    </Text>
                </div>
            ) : null}

            <section className={styles.summaryGrid} aria-label='Reviewer dashboard summary metrics'>
                {renderSummaryCards()}
            </section>
        </main>
    );
};

export default ReviewerDashboardPage;
