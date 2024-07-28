'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { type Cluster } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import {
  type Realm,
  type Realms,
  type RealmsContext,
  RealmsMap,
} from './realms.d';

import { BountiesProvider, GameProvider, usePortal } from '@/providers';
import {
  getBountiesOptions,
  getGameModesOptions,
  getRealmsOptions,
} from '@/queries';

function findById(realms: Realms, id: string): Realm | null {
  return (
    Object.values(realms).find(({ name }) => name.toLowerCase() === id) || null
  );
}
function findInfo(realms: Realms | null, active?: Realm | null) {
  if (!realms) return;
  const id = active ? RealmsMap[active.name.toLowerCase()]?.next : 'coin';
  if (!id) return;

  const realm = findById(realms, id);
  if (!realm) return;

  return RealmsMap[id];
}

const Context = createContext({} as RealmsContext);

export function RealmsProvider({ children }: { children: React.ReactNode }) {
  const { portal, cluster } = usePortal();
  const [realm, setRealm] = useState<string>();

  const realmsQuery = useQuery(
    getRealmsOptions(portal, cluster.network as Cluster)
  );
  const modesQuery = useQuery(
    getGameModesOptions(realmsQuery.data, portal, cluster.network as Cluster)
  );
  const bountiesQuery = useQuery(
    getBountiesOptions(modesQuery.data, portal, cluster.network as Cluster)
  );

  const { realms } = useMemo(
    () => bountiesQuery.data || { realms: null },
    [bountiesQuery.data]
  );
  const active = useMemo(
    () => (realms && realm ? findById(realms, realm) : null),
    [realm, realms]
  );
  const next = useMemo(() => findInfo(realms, active), [active, realms]);

  const value = {
    id: realm,
    next,
    active,
    realms,
    activate: setRealm,
  } as RealmsContext;

  return (
    <Context.Provider value={value}>
      <BountiesProvider>
        <GameProvider realm={active} id={realm}>
          {children}
        </GameProvider>
      </BountiesProvider>
    </Context.Provider>
  );
}

export const useRealms = () => {
  return useContext(Context);
};
