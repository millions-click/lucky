import { useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { BN } from '@coral-xyz/anchor';

import { useCluster, useStoreProgram, useTransactionToast } from '@/hooks';
import { CHAINLINK_STORE_PROGRAM_ID } from '@chainlink/solana-sdk';
import toast from 'react-hot-toast';

export function useStoreSell({ trader }: { trader: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, stores } = useStoreProgram();

  const store = useMemo(
    () =>
      trader &&
      stores.data?.find(({ account }) => account.trader.equals(trader)),
    [stores.data, trader]
  );

  const sell = useMutation({
    mutationKey: ['store', 'sell', { cluster, store: store?.publicKey }],
    mutationFn: async ({
      amount,
      receiver,
    }: {
      amount: BN;
      receiver: PublicKey;
    }) => {
      if (!store) throw new Error('Store not found');
      const { feed } = store.account;

      return program.methods
        .storeSale(amount)
        .accounts({
          feed,
          chainlinkProgram: CHAINLINK_STORE_PROGRAM_ID,
          trader,
          receiver,
        })
        .rpc();
    },
    onSuccess: (tx) => transactionToast(tx),
    onError: (error) => {
      console.log('useStoreSell', error);
      toast.error(error.message);
    },
  });

  return {
    store,
    sell,
  };
}
