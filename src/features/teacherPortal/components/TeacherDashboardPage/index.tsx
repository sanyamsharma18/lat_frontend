'use client';

import { useMemo } from 'react';

import { DashboardStatCard, DashboardTone } from '@/components/ui/DashboardWidgets';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import { useTeacherDashboard } from '../../hooks/useTeacherDashboard';

import { TEACHER_DASHBOARD_METRICS, TEACHER_DASHBOARD_TEXT } from './constant';


import styles from './styles.module.scss';

const formatMetricValue = (value: number) => new Intl.NumberFormat('en-US').format(value);

const TeacherDashboardPage = () => {
    const { teacherDashboardQuery } = useTeacherDashboard();
    const summary = teacherDashboardQuery.data ?? {
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
        totalQuestionsAttempted: 0,
        isMock: false,
    };

    const metrics = useMemo(
        () =>
            TEACHER_DASHBOARD_METRICS.map(({ Icon, getValue, tone, ...metric }) => ({
                ...metric,
                tone: tone as DashboardTone,
                value: formatMetricValue(getValue(summary)),
                icon: <Icon />,
            })),
        [summary],
    );

    const renderSummaryCards = () => {
        if (teacherDashboardQuery.isLoading) {
            return Array.from({ length: 4 }).map((_, index) => (
                <ShimmerUiContainer
                    key={`teacher-dashboard-loading-${index + 1}`}
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
                    {TEACHER_DASHBOARD_TEXT.title}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {TEACHER_DASHBOARD_TEXT.subtitle}
                </Text>
            </section>

            {summary.isMock ? (
                <div className={styles.warningAlert} role='status'>
                    <Text
                        font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                        color='amber-700'
                    >
                        {TEACHER_DASHBOARD_TEXT.mockAlert}
                    </Text>
                </div>
            ) : null}

            <section className={styles.summaryGrid} aria-label='Teacher dashboard summary metrics'>
                {renderSummaryCards()}
            </section>
        </main>
    );
};

export default TeacherDashboardPage;
