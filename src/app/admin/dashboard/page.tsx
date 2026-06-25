import type { Metadata } from 'next';

import { DashboardPage } from '@/features/dashboardManagement';

export const metadata: Metadata = {
    title: 'Dashboard | Lat Portal',
};

const Page = () => <DashboardPage />;

export default Page;
