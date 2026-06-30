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

import { useReviewerDashboard } from '../../hooks/useReviewerDashboard';

import {
    DEFAULT_REVIEWER_SUMMARY,
    REVIEWER_ACTIVITY_CHART_BORDERS,
    REVIEWER_ACTIVITY_CHART_COLORS,
    REVIEWER_ACTIVITY_CHART_LABELS,
    REVIEWER_DASHBOARD_METRICS,
    REVIEWER_DASHBOARD_TEXT,
} from './constant';

import styles from './styles.module.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

    const reviewActivityChartData = useMemo<ChartData<'bar'>>(
        () => ({
            labels: [...REVIEWER_ACTIVITY_CHART_LABELS],
            datasets: [
                {
                    label: 'Questions',
                    data: [
                        summary.totalQuestions,
                        summary.approvedQuestions,
                        summary.rejectedQuestions,
                        summary.draftQuestions,
                    ],
                    backgroundColor: [...REVIEWER_ACTIVITY_CHART_COLORS],
                    borderColor: [...REVIEWER_ACTIVITY_CHART_BORDERS],
                    borderWidth: 1.5,
                    borderRadius: 0,
                    barThickness: 58,
                },
            ],
        }),
        [
            summary.approvedQuestions,
            summary.draftQuestions,
            summary.rejectedQuestions,
            summary.totalQuestions,
        ],
    );

    const reviewActivityChartOptions = useMemo<ChartOptions<'bar'>>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Questions: ${formatMetricValue(Number(context.raw ?? 0))}`,
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

            <section className={styles.chartGrid} aria-label='Reviewer dashboard activity chart'>
                <article className={styles.chartPanel}>
                    <div className={styles.chartHeader}>
                        <Text
                            tagType='h2'
                            font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                            color='black'
                        >
                            {REVIEWER_DASHBOARD_TEXT.activityChartTitle}
                        </Text>
                        <Text
                            font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                            color='gray-500'
                        >
                            {REVIEWER_DASHBOARD_TEXT.activityChartSubtitle}
                        </Text>
                    </div>
                    <div className={styles.barChartCanvas}>
                        <Bar
                            data={reviewActivityChartData}
                            options={reviewActivityChartOptions}
                        />
                    </div>
                </article>
            </section>
        </main>
    );
};

export default ReviewerDashboardPage;
