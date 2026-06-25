import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './react-query-client';

interface ReactQueryClientProviderProps {
    children: React.ReactNode;
}

export const ReactQueryClientProvider = ({ children }: ReactQueryClientProviderProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
