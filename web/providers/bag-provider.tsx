import { PropsWithChildren } from 'react';

import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/providers/solana-provider';
import { DataFeedProvider } from '@/providers/data-feed';

export function LuckyBagProvider({ children }: PropsWithChildren) {
  return (
    <ClusterProvider>
      <SolanaProvider>
        <DataFeedProvider>{children}</DataFeedProvider>
      </SolanaProvider>
    </ClusterProvider>
  );
}
