import { queryOptions } from '@tanstack/react-query';
import { type Cluster, PublicKey } from '@solana/web3.js';

import type { Portal } from '@/providers/types.d';
import { getPlayerPDA } from '@luckyland/anchor';

export function getPlayerGameAccountOptions(
  owner: PublicKey | null,
  mode: PublicKey | null,
  portal: Portal,
  cluster: Cluster
) {
  const pda = owner && mode && getPlayerPDA(owner, mode, cluster);

  return queryOptions({
    queryKey: ['player', { cluster, pda }],
    queryFn: async () => {
      if (!pda) throw new Error('Player PDA not found');

      const player = await portal.account.player.fetch(pda);
      return { player, pda };
    },
    enabled: Boolean(pda),
  });
}
