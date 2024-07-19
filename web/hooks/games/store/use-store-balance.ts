import { PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

// TODO: Read this from somewhere.
const STORE_SIZE = 88; // 48 bytes

// TODO: Refactor as a generic hook to know any account balance given the size.
export const useStoreBalance = (address: PublicKey, size = STORE_SIZE) => {
  const { connection } = useConnection();

  const minimumBalance = useQuery({
    queryKey: ['store-minimum-balance', { endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getMinimumBalanceForRentExemption(size),
  });

  return useQuery({
    queryKey: ['store-balance', { endpoint: connection.rpcEndpoint, address }],
    queryFn: async () => {
      if (!minimumBalance.data) throw new Error('Minimum balance not loaded');

      const rent = minimumBalance.data;
      const balance = await connection.getBalance(address);

      return balance - rent;
    },
  });
};
