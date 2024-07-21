import { PropsWithChildren } from 'react';

import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/providers/solana-provider';
import { DataFeedProvider } from '@/providers/data-feed';
import { ReactQueryProvider } from '@/providers/react-query-provider';

export function LuckyBagProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>
          <DataFeedProvider>{children}</DataFeedProvider>
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}
