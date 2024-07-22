import { PublicKey } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import toast from 'react-hot-toast';

import { useTransactionToast } from '@/components/ui/ui-layout';
import { buildTransaction } from '@/utils';
import { getBalanceOptions, getTokenAccountsOptions } from '@/queries';

export function useCreateTokenAccount(owner: PublicKey | null) {
  const client = useQueryClient();
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const transactionToast = useTransactionToast();

  return useMutation({
    mutationKey: [
      'create-token-account',
      { owner, connection: connection.rpcEndpoint },
    ],
    mutationFn: async (mint: PublicKey) => {
      if (!wallet?.adapter || !owner) throw new Error('Wallet not connected');

      const ata = await getAssociatedTokenAddress(mint, owner);
      const instruction = createAssociatedTokenAccountInstruction(
        owner, // payer
        ata, // ata
        owner, // owner
        mint // mint
      );

      const { transaction } = await buildTransaction({
        payerKey: owner,
        connection,
        instructions: [instruction],
      });

      const signature = await wallet.adapter.sendTransaction(
        transaction,
        connection
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      return { signature, mint, address: ata };
    },
    onSuccess: ({ signature }) => {
      if (signature) transactionToast(signature, 'Token account created');

      const keys = [
        getTokenAccountsOptions(connection, owner).queryKey,
        getBalanceOptions(owner, connection).queryKey,
      ];

      return Promise.all(
        keys.map((queryKey) => client.invalidateQueries({ queryKey }))
      );
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`);
    },
  });
}
