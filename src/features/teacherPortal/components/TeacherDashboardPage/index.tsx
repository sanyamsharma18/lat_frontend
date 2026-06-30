'use client';

import { useMemo } from 'react';

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { DashboardStatCard, DashboardTone } from '@/components/ui/DashboardWidgets';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import { useTeacherDashboard } from '../../hooks/useTeacherDashboard';

import {
    TEACHER_ACTIVITY_CHART_BORDERS,
    TEACHER_ACTIVITY_CHART_COLORS,
    TEACHER_ACTIVITY_CHART_LABELS,
    TEACHER_DASHBOARD_METRICS,
    TEACHER_DASHBOARD_TEXT,
} from './constant';

import styles from './styles.module.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatMetricValue = (value: number) => new Intl.NumberFormat('en-US').format(value);

const TeacherDashboardPage = () => {
    const { teacherDashboardQuery } = useTeacherDashboard();
    const summary = useMemo(
        () =>
            teacherDashboardQuery.data ?? {
                totalStudents: 0,
                activeStudents: 0,
                inactiveStudents: 0,
                totalQuestionsAttempted: 0,
                isMock: false,
            },
        [teacherDashboardQuery.data],
    );

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

    const activityChartData = useMemo<ChartData<'bar'>>(
        () => ({
            labels: [...TEACHER_ACTIVITY_CHART_LABELS],
            datasets: [
                {
                    label: 'Students',
                    data: [
                        summary.totalStudents,
                        summary.activeStudents,
                        summary.inactiveStudents,
                    ],
                    backgroundColor: [...TEACHER_ACTIVITY_CHART_COLORS],
                    borderColor: [...TEACHER_ACTIVITY_CHART_BORDERS],
                    borderWidth: 1.5,
                    borderRadius: 0,
                    barThickness: 58,
                },
            ],
        }),
        [summary.activeStudents, summary.inactiveStudents, summary.totalStudents],
    );

    const activityChartOptions = useMemo<ChartOptions<'bar'>>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Students: ${formatMetricValue(Number(context.raw ?? 0))}`,
                    },
                },
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.22)',
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(148, 163, 184, 0.22)',
                    },
                    ticks: {
                        color: '#64748b',
                        callback: (value) => formatMetricValue(Number(value)),
                    },
                },
            },
        }),
        [],
    );

    const renderSummaryCards = () => {
        if (teacherDashboardQuery.isLoading) {
            return Array.from({ length: TEACHER_DASHBOARD_METRICS.length }).map((_, index) => (
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

            <section className={styles.chartGrid} aria-label='Teacher dashboard activity chart'>
                <article className={styles.chartPanel}>
                    <div className={styles.chartHeader}>
                        <Text
                            tagType='h2'
                            font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                            color='black'
                        >
                            {TEACHER_DASHBOARD_TEXT.activityChartTitle}
                        </Text>
                        <Text
                            font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                            color='gray-500'
                        >
                            {TEACHER_DASHBOARD_TEXT.activityChartSubtitle}
                        </Text>
                    </div>
                    <div className={styles.barChartCanvas}>
                        <Bar data={activityChartData} options={activityChartOptions} />
                    </div>
                </article>
            </section>
        </main>
    );
};

export default TeacherDashboardPage;
