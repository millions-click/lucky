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
  const { setup, countdown, start } = useCountdown();
  const [pass, setPass] = useState(session);
  const state = useMemo(() => {
    if (pass.code) return 'saved';
    if (pass.activated) return 'active';
    return 'idle';
  }, [pass]);

  useEffect(() => {
    setup(pass.ttl, false, 'lucky-pass');
    if (pass.activated) start(pass.activated + pass.ttl * 1000);
  }, [pass]);

  const value = {
    state,
    pass,
    countdown,

    save: useCallback(async () => {
      const savedPass = await saveLuckyPass();
      if (!savedPass) throw new Error('Failed to save the pass');

      setPass(savedPass);
      return savedPass.code;
    }, []),
    activate: useCallback(async (bag: string) => {
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

function closeSession() {}

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
