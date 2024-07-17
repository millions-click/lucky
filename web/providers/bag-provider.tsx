import { PropsWithChildren } from 'react';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/providers/solana-provider';

export function LuckyBagProvider({ children }: PropsWithChildren) {
  return (
    <ClusterProvider>
      <SolanaProvider>{children}</SolanaProvider>
    </ClusterProvider>
  );
}
