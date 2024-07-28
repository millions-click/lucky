'use client';

import { useEffect, useState } from 'react';

import { Portal } from './portal';
import { LockDoor } from './lock';
import { Turns } from './Turns';

import { CountdownProvider, useMessagesHandler } from '@/providers';
import { createLuckyPass, getTurns, playATurn } from '@/actions';
import { Attempt, TurnsSession } from '@/actions/types';

export function LockController() {
  const { show, clear } = useMessagesHandler();

  const [session, setSession] = useState<TurnsSession | null>(null);
  const [attempt, setAttempts] = useState<Attempt>({ attempts: 0 });
  const [winner, setWinner] = useState<boolean>(false);
  const [vortexActivated, setVortexActivated] = useState<boolean>(false);

  const load = async () => {
    const { turns, attempt, pass } = await getTurns();
    setWinner(Boolean(pass));
    setSession(turns);
    setAttempts(attempt);
    displayMessage(turns, Boolean(pass), attempt.attempts);
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
    <CountdownProvider onFinished={load}>
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
          const {
            turns,
            attempt: { attempts },
          } = match ? await createLuckyPass(seed) : await playATurn();

          setSession(turns);
          setWinner(match);
          displayMessage(turns, match, attempts);
        }}
      />

      <Turns attempts={attempt.attempts} winner={winner} session={session} />
    </CountdownProvider>
  );
}
