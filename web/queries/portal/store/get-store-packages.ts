import { queryOptions } from '@tanstack/react-query';
import { type Cluster, PublicKey } from '@solana/web3.js';

import type { Portal } from '@/providers/types.d';

export function getStorePackagesOptions(
  store: PublicKey | null,
  portal: Portal,
  cluster: Cluster
) {
  return queryOptions({
    queryKey: ['store-packages', { cluster, store }],
    queryFn: async () => {
      // TODO: Find a way to filter only the packages for the active store.
      return portal.account.storePackage.all();
    },
    enabled: Boolean(store),
  });
}
