import { useCallback, useMemo } from 'react';
import { type Cluster } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { useDataFeed, usePortal, useTraders } from '@/providers';
import { fromBigInt, fromBN, toBigInt } from '@luckyland/anchor';
import { getStoreOptions } from '@/queries';
import type { StorePackage } from '@/providers/portal/portal';

const SOL_DECIMALS = 9;

function computePrice(
  amount: number,
  price: number,
  rate: number,
  decimals = SOL_DECIMALS
) {
  return toBigInt((amount * price) / rate, decimals);
}

export function useStore() {
  const { trader } = useTraders();
  const { feed, decimals, answer } = useDataFeed();
  const { portal, cluster } = usePortal();
  const storeQuery = useQuery(
    getStoreOptions(portal, cluster.network as Cluster, trader?.mint, feed)
  );

  const { store, pda } = useMemo(
    () => storeQuery.data || { store: null, pda: null },
    [storeQuery.data]
  );

  const getPrice = useCallback(
    (pkg: StorePackage) => {
      if (!store || !answer || !trader) return null;

      return computePrice(
        fromBN(pkg.amount, trader.decimals),
        fromBN(pkg.max - pkg.sales > 0 ? pkg.price : store.price, decimals),
        fromBigInt(BigInt(answer), decimals)
      );
    },
    [store, answer]
  );

  return {
    portal,
    cluster,
    storeQuery,

    pda,
    store,

    feed,
    trader,

    getPrice,
  };
}
