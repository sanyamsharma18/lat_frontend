import AnalyticsIcon from '@/assets/svg/sidebar-icon/analytics-icon.svg';
import DashboardIcon from '@/assets/svg/sidebar-icon/dashboard-icon.svg';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'REVIEWER';

export interface MenuItem {
    menuId: number;
    menuName: string;
    path: string;
    icon?: React.ReactNode;
}

export const ADMIN_MENU: MenuItem[] = [
    {
        menuId: 1,
        menuName: 'Dashboard',
        path: '/admin/dashboard',
        icon: <DashboardIcon />,
    },
    {
        menuId: 3,
        menuName: 'Teacher Management',
        path: '/admin/teachers',
        icon: <AnalyticsIcon />,
    },
    {
        menuId: 4,
        menuName: 'Question Generator',
        path: '/admin/questions',
        icon: <AnalyticsIcon />,
    },
    {
        menuId: 5,
        menuName: 'Reviewer Management',
        path: '/admin/reviewers',
        icon: <AnalyticsIcon />,
    },
    {
        menuId: 6,
        menuName: 'Reports',
        path: '/admin/reports',
        icon: <AnalyticsIcon />,
    },
];

export const TEACHER_MENU: MenuItem[] = [
    {
        menuId: 1,
        menuName: 'Dashboard',
        path: '/teacher/dashboard',
        icon: <DashboardIcon />,
    },
    {
        menuId: 2,
        menuName: 'Student Management',
        path: '/teacher/students',
        icon: <AnalyticsIcon />,
    },
];

export const REVIEWER_MENU: MenuItem[] = [
    {
        menuId: 1,
        menuName: 'Dashboard',
        path: '/reviewer/dashboard',
        icon: <DashboardIcon />,
    },
    {
        menuId: 2,
        menuName: 'Question Management',
        path: '/reviewer/questions',
        icon: <AnalyticsIcon />,
    },
];

export const getSidebarMenuByRole = (userRole?: UserRole | '') => {
    switch (userRole) {
        case 'ADMIN':
            return ADMIN_MENU;
        case 'TEACHER':
            return TEACHER_MENU;
        case 'REVIEWER':
            return REVIEWER_MENU;
        default:
            return [];
    }
};

export const SIDEBAR_CONTENT = {
    companyName: 'Lat Portal',
    signOutText: 'Sign out',
};
