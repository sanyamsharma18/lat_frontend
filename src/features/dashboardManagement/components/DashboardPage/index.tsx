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

import { useDashboardManagement } from '../../hooks/useDashboardManagement';

import { DASHBOARD_METRICS, DASHBOARD_TEXT, DEFAULT_SUMMARY } from './constant';

import styles from './styles.module.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
            labels: ['Teachers', 'Students', 'Generated'],
            datasets: [
                {
                    label: 'Count',
                    data: [
                        summary.totalTeachers,
                        summary.totalStudents,
                        summary.totalQuestionsGenerated,
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.22)',
                        'rgba(75, 192, 192, 0.24)',
                        'rgba(255, 205, 86, 0.24)',
                    ],
                    borderColor: ['#ff6384', '#4bc0c0', '#ffcd56'],
                    borderWidth: 1.5,
                    borderRadius: 0,
                    barThickness: 58,
                },
            ],
        }),
        [summary],
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
        if (dashboardSummaryQuery.isLoading) {
            return Array.from({ length: DASHBOARD_METRICS.length }).map((_, index) => (
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
            </section>
        </main>
    );
};

export default DashboardPage;
