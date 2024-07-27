'use client';

import { type PropsWithChildren, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const ReactQueryDevtoolsProduction = dynamic(
  () =>
    import('@tanstack/react-query-devtools/build/modern/production.js').then(
      (d) => ({
        default: d.ReactQueryDevtools,
      })
    ),
  { ssr: false }
);

export function ReactQueryProvider({ children }: PropsWithChildren) {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // @ts-expect-error - global
    window.toggleDevtools = () => setShowDevtools((current) => !current);
  }, []);

  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          networkMode: 'offlineFirst',
          staleTime: Infinity,
          gcTime: 60 * 60 * 8 * 1000,
          retryDelay: (failureCount) =>
            Math.min(2000 * 2 ** failureCount, 30000),
          retry: (failureCount, error) => {
            if ('status' in error && error.status === 404) return false;
            return failureCount < 6;
          },
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        {children}

        <div className="fixed left-2 top-1/4">
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
          {showDevtools && (
            <Suspense fallback={null}>
              <ReactQueryDevtoolsProduction buttonPosition="relative" />
            </Suspense>
          )}
        </div>
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
