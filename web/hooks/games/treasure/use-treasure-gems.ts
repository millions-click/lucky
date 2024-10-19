import { useMemo } from 'react';
import { Cluster, PublicKey } from '@solana/web3.js';

import { getKeeperPDA } from '@luckyland/anchor';
import { useCluster, useOwnedTokens } from '@/hooks';

export function useTreasureGems() {
  const { cluster } = useCluster();
  const keeperPDA = useMemo(
    () => getKeeperPDA(cluster.network as Cluster),
    [cluster]
  );
  const { tokens: gems, mints, ..._ } = useOwnedTokens(keeperPDA);

  return {
    owner: keeperPDA,
    gems,
    mints,
    getGem: (mint: PublicKey) => mints[mint.toString()],
    ..._,
  };
}
