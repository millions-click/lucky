import { PropsWithChildren } from 'react';

import { ReactQueryProvider } from './react-query-provider';
import { SolanaProvider } from './solana-provider';
import { DataFeedProvider } from './data-feed';
import { PlayerProvider } from './player';
import { GemsProvider, TradersProvider } from './escrow';

import { ClusterProvider } from '@/components/cluster/cluster-data-access';

export function LuckyBagProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>
          <DataFeedProvider>
            <GemsProvider>
              <TradersProvider>
                <PlayerProvider>{children}</PlayerProvider>
              </TradersProvider>
            </GemsProvider>
          </DataFeedProvider>
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}
