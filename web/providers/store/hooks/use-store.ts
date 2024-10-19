import { useCallback, useMemo } from 'react';
import { type Cluster } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { useDataFeed, usePortal, useTraders } from '@/providers';
import {
  fromBigInt,
  fromBN,
  getStorePackagePDA,
  toBigInt,
} from '@luckyland/anchor';
import { getStoreOptions, getStorePackagesOptions } from '@/queries';
import type { StorePackage } from '@/providers/types.d';

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

  const packagesQuery = useQuery(
    getStorePackagesOptions(pda, portal, cluster.network as Cluster)
  );
  const packages = useMemo(
    () => packagesQuery.data || [],
    [packagesQuery.data]
  );

  const getPackage = useCallback(
    (amount: number) => {
      if (!trader || !pda || !packages.length) return null;

      const pkgPDA = getStorePackagePDA(
        pda,
        toBigInt(amount, trader?.decimals).toString(),
        cluster.network as Cluster
      );

      return packages.find(({ publicKey }) => publicKey.equals(pkgPDA));
    },
    [packages]
  );

  const getPrice = useCallback(
    (pkg: StorePackage, scaled?: boolean) => {
      if (!store || !answer || !trader) return null;

      const price = computePrice(
        fromBN(pkg.amount, trader.decimals),
        fromBN(pkg.max - pkg.sales > 0 ? pkg.price : store.price, decimals),
        fromBigInt(BigInt(answer), decimals)
      );

      return scaled ? fromBigInt(price, SOL_DECIMALS) : price;
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
    packages,

    getPrice,
    getPackage,
  };
}
