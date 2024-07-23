import { PropsWithChildren } from 'react';

import { LuckyBagsProvider } from './bags';

import {
  DataFeedProvider,
  PlayerProvider,
  ReactQueryProvider,
  SolanaProvider,
} from '@/providers';

import { ClusterProvider } from '@/components/cluster/cluster-data-access';

export function LuckyBagProvider({ children }: PropsWithChildren) {
  return (
    <LuckyBagsProvider>
      <ReactQueryProvider>
        <ClusterProvider>
          <SolanaProvider>
            <DataFeedProvider>
              <PlayerProvider>{children}</PlayerProvider>
            </DataFeedProvider>
          </SolanaProvider>
        </ClusterProvider>
      </ReactQueryProvider>
    </LuckyBagsProvider>
  );
}

export * from './bags';
