'use client';

import { useEffect, useState } from 'react';

import { LockDoor } from './lock';
import { Turns } from './Turns';

import { createLuckyPass, getTurns, playATurn } from '@/actions';
import type { TurnsSession } from '@/actions/types';

export function LockController() {
  const [session, setSession] = useState<TurnsSession | null>(null);
  const [attempts, setAttempts] = useState<number | null>(null);
  const [winner, setWinner] = useState<boolean>(false);

  const load = async () => {
    const { turns, attempts } = await getTurns();
    setSession(turns);
    setAttempts(attempts);
  };

  useEffect(() => {
    load().then();
  }, []);

  return (
    <>
      <LockDoor
        winner={winner}
        disabled={session?.hold}
        onAttempt={async (match, seed) => {
          if (match) {
            const { turns } = await createLuckyPass(seed);
            setSession(turns);
            setWinner(true);
          } else setSession(await playATurn());
        }}
      />

      <Turns attempts={attempts} session={session} onRenew={load} />
    </>
  );
}
