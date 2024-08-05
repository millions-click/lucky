'use client';

import { type Cluster, PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CHAINLINK_STORE_PROGRAM_ID } from '@chainlink/solana-sdk';
import { BN } from '@coral-xyz/anchor';
import toast from 'react-hot-toast';

import { useCluster, useStore } from '@/providers';
import {
  getBalanceOptions,
  getStorePackagesOptions,
  getTokenAccountsOptions,
} from '@/queries';
import { useCallback, useMemo } from 'react';
import { getStorePackagePDA, toBigInt } from '@luckyland/anchor';

export function useStoreSell() {
  const { cluster } = useCluster();
  const { connection } = useConnection();
  const { portal, store, pda, trader, getPrice } = useStore();

  const client = useQueryClient();

  const packagesQuery = useQuery(
    getStorePackagesOptions(pda, portal, cluster.network as Cluster)
  );
  const packages = useMemo(
    () => packagesQuery.data || [],
    [packagesQuery.data]
  );

  const sell = useMutation({
    mutationKey: ['store', 'sell', { cluster, store: pda }],
    mutationFn: async ({
      amount,
      receiver,
      owner,
    }: {
      amount: BN;
      receiver: PublicKey;
      owner: PublicKey;
    }) => {
      if (!store) throw new Error('Store not found');
      const { feed, trader } = store;

      const signature = await portal.methods
        .storeSale(amount.toString())
        .accounts({
          feed,
          trader,
          receiver,
          chainlinkProgram: CHAINLINK_STORE_PROGRAM_ID,
        })
        .rpc();

      return { tx: signature, owner, receiver };
    },
    onSuccess: ({ tx, owner }) => {
      const keys = [
        getTokenAccountsOptions(owner, connection).queryKey,
        getBalanceOptions(owner, connection).queryKey,
        getStorePackagesOptions(pda, portal, cluster.network as Cluster)
          .queryKey,
      ];

      return Promise.all(
        keys.map((queryKey) => client.invalidateQueries({ queryKey }))
      );
    },
    onError: (error) => {
      console.log('useStoreSell', error);
      toast.error(error.message);
    },
  });

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

  return {
    pda,
    store,
    packages,

    sell,
    getPrice: useCallback(
      (amount: number) => {
        const pkg = getPackage(amount);
        if (!pkg) return null;
        return getPrice(pkg.account);
      },
      [getPackage, getPrice]
    ),
    getPackage,
  };
}
