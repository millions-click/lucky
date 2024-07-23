import { PropsWithChildren } from 'react';

import { CryptoProvider } from './crypto-provider';
import { LuckyBagsProvider } from './lucky-bags-provider';
import { ReactQueryProvider } from './react-query-provider';
import { SolanaProvider } from './solana-provider';
import { DataFeedProvider } from './data-feed';
import { PlayerProvider } from './player';
import { GemsProvider, TradersProvider } from './escrow';

import { ClusterProvider } from '@/components/cluster/cluster-data-access';

export function LuckyBagProvider({ children }: PropsWithChildren) {
  return (
    <CryptoProvider>
      <LuckyBagsProvider>
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
      </LuckyBagsProvider>
    </CryptoProvider>
  );
}
