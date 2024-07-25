'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { LuckyPassContext, LuckyPassProviderProps } from './pass.d';

import { CountdownProvider, useCountdown } from '@/providers';
import { activateLuckyPass, saveLuckyPass, redeemLuckyPass } from '@/actions';

const Context = createContext({} as LuckyPassContext);

function Provider({ children, session }: LuckyPassProviderProps) {
  const { setup, start, countdown } = useCountdown();
  const [pass, setPass] = useState(session);
  const state = useMemo(() => {
    if (pass.code) return 'saved';
    if (pass.activated) {
      const expires = pass.activated + pass.ttl * 1000;
      if (expires < Date.now()) return 'expired';
      return 'active';
    }
    return 'idle';
  }, [pass]);

  useEffect(() => {
    setup(state === 'expired' ? 0 : pass.ttl, false, 'lucky-pass');

    if (pass.activated)
      start(state === 'active' ? pass.activated + pass.ttl * 1000 : pass.exp);
  }, [pass]);

  const value = {
    state,
    pass,
    countdown: {
      countdown,
      state,
    },

    save: useCallback(async () => {
      const savedPass = await saveLuckyPass();
      if (!savedPass) throw new Error('Failed to save the pass');

      setPass(savedPass);
      return savedPass.code;
    }, []),
    activate: useCallback(async (bag: string) => {
      if (state !== 'idle') throw new Error('Pass already activated');

      const activatedPass = await activateLuckyPass(bag);
      if (!activatedPass) throw new Error('Failed to activate the pass');
      setPass(activatedPass);
    }, []),
    redeem: useCallback(async () => {
      if (!pass.code) throw new Error('No code to redeem');

      const redeemedPass = await redeemLuckyPass(pass.code);
      if (!redeemedPass) throw new Error('Failed to redeem the pass');

      setPass(redeemedPass);
    }, [pass.code]),
  } as LuckyPassContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

const closeSession = () => window?.location.reload();

export function LuckyPassProvider({
  children,
  session,
}: LuckyPassProviderProps) {
  return (
    <CountdownProvider onFinished={closeSession}>
      <Provider session={session}>{children}</Provider>
    </CountdownProvider>
  );
}

export function useLuckyPass() {
  return useContext(Context);
}
