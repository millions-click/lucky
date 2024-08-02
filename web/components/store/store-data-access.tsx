'use client';

import { useMemo } from 'react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { getCollectorPDA } from '@luckyland/anchor';

import { useCluster } from '../cluster/cluster-data-access';
import { useTransactionToast } from '../ui/ui-layout';
import {
  useGetTokenAccount,
  useOwnedToken,
  usePlayer,
  useStoreBalance,
  useStoreProgram,
} from '@/hooks';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useDataFeed } from '@/providers';
import { CHAINLINK_STORE_PROGRAM_ID } from '@chainlink/solana-sdk';

export function useStoreProgramAccount({
  storePda,
  callback,
}: {
  storePda: PublicKey;
  callback?: () => void;
}) {
  const { feed } = useDataFeed();
  const { owner } = usePlayer();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, authority } = useStoreProgram();

  // ------------------- queries ----------------------
  const storeQuery = useQuery({
    queryKey: ['store', 'fetch', { cluster, storePda }],
    queryFn: () => program.account.store.fetch(storePda),
  });

  const vaultPDA = useMemo(
    () =>
      storeQuery.data &&
      getCollectorPDA(storeQuery.data.trader, cluster.network as Cluster),
    [storeQuery.data, cluster]
  );

  const vaultQuery = useGetTokenAccount({ address: vaultPDA });

  const tokenQuery = useOwnedToken(owner, vaultQuery.data?.mint);

  const balanceQuery = useStoreBalance(storePda);

  // ------------------- computed ---------------------
  const isOwner = useMemo(
    () => authority.data?.equals(owner),
    [owner, authority.data]
  );

  // ------------------- mutations -------------------
  const deposit = useMutation({
    mutationKey: ['store', 'deposit', { cluster, storePda }],
    mutationFn: async (amount: bigint) => {
      if (!vaultQuery.data) throw new Error('Vault not initialized');

      const trader = vaultQuery.data.mint;
      const reserve = await getAssociatedTokenAddress(trader, owner);

      return program.methods
        .storeFill(new BN(amount.toString()))
        .accounts({ reserve, trader })
        .rpc();
    },
    onSuccess: (signature) => {
      callback?.();
      transactionToast(signature);
      return Promise.all([vaultQuery.refetch(), tokenQuery.refresh()]).then(
        () => callback?.()
      );
    },
    onError: () => toast.error('Failed to deposit on vault'),
  });

  const update = useMutation({
    mutationKey: ['store', 'set', { cluster, storePda }],
    mutationFn: (price: BN) => {
      if (!storeQuery.data?.trader) throw new Error('Store not initialized');

      const trader = storeQuery.data.trader;
      return program.methods
        .launchStore({ price })
        .accounts({ feed, trader })
        .rpc();
    },
    onSuccess: (tx) => {
      callback?.();
      transactionToast(tx);
      return storeQuery.refetch().then(() => callback?.());
    },
  });

  const sell = useMutation({
    mutationKey: ['store', 'sell', { cluster, storePda }],
    mutationFn: async (amount: bigint) => {
      if (!vaultQuery.data) throw new Error('Vault not initialized');

      const trader = vaultQuery.data.mint;
      const receiver = await getAssociatedTokenAddress(trader, owner);

      return program.methods
        .storeSale(new BN(amount.toString()))
        .accounts({
          feed,
          chainlinkProgram: CHAINLINK_STORE_PROGRAM_ID,
          trader,
          receiver,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      callback?.();
      transactionToast(tx);
      return Promise.all([
        vaultQuery.refetch(),
        tokenQuery.refresh(),
        balanceQuery.refetch(),
      ]).then(() => callback?.());
    },
  });

  const withdraw = useMutation({
    mutationKey: ['store', 'withdraw', { cluster, storePda }],
    mutationFn: async (amount: BN) => {
      return program.methods
        .storeWithdraw(amount)
        .accounts({ store: storePda })
        .rpc();
    },
    onSuccess: (tx) => {
      callback?.();
      transactionToast(tx);
      return balanceQuery.refetch().then(() => callback?.());
    },
  });

  // ------------------- return ---------------------
  return {
    storeQuery,
    vaultQuery,
    balanceQuery,
    tokenQuery,

    vaultPDA,
    token: tokenQuery.token,
    isOwner,

    deposit,
    update,
    sell,
    withdraw,
  };
}
