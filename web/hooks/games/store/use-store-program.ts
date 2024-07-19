'use client';

import { useMemo } from 'react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { getGamesProgram, getGamesProgramId } from '@luckyland/anchor';

import { useCluster, useTransactionToast } from '@/hooks';
import { useAnchorProvider, useDataFeed } from '@/providers';

export function useStoreProgram() {
  const { feed } = useDataFeed();
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getGamesProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getGamesProgram(provider);

  const stores = useQuery({
    queryKey: ['store', 'all', { cluster }],
    queryFn: () => program.account.store.all(),
  });

  const authority = useQuery({
    queryKey: ['treasure', 'authority', { cluster }],
    queryFn: async () => {
      const [treasure] = await program.account.treasure.all();
      return treasure.account.authority;
    },
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['store', 'initialize', { cluster }],
    mutationFn: ({
      tokenMint,
      price,
    }: {
      tokenMint: PublicKey;
      price: bigint;
    }) =>
      program.methods
        .launchStore({ price: new BN(price.toString()) })
        .accounts({ trader: tokenMint, feed })
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return stores.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    stores,
    getProgramAccount,
    initialize,
    authority,
  };
}
