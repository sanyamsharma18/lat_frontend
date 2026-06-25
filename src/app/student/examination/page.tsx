import type { Metadata } from 'next';

import { StudentExaminationPage } from '@/features/studentPortal';

export const metadata: Metadata = {
    title: 'Student Examination | Lat Portal',
};

const Page = () => <StudentExaminationPage />;

export default Page;
