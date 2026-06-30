import type { Metadata } from 'next';

import { ReviewerQuestionManagementPage } from '@/features/reviewerPortal';

export const metadata: Metadata = {
    title: 'Question Management | Lat Portal',
};

const Page = () => <ReviewerQuestionManagementPage />;

export default Page;
