import AnalyticsIcon from '@/assets/svg/sidebar-icon/analytics-icon.svg';
import CategoryIcon from '@/assets/svg/sidebar-icon/category-icon.svg';
import DashboardIcon from '@/assets/svg/sidebar-icon/dashboard-icon.svg';

import { DashboardSummary } from '@/types/dashboard';

export const DASHBOARD_TEXT = {
    title: 'Reports & Analytics',
    subtitle: 'Summary view of teachers, students, and question activity.',
    downloadReportButton: 'Download Report',
    volumeChartTitle: 'Platform Volume',
    volumeChartSubtitle: 'Teachers, students, and generated questions.',
    errorTitle: 'Dashboard data is temporarily unavailable',
    errorDescription: 'Showing temporary summary data so reporting remains usable.',
    mockAlert: 'Backend dashboard data is unavailable. Showing temporary summary data.',
};

export const DASHBOARD_METRICS = [
    {
        id: 'totalTeachers',
        title: 'Total Teachers',
        description: 'Active teachers in platform',
        tone: 'blue',
        Icon: AnalyticsIcon,
        getValue: (summary: DashboardSummary) => summary.totalTeachers,
    },
    {
        id: 'totalStudents',
        title: 'Total Students',
        description: 'Registered students',
        tone: 'green',
        Icon: DashboardIcon,
        getValue: (summary: DashboardSummary) => summary.totalStudents,
    },
    {
        id: 'totalQuestionsGenerated',
        title: 'Questions Generated',
        description: 'Questions created in system',
        tone: 'orange',
        Icon: CategoryIcon,
        getValue: (summary: DashboardSummary) => summary.totalQuestionsGenerated,
    },
] as const;

export const DEFAULT_SUMMARY = {
    totalTeachers: 0,
    totalStudents: 0,
    totalQuestionsGenerated: 0,
    totalQuestionsAttemptedLastYear: 0,
    isMock: false,
};
