'use client';

import { useEffect, useState } from 'react';

import { PlayButton } from './PlayButton';
import { Turns } from './Turns';

import { createLuckyPass, getAttempts, getTurns, playATurn } from '@/actions';
import type { TurnsSession } from '@/actions/types';

export function Session() {
  const [session, setSession] = useState<TurnsSession | null>(null);
  const [attempts, setAttempts] = useState<number | null>(null);

  const load = async () => {
    setSession(await getTurns());
    setAttempts(await getAttempts());
  };
  useEffect(() => {
    load().then();
  }, []);

  return (
    <>
      <PlayButton
        disabled={session?.hold}
        onPlay={async (match, seed) => {
          setSession(await playATurn());
          if (match) await createLuckyPass(seed);
        }}
      />

      <Turns attempts={attempts} session={session} onRenew={load} />
    </>
  );
}
