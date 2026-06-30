import AnalyticsIcon from '@/assets/svg/sidebar-icon/analytics-icon.svg';
import CategoryIcon from '@/assets/svg/sidebar-icon/category-icon.svg';
import DashboardIcon from '@/assets/svg/sidebar-icon/dashboard-icon.svg';

import { TeacherDashboardSummary } from '@/types/student';

export const TEACHER_DASHBOARD_TEXT = {
    title: 'Teacher Dashboard',
    subtitle: 'Summary view of your students and question attempts.',
    activityChartTitle: 'Student Overview',
    activityChartSubtitle: 'Total, active, and inactive students.',
    mockAlert: 'Backend teacher dashboard data is unavailable. Showing temporary summary data.',
};

export const TEACHER_ACTIVITY_CHART_LABELS = ['Total', 'Active', 'Inactive'] as const;

export const TEACHER_ACTIVITY_CHART_COLORS = [
    'rgba(255, 99, 132, 0.22)',
    'rgba(75, 192, 192, 0.24)',
    'rgba(255, 205, 86, 0.24)',
] as const;

export const TEACHER_ACTIVITY_CHART_BORDERS = [
    '#ff6384',
    '#4bc0c0',
    '#ffcd56',
] as const;

export const TEACHER_DASHBOARD_METRICS = [
    {
        id: 'totalStudents',
        title: 'Total Students',
        description: 'Students assigned to you',
        tone: 'blue',
        Icon: DashboardIcon,
        getValue: (summary: TeacherDashboardSummary) => summary.totalStudents,
    },
    {
        id: 'activeStudents',
        title: 'Active Students',
        description: 'Students currently active',
        tone: 'green',
        Icon: AnalyticsIcon,
        getValue: (summary: TeacherDashboardSummary) => summary.activeStudents,
    },
    {
        id: 'inactiveStudents',
        title: 'Inactive Students',
        description: 'Students currently inactive',
        tone: 'orange',
        Icon: CategoryIcon,
        getValue: (summary: TeacherDashboardSummary) => summary.inactiveStudents,
    },
] as const;
