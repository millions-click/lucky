import { useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { BN } from '@coral-xyz/anchor';

import { useCluster, useStoreProgram, useTransactionToast } from '@/hooks';

export function useStoreSell({ mint }: { mint: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, stores } = useStoreProgram();

  const store = useMemo(
    () => mint && stores.data?.find(({ account }) => account.mint.equals(mint)),
    [stores.data, mint]
  );

  const sell = useMutation({
    mutationKey: ['store', 'sell', { cluster, store: store?.publicKey }],
    mutationFn: async ({
      amount,
      targetAccount,
    }: {
      amount: BN;
      targetAccount: PublicKey;
    }) => {
      if (!store) throw new Error('Store not found');

      return program.methods
        .sell(amount)
        .accounts({ store: store.publicKey, targetAccount })
        .rpc();
    },
    onSuccess: (tx) => transactionToast(tx),
  });

  return {
    store,
    sell,
  };
}
