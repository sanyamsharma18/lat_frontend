import ActivityIcon from '@/assets/svg/activity-board.svg';
import AnalyticsIcon from '@/assets/svg/sidebar-icon/analytics-icon.svg';
import CategoryIcon from '@/assets/svg/sidebar-icon/category-icon.svg';
import DashboardIcon from '@/assets/svg/sidebar-icon/dashboard-icon.svg';

import { TeacherDashboardSummary } from '@/types/student';

export const TEACHER_DASHBOARD_TEXT = {
    title: 'Teacher Dashboard',
    subtitle: 'Summary view of your students and question attempts.',
    mockAlert: 'Backend teacher dashboard data is unavailable. Showing temporary summary data.',
};

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
    {
        id: 'totalQuestionsAttempted',
        title: 'Questions Attempted',
        description: 'Total attempts by students',
        tone: 'purple',
        Icon: ActivityIcon,
        getValue: (summary: TeacherDashboardSummary) => summary.totalQuestionsAttempted,
    },
] as const;
