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
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import { DashboardStatCard, DashboardTone } from '@/components/ui/DashboardWidgets';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';

import { FontType } from '@/types/typographyCommon';

import { useDashboardManagement } from '../../hooks/useDashboardManagement';

import { DASHBOARD_METRICS, DASHBOARD_TEXT, DEFAULT_SUMMARY } from './constant';

import styles from './styles.module.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const formatMetricValue = (value: number) => new Intl.NumberFormat('en-US').format(value);

const DashboardPage = () => {
    const { dashboardSummaryQuery } = useDashboardManagement();

    const summary = dashboardSummaryQuery.data ?? DEFAULT_SUMMARY;

    const metrics = useMemo(
        () =>
            DASHBOARD_METRICS.map(({ Icon, getValue, tone, ...metric }) => ({
                ...metric,
                tone: tone as DashboardTone,
                value: formatMetricValue(getValue(summary)),
                icon: <Icon />,
            })),
        [summary],
    );

    const barChartData = useMemo<ChartData<'bar'>>(
        () => ({
            labels: ['Teachers', 'Students', 'Generated', 'Attempted'],
            datasets: [
                {
                    label: 'Count',
                    data: [
                        summary.totalTeachers,
                        summary.totalStudents,
                        summary.totalQuestionsGenerated,
                        summary.totalQuestionsAttemptedLastYear,
                    ],
                    backgroundColor: ['#2563eb', '#16a34a', '#f97316', '#7c3aed'],
                    borderRadius: 8,
                    barThickness: 34,
                },
            ],
        }),
        [summary],
    );

    const questionChartData = useMemo<ChartData<'doughnut'>>(
        () => ({
            labels: ['Questions Generated', 'Attempted Last Year'],
            datasets: [
                {
                    data: [
                        summary.totalQuestionsGenerated,
                        summary.totalQuestionsAttemptedLastYear,
                    ],
                    backgroundColor: ['#f97316', '#7c3aed'],
                    borderColor: '#ffffff',
                    borderWidth: 4,
                    hoverOffset: 8,
                },
            ],
        }),
        [summary.totalQuestionsAttemptedLastYear, summary.totalQuestionsGenerated],
    );

    const barChartOptions = useMemo<ChartOptions<'bar'>>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (context) => formatMetricValue(Number(context.raw ?? 0)),
                    },
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#475569',
                        font: {
                            size: 12,
                            weight: 600,
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
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

    const doughnutChartOptions = useMemo<ChartOptions<'doughnut'>>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            cutout: '66%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        color: '#475569',
                        font: {
                            size: 12,
                            weight: 600,
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) =>
                            `${context.label}: ${formatMetricValue(Number(context.raw ?? 0))}`,
                    },
                },
            },
        }),
        [],
    );

    const renderSummaryCards = () => {
        if (dashboardSummaryQuery.isLoading) {
            return Array.from({ length: 4 }).map((_, index) => (
                <ShimmerUiContainer
                    key={`dashboard-summary-loading-${index + 1}`}
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
                    {DASHBOARD_TEXT.title}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {DASHBOARD_TEXT.subtitle}
                </Text>
            </section>

            {dashboardSummaryQuery.isError ? (
                <div className={styles.errorState} role='alert'>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='red-600'
                    >
                        {DASHBOARD_TEXT.errorTitle}
                    </Text>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        {DASHBOARD_TEXT.errorDescription}
                    </Text>
                </div>
            ) : null}

            {summary.isMock ? (
                <div className={styles.warningAlert} role='status'>
                    <Text
                        font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                        color='amber-700'
                    >
                        {DASHBOARD_TEXT.mockAlert}
                    </Text>
                </div>
            ) : null}

            <section className={styles.summaryGrid} aria-label='Dashboard summary metrics'>
                {renderSummaryCards()}
            </section>

            <section className={styles.chartGrid} aria-label='Dashboard analytics charts'>
                <article className={styles.chartPanel}>
                    <div className={styles.chartHeader}>
                        <Text
                            tagType='h2'
                            font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                            color='black'
                        >
                            {DASHBOARD_TEXT.volumeChartTitle}
                        </Text>
                        <Text
                            font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                            color='gray-500'
                        >
                            {DASHBOARD_TEXT.volumeChartSubtitle}
                        </Text>
                    </div>
                    <div className={styles.barChartCanvas}>
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </article>

                <article className={styles.chartPanel}>
                    <div className={styles.chartHeader}>
                        <Text
                            tagType='h2'
                            font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                            color='black'
                        >
                            {DASHBOARD_TEXT.questionChartTitle}
                        </Text>
                        <Text
                            font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                            color='gray-500'
                        >
                            {DASHBOARD_TEXT.questionChartSubtitle}
                        </Text>
                    </div>
                    <div className={styles.doughnutChartCanvas}>
                        <Doughnut data={questionChartData} options={doughnutChartOptions} />
                    </div>
                </article>
            </section>
        </main>
    );
};

export default DashboardPage;
