'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Cluster, PublicKey } from '@solana/web3.js';

import type { TradersContext } from './traders.d';

import { TokenAccount, useCluster } from '@/hooks';
import { getTollkeeperPDA } from '@luckyland/anchor';
import { TokensProvider, useTokens } from '@/providers';

const Context = createContext({} as TradersContext);

function Provider({ children }: { children: React.ReactNode }) {
  const { owner, tokens: traders, refresh, getAccount } = useTokens();
  // TODO: get the selected trader from the local storage.
  //  If null, make the user choose the one it wants to use for treasure hunting.
  const [trader, setTrader] = useState<TokenAccount | null>(
    () => traders[0] || null
  );

  useEffect(() => {
    if (trader || !traders.length) return;
    const debounced = setTimeout(() => setTrader(traders[0]), 300);
    return () => clearTimeout(debounced);
  }, [traders]);

  const value = {
    owner,

    trader,
    traders,

    select: useCallback(
      async (trader: PublicKey) => {
        const _account = getAccount(trader);
        if (!_account) throw new Error('Token account not found');

        setTrader(_account);
      },
      [getAccount]
    ),
    getTrader: getAccount,

    refresh,
  } as TradersContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function TradersProvider({ children }: { children: React.ReactNode }) {
  const { cluster } = useCluster();
  const owner = useMemo(
    () => getTollkeeperPDA(cluster.network as Cluster),
    [cluster]
  );

  return (
    <TokensProvider owner={owner}>
      <Provider>{children}</Provider>
    </TokensProvider>
  );
}

export function useTraders() {
  return useContext(Context);
}
