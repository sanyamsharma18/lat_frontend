import type { Metadata } from 'next';

import { SpaceMissionGamePage } from '@/features/studentPortal';

export const metadata: Metadata = {
    title: 'Space Mission | Lat Portal',
};

const Page = () => <SpaceMissionGamePage />;

export default Page;
