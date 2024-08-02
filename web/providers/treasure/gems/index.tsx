'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type Cluster, PublicKey } from '@solana/web3.js';

import type { TokenAccount, GemsContext } from './gems.d';

import { useCluster } from '@/hooks';
import { getKeeperPDA } from '@luckyland/anchor';
import { TokensProvider, useTokens } from '@/providers';

const Context = createContext({} as GemsContext);

function Provider({ children }: { children: React.ReactNode }) {
  const { owner, tokens: gems, refresh, getAccount } = useTokens();
  // TODO: get the selected gem from the local storage.
  //  If null, make the user choose the one it wants to use for treasure hunting.
  const [gem, setGem] = useState<TokenAccount | null>(() => gems[0] || null);

  useEffect(() => {
    if (gem || !gems.length) return;
    const debounced = setTimeout(() => setGem(gems[0]), 300);
    return () => clearTimeout(debounced);
  }, [gems]);

  const value = {
    owner,

    gem,
    gems,

    select: useCallback(
      async (gem: PublicKey) => {
        const _account = getAccount(gem);
        if (!_account) throw new Error('Token account not found');

        setGem(_account);
      },
      [getAccount]
    ),
    getGem: getAccount,

    refresh,
  } as GemsContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function GemsProvider({ children }: { children: React.ReactNode }) {
  const { cluster } = useCluster();
  const owner = useMemo(
    () => getKeeperPDA(cluster.network as Cluster),
    [cluster]
  );

  return (
    <TokensProvider owner={owner}>
      <Provider>{children}</Provider>
    </TokensProvider>
  );
}

export function useGems() {
  return useContext(Context);
}
