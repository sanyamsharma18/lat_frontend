import AnalyticsIcon from '@/assets/svg/sidebar-icon/analytics-icon.svg';
import DashboardIcon from '@/assets/svg/sidebar-icon/dashboard-icon.svg';

import { ReviewerDashboardSummary } from '@/types/reviewerDashboard';

export const REVIEWER_DASHBOARD_TEXT = {
    title: 'Reviewer Dashboard',
    subtitle: 'Track question review volume and approval outcomes.',
    errorTitle: 'Unable to load reviewer dashboard.',
    errorDescription: 'Please refresh the page or try again later.',
    mockAlert: 'Showing mock reviewer dashboard data until backend metrics are available.',
};

export const DEFAULT_REVIEWER_SUMMARY: ReviewerDashboardSummary = {
    totalQuestions: 0,
    approvedQuestions: 0,
    rejectedQuestions: 0,
    pendingQuestions: 0,
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
        id: 'pendingQuestions',
        title: 'Pending Questions',
        description: 'Questions waiting for review',
        tone: 'purple',
        Icon: AnalyticsIcon,
        getValue: (summary: ReviewerDashboardSummary) => summary.pendingQuestions,
    },
] as const;
