import { useCallback, useMemo } from 'react';
import { type Cluster } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { useDataFeed, usePortal, useTraders } from '@/providers';
import { fromBigInt, fromBN, toBigInt } from '@luckyland/anchor';
import { getStoreOptions } from '@/queries';

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
    (amount: number) => {
      if (!store) return null;
      return computePrice(
        amount,
        fromBN(store.price, decimals),
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
