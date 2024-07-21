import { useCallback, useMemo } from 'react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BN } from '@coral-xyz/anchor';

import { useCluster, useStoreProgram, useTransactionToast } from '@/hooks';
import { CHAINLINK_STORE_PROGRAM_ID } from '@chainlink/solana-sdk';
import toast from 'react-hot-toast';
import { fromBigInt, fromBN, getStorePDA, toBigInt } from '@luckyland/anchor';
import { Token } from '@utils/token';
import { useDataFeed } from '@/providers';

const SOL_DECIMALS = 9;

function computePrice(
  amount: number,
  price: number,
  rate: number,
  decimals = SOL_DECIMALS
) {
  return toBigInt((amount * price) / rate, decimals);
}

export function useStoreSell({ trader }: { trader: Token }) {
  const { feed, decimals, answer } = useDataFeed();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useStoreProgram();
  const pda = useMemo(
    () =>
      trader &&
      feed &&
      getStorePDA(trader.mint, feed, cluster.network as Cluster),
    [trader.mint, feed, cluster.network]
  );

  const storeQuery = useQuery({
    queryKey: ['store', { cluster, trader: trader.mint, feed }],
    queryFn: () => program.account.store.fetch(pda),
  });

  const store = useMemo(() => storeQuery.data, [storeQuery.data]);

  const sell = useMutation({
    mutationKey: ['store', 'sell', { cluster, store: pda }],
    mutationFn: async ({
      amount,
      receiver,
    }: {
      amount: BN;
      receiver: PublicKey;
    }) => {
      if (!store) throw new Error('Store not found');

      return program.methods
        .storeSale(amount)
        .accounts({
          feed,
          chainlinkProgram: CHAINLINK_STORE_PROGRAM_ID,
          trader: trader.mint,
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

  const price = useCallback(
    (amount: number) => {
      if (!store) return null;
      console.log('useStoreSell:price=>answer', answer);
      return computePrice(
        amount,
        fromBN(store.price, decimals),
        fromBigInt(BigInt(answer), decimals)
      );
    },
    [store, answer]
  );

  return {
    store,
    sell,
    price,
  };
}
