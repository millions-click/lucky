import { queryOptions } from '@tanstack/react-query';
import { type Cluster, PublicKey } from '@solana/web3.js';

import type { Portal } from '@/providers/types.d';
import { getGameModePDA } from '@luckyland/anchor';

export function getGameModeOptions(
  game: PublicKey | null | undefined,
  seed: string,
  portal: Portal,
  cluster: Cluster
) {
  const pda = game && getGameModePDA(game, seed, cluster);

  return queryOptions({
    queryKey: ['game-mode', { cluster, pda }],
    queryFn: async () => {
      if (!pda) throw new Error('Game mode not found'); // This should be a 404 error
      const mode = await portal.account.gameMode.fetchNullable(pda);
      return { mode, pda };
    },
    enabled: Boolean(pda),
  });
}
