import type { Metadata } from 'next';

import { StudentDashboardPage } from '@/features/studentPortal';

export const metadata: Metadata = {
    title: 'Student Dashboard | Lat Portal',
};

const Page = () => <StudentDashboardPage />;

export default Page;
