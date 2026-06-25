import type { Metadata } from 'next';

import { TeacherManagementPage } from '@/features/teacherManagement';

export const metadata: Metadata = {
    title: 'Teacher Management | Lat Portal',
};

const Page = () => <TeacherManagementPage />;

export default Page;
