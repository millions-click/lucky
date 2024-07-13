'use client';

import { useEffect, useState } from 'react';

import { Portal } from './portal';
import { LockDoor } from './lock';
import { Turns } from './Turns';

import { useMessages } from '@/providers';
import { createLuckyPass, getTurns, playATurn } from '@/actions';
import type { TurnsSession } from '@/actions/types';

export function LockController() {
  const { show, clear } = useMessages();

  const [session, setSession] = useState<TurnsSession | null>(null);
  const [attempts, setAttempts] = useState<number | null>(null);
  const [winner, setWinner] = useState<boolean>(false);
  const [vortexActivated, setVortexActivated] = useState<boolean>(false);

  const load = async () => {
    const { turns, attempts, pass } = await getTurns();
    setWinner(Boolean(pass));
    setSession(turns);
    setAttempts(attempts);
    displayMessage(turns, Boolean(pass), attempts);
  };

  const displayMessage = (
    turns: TurnsSession | null,
    winner: boolean,
    attempts: number | null
  ) => {
    if ((!turns || winner) && attempts !== null) {
      const message = winner ? (turns ? 5 : 6) : Math.min(attempts || 0, 4);
      show(message.toString());
    } else clear();
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
          const turns = match
            ? (await createLuckyPass(seed)).turns
            : await playATurn();

          setSession(turns);
          setWinner(match);
          displayMessage(turns, match, attempts);
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
