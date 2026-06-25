import { StaleAndCacheTime } from '@/constants/appConstants';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2, // Automatically retry failed queries
            staleTime: StaleAndCacheTime.STALE_TIME, // Data is considered fresh for 5 minutes
            gcTime: StaleAndCacheTime.CACHE_TIME, // Inactive data is cached for 10 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        },
    },
});
