import type { Metadata } from 'next';

import { StudentManagementPage } from '@/features/teacherPortal';

export const metadata: Metadata = {
    title: 'Student Management | Lat Portal',
};

const Page = () => <StudentManagementPage />;

export default Page;
