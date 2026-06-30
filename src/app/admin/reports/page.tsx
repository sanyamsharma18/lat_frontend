import type { Metadata } from 'next';

import { ReportPage } from '@/features/reportManagement';

export const metadata: Metadata = {
    title: 'Reports | Lat Portal',
};

const Page = () => <ReportPage />;

export default Page;
