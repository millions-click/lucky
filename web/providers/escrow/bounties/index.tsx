'use client';

import { createContext, useContext, useMemo } from 'react';
import { type Cluster } from '@solana/web3.js';

import type { BountiesContext } from './bounties.d';

import { useCluster } from '@/hooks';
import { getEscrowPDA } from '@luckyland/anchor';
import { TokensProvider, useTokens } from '@/providers';

const Context = createContext({} as BountiesContext);

function Provider({ children }: { children: React.ReactNode }) {
  const { owner, tokens: bounties, refresh, getAccount } = useTokens();

  const value = {
    owner,

    bounties,
    getBounty: getAccount,

    refresh,
  } as BountiesContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function BountiesProvider({ children }: { children: React.ReactNode }) {
  const { cluster } = useCluster();
  const owner = useMemo(
    () => getEscrowPDA(cluster.network as Cluster),
    [cluster]
  );

  return (
    <TokensProvider owner={owner}>
      <Provider>{children}</Provider>
    </TokensProvider>
  );
}

export function useBounties() {
  return useContext(Context);
}
