import { Cluster } from '@solana/web3.js';
import { queryOptions } from '@tanstack/react-query';

import { getAvgTxFee } from '@constants';

export function getAvgTxFeeOptions(cluster: Cluster) {
  return queryOptions({
    queryKey: ['get-avg-tx-fee', { cluster }],
    queryFn: () => getAvgTxFee(1, cluster),
  });
}
