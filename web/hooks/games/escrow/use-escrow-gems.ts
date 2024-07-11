import { useMemo } from 'react';
import { Cluster, PublicKey } from '@solana/web3.js';

import { getEscrowPDA } from '@luckyland/anchor';
import { useCluster, useOwnedTokens } from '@/hooks';

export function useEscrowGems() {
  const { cluster } = useCluster();
  const escrowPDA = useMemo(
    () => getEscrowPDA(cluster.network as Cluster),
    [cluster]
  );
  const { tokens: gems, mints, ..._ } = useOwnedTokens(escrowPDA);

  return {
    owner: escrowPDA,
    gems,
    mints,
    getGem: (mint: PublicKey) => mints[mint.toString()],
    ..._,
  };
}
