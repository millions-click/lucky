'use client';

import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { type Cluster } from '@solana/web3.js';

import type { PortalContext } from './portal.d';

import {
  useAnchorProvider,
  useCluster,
  ReactQueryProvider,
  ClusterProvider,
  SolanaProvider,
} from '@/providers';
import { getGamesProgram, getGamesProgramId } from '@luckyland/anchor';
import { useQuery } from '@tanstack/react-query';

const Context = createContext({} as PortalContext);

function Portal({ children }: PropsWithChildren) {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();

  const portalId = useMemo(
    () => getGamesProgramId(cluster.network as Cluster),
    [cluster]
  );

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => provider.connection.getParsedAccountInfo(portalId),
  });
  const state = useMemo(() => {
    if (getProgramAccount.isLoading) return 'loading';
    if (getProgramAccount.isError) return 'error';
    if (getProgramAccount.data) return 'success';
    return 'idle';
  }, [getProgramAccount]);

  const portal = useMemo(() => getGamesProgram(provider), [provider]);

  const value = {
    cluster,
    state,

    portalId,
    portal,
  } as PortalContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function PortalProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>
          <Portal>{children}</Portal>
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}

export function usePortal() {
  return useContext(Context);
}
