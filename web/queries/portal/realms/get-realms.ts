import { queryOptions } from '@tanstack/react-query';
import { type Cluster } from '@solana/web3.js';

import type { Portal } from '@/providers/types.d';

export function getRealmsOptions(portal: Portal, cluster: Cluster) {
  return queryOptions({
    queryKey: ['realms', { cluster }],
    queryFn: () => portal.account.game.all(),
  });
}
