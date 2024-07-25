'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { type Cluster } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { type Realm, type RealmsContext, RealmsMap } from './realms.d';

import { usePortal } from '@/providers';
import { getRealmsOptions } from '@/queries';

function findById(realms: Realm[], id: string) {
  return realms.find(({ account: { name } }) => name.toLowerCase() === id);
}
function findInfo(realms: Realm[], active: Realm | null) {
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

  const realmsQuery = useQuery(
    getRealmsOptions(portal, cluster.network as Cluster)
  );
  const realms = useMemo(() => realmsQuery.data || [], [realmsQuery.data]);
  type Realm = (typeof realms)[number];

  const [active, setActive] = useState<Realm | null>(null);
  const next = useMemo(() => findInfo(realms, active), [active, realms]);

  const value = {
    next,
    active,
    realms,
    activate: useCallback(
      async (id) => {
        const realm = findById(realms, id);
        if (!realm) throw new Error('Realm not found');
        setActive(realm);
      },
      [realms]
    ),
  } as RealmsContext<Realm>;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useRealms = () => {
  return useContext(Context);
};
