import type { Metadata } from 'next';

import { TeacherDashboardPage } from '@/features/teacherPortal';

export const metadata: Metadata = {
    title: 'Teacher Dashboard | Lat Portal',
};

const Page = () => <TeacherDashboardPage />;

export default Page;
