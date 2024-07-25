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

import { GameProvider, usePortal } from '@/providers';
import { getRealmsOptions } from '@/queries';

function findById(realms: Realms, id: string): Realm | null {
  return (
    realms.find(({ account: { name } }) => name.toLowerCase() === id) || null
  );
}
function findInfo(realms: Realms, active?: Realm | null) {
  const id = active
    ? RealmsMap[active.account.name.toLowerCase()]?.next
    : 'coin';
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
  const realms = useMemo(() => realmsQuery.data || [], [realmsQuery.data]);
  const active = useMemo(
    () => (realm ? findById(realms, realm) : null),
    [realm, realms]
  );
  const next = useMemo(() => findInfo(realms, active), [active, realms]);

  const value = {
    next,
    active,
    realms,
    activate: setRealm,
  } as RealmsContext;

  return (
    <Context.Provider value={value}>
      <GameProvider realm={active}>{children}</GameProvider>
    </Context.Provider>
  );
}

export const useRealms = () => {
  return useContext(Context);
};
