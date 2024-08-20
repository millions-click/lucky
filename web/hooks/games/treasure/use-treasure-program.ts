'use client';

import { useMemo } from 'react';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { getKeeperPDA, getTreasurePDA } from '@luckyland/anchor';

import { useGamesProgram, useTransactionToast } from '@/hooks';
import { useCluster } from '@/providers';

export function useTreasureProgram({
  callback,
}: { callback?: () => void } = {}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, programId, getProgramAccount } = useGamesProgram();

  const keeperPDA = useMemo(
    () => getKeeperPDA(cluster.network as Cluster),
    [cluster.network]
  );

  const treasure = useQuery({
    queryKey: ['treasure', 'account', { cluster }],
    queryFn: () =>
      program.account.treasure.fetch(
        getTreasurePDA(cluster.network as Cluster)
      ),
  });

  const initialize = useMutation({
    mutationKey: ['vault', 'initialize', { cluster }],
    mutationFn: (mint: PublicKey) =>
      program.methods.forgeStronghold().accounts({ gem: mint }).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      callback && callback();
    },
    onError: () => toast.error('Failed to run program'),
  });

  const deposit = useMutation({
    mutationKey: ['vault', 'deposit', { cluster }],
    mutationFn: async ({
      mint,
      amount,
      sender,
    }: {
      mint: PublicKey;
      amount: bigint;
      sender: PublicKey;
    }) => {
      const reserve = await getAssociatedTokenAddress(mint, sender);

      return program.methods
        .stockpileGems(new BN(amount.toString()))
        .accounts({ gem: mint, reserve })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      callback && callback();
    },
    onError: () => toast.error('Failed to deposit on vault'),
  });

  const withdraw = useMutation({
    mutationKey: ['vault', 'withdraw', { cluster }],
    mutationFn: async ({
      mint,
      amount,
      sender,
      isReserve,
    }: {
      mint: PublicKey;
      amount: bigint;
      sender: PublicKey;
      isReserve?: boolean;
    }) => {
      const reserve = isReserve
        ? sender
        : await getAssociatedTokenAddress(mint, sender);

      return program.methods
        .retrieveGems(new BN(amount.toString()))
        .accounts({ gem: mint, reserve })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      callback && callback();
    },
    onError: () => toast.error('Failed to withdraw from vault'),
  });

  return {
    program,
    programId,
    getProgramAccount,
    keeperPDA,
    treasure,
    initialize,
    deposit,
    withdraw,
  };
}
