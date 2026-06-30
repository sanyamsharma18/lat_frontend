import type { Metadata } from 'next';

import { ReviewerDashboardPage } from '@/features/reviewerPortal';

export const metadata: Metadata = {
    title: 'Reviewer Dashboard | Lat Portal',
};

const Page = () => <ReviewerDashboardPage />;

export default Page;
