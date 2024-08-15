import { queryOptions } from '@tanstack/react-query';
import { type Cluster, PublicKey } from '@solana/web3.js';

import { getStorePDA } from '@luckyland/anchor';
import type { Portal } from '@/providers/types.d';

export function getStoreOptions(
  portal: Portal,
  cluster: Cluster,
  trader?: PublicKey | null,
  feed?: PublicKey | null
) {
  const pda = trader && feed && getStorePDA(trader, feed, cluster);

  return queryOptions({
    queryKey: ['store', { cluster, trader, feed }],
    queryFn: async () => {
      if (!pda) throw new Error('Invalid PDA'); // This should never happen.

      const store = await portal.account.store.fetch(pda);
      return { store, pda };
    },
    enabled: Boolean(pda),
  });
}
