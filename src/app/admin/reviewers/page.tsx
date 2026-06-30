import { Metadata } from 'next';

import ReviewerManagementPage from '@/features/reviewerManagement';

export const metadata: Metadata = {
    title: 'Reviewer Management | Lat Portal',
};

const AdminReviewersPage = () => <ReviewerManagementPage />;

export default AdminReviewersPage;
