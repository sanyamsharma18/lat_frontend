import AnalyticsIcon from '@/assets/svg/sidebar-icon/analytics-icon.svg';
import DashboardIcon from '@/assets/svg/sidebar-icon/dashboard-icon.svg';

import { ReviewerDashboardSummary } from '@/types/reviewerDashboard';

export const REVIEWER_DASHBOARD_TEXT = {
    title: 'Reviewer Dashboard',
    subtitle: 'Track question review volume and approval outcomes.',
    activityChartTitle: 'Review Overview',
    activityChartSubtitle: 'Total, approved, rejected, and draft questions.',
    errorTitle: 'Unable to load reviewer dashboard.',
    errorDescription: 'Please refresh the page or try again later.',
    mockAlert: 'Showing mock reviewer dashboard data until backend metrics are available.',
};

export const REVIEWER_ACTIVITY_CHART_LABELS = ['Total', 'Approved', 'Rejected', 'Draft'] as const;

export const REVIEWER_ACTIVITY_CHART_COLORS = [
    'rgba(255, 99, 132, 0.22)',
    'rgba(75, 192, 192, 0.24)',
    'rgba(255, 205, 86, 0.24)',
    'rgba(153, 102, 255, 0.22)',
] as const;

export const REVIEWER_ACTIVITY_CHART_BORDERS = [
    '#ff6384',
    '#4bc0c0',
    '#ffcd56',
    '#9966ff',
] as const;

export const DEFAULT_REVIEWER_SUMMARY: ReviewerDashboardSummary = {
    totalQuestions: 0,
    approvedQuestions: 0,
    rejectedQuestions: 0,
    draftQuestions: 0,
    isMock: false,
};

export const REVIEWER_DASHBOARD_METRICS = [
    {
        id: 'totalQuestions',
        title: 'Total Questions',
        description: 'Questions assigned for review',
        tone: 'blue',
        Icon: DashboardIcon,
        getValue: (summary: ReviewerDashboardSummary) => summary.totalQuestions,
    },
    {
        id: 'approvedQuestions',
        title: 'Approved Questions',
        description: 'Questions accepted by reviewer',
        tone: 'green',
        Icon: AnalyticsIcon,
        getValue: (summary: ReviewerDashboardSummary) => summary.approvedQuestions,
    },
    {
        id: 'rejectedQuestions',
        title: 'Rejected Questions',
        description: 'Questions sent back for correction',
        tone: 'orange',
        Icon: AnalyticsIcon,
        getValue: (summary: ReviewerDashboardSummary) => summary.rejectedQuestions,
    },
    {
        id: 'draftQuestions',
        title: 'Draft Questions',
        description: 'Questions waiting for review',
        tone: 'purple',
        Icon: AnalyticsIcon,
        getValue: (summary: ReviewerDashboardSummary) => summary.draftQuestions,
    },
] as const;
