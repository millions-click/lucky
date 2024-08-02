import { queryOptions } from '@tanstack/react-query';
import { type Cluster, PublicKey } from '@solana/web3.js';

import type { Portal } from '@/providers/types.d';
import { getBountyPDA } from '@luckyland/anchor';

export function getBountyOptions(
  mode: PublicKey | null,
  gem: PublicKey | null | undefined,
  trader: PublicKey | null | undefined,
  portal: Portal,
  cluster: Cluster
) {
  const pda = mode && gem && trader && getBountyPDA(mode, gem, trader, cluster);
  return queryOptions({
    queryKey: ['bounty', { cluster, pda }],
    queryFn: async () => {
      if (!pda) throw new Error('Invalid bounty');
      const bounty = await portal.account.bounty.fetch(pda);
      return { bounty, pda };
    },
    enabled: Boolean(pda),
  });
}
