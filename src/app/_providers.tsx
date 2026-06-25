'use client';

import { ReactNode } from 'react';

import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/utils/react-query-client';


interface ProvidersProps {
    children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => (
    <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={null}>{children}</HydrationBoundary>
    </QueryClientProvider>
);

export default Providers;