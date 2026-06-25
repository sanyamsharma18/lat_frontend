'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { teacherDashboardQueryOptions } from '../components/TeacherDashboardPage/utils';

export const useTeacherDashboard = () => {
    const teacherDashboardQuery = useQuery(queryOptions(teacherDashboardQueryOptions()));

    return {
        teacherDashboardQuery,
    };
};
