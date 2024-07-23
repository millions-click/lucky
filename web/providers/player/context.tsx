'use client';

import {
  type PropsWithChildren,
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import {
  type Wallet,
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import { type Cluster, PublicKey } from '@solana/web3.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { PlayerContext } from './player.d';

import { TokensProvider, useCluster, useTokens } from '@/providers';
import { LuckyWalletAdapter } from '@/adapters';
import { getAvgTxFeeOptions, getBalanceOptions } from '@/queries';

const Context = createContext({
  player: null,
  bagType: 'none',
  tokens: [],
  getAccount: (_: PublicKey) => null,
  refresh: async () => void 0,
  createTokenAccount: async (_: PublicKey) => {
    throw new Error('Outside context provider');
  },
  disconnect: () => void 0,
  balance: 0,
  roundFee: BigInt(0),
} as PlayerContext);

function getBagType(wallet: Wallet | null) {
  if (!wallet) return 'none';
  return wallet instanceof LuckyWalletAdapter ? 'lucky-bag' : 'external';
}

function Provider({ children }: PropsWithChildren) {
  const client = useQueryClient();
  const { cluster } = useCluster();
  const { connection } = useConnection();
  const { wallet, disconnect } = useWallet();
  const { owner, tokens, getAccount, create, refresh } = useTokens();
  const [bagType, setBagType] = useState(getBagType(wallet));

  const balanceQuery = useQuery(getBalanceOptions(owner, connection));
  const balance = useMemo(() => balanceQuery.data || 0, [balanceQuery.data]);
  const roundFeeQuery = useQuery(
    getAvgTxFeeOptions(cluster.network as Cluster)
  );
  const roundFee = useMemo(
    () => roundFeeQuery.data || BigInt(0),
    [roundFeeQuery.data]
  );

  useEffect(() => {
    setBagType(getBagType(wallet));
  }, [wallet]);

  const value = {
    bagType,
    player: owner,

    balance,
    tokens,
    roundFee,

    refresh: useCallback(async () => {
      await refresh();
      return client.invalidateQueries({
        queryKey: getBalanceOptions(owner, connection).queryKey,
      });
    }, [refresh, owner, connection, client]),

    getAccount,
    createTokenAccount: create,

    disconnect,
  } as PlayerContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function PlayerProvider({ children }: PropsWithChildren) {
  const { publicKey } = useWallet();

  return (
    <TokensProvider owner={publicKey}>
      <Provider>{children}</Provider>
    </TokensProvider>
  );
}

export function usePlayer() {
  return useContext(Context);
}
