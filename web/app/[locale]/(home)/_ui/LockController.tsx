'use client';

import { useEffect, useState } from 'react';

import { Portal } from './portal';
import { LockDoor } from './lock';
import { Turns } from './Turns';

import { createLuckyPass, getTurns, playATurn } from '@/actions';
import type { TurnsSession } from '@/actions/types';

export function LockController() {
  const [session, setSession] = useState<TurnsSession | null>(null);
  const [attempts, setAttempts] = useState<number | null>(null);
  const [winner, setWinner] = useState<boolean>(false);
  const [vortexActivated, setVortexActivated] = useState<boolean>(false);

  const load = async () => {
    const { turns, attempts, pass } = await getTurns();
    setWinner(Boolean(pass));
    setSession(turns);
    setAttempts(attempts);
  };

  useEffect(() => {
    load().then();
  }, []);

  return (
    <>
      {winner && (
        <Portal
          active={winner}
          type="entrance"
          href="/game"
          onActive={setVortexActivated}
        />
      )}

      <LockDoor
        vortex={vortexActivated}
        disabled={session?.hold || winner}
        onAttempt={async (match, seed) => {
          if (match) {
            const { turns } = await createLuckyPass(seed);
            setSession(turns);
            setWinner(true);
          } else setSession(await playATurn());
        }}
      />

      <Turns
        attempts={attempts}
        winner={winner}
        session={session}
        onRenew={load}
      />
    </>
  );
}
