'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { type LockState, LockChatController } from './chat';
import { Portal } from './portal';
import { LockDoor } from './lock';
import { Turns } from './Turns';
import { Locked } from './Locked';

import type {
  Seed,
  TurnsSession,
  AttemptSession,
  LuckyPassSession,
} from '@/actions/types.d';
import { CountdownProvider } from '@/providers';
import { createLuckyPass, getTurns, playATurn } from '@/actions';

const freeEntry = process.env.NEXT_PUBLIC_FREE_ENTRY === 'true';

export function LockController() {
  const [attempt, setAttempts] = useState<AttemptSession | null>(null);
  const [turns, setTurns] = useState<TurnsSession | null>(null);
  const [pass, setPass] = useState<LuckyPassSession | null>(null);

  const [vortexActivated, setVortexActivated] = useState<boolean>(false);
  const [targetUrl, setTargetUrl] = useState<string>('/game');

  const state: LockState = useMemo(() => {
    if (pass) {
      if (pass.activated) {
        const expires = pass.activated + pass.ttl * 1000;
        if (expires < Date.now()) {
          setTargetUrl('/game/store?from=door&action=pass_sale');
          return 'expired';
        }
        setTargetUrl('/game/realms?from=door&action=continue');
        return 'activated';
      }
      if (turns) return 'winner';
      return 'unlocked';
    }
    if (attempt?.claimed) return 'locked';
    if (turns) {
      if (turns.hold) return 'hold';
      return 'playing';
    }
    return 'idle';
  }, [pass?.activated, attempt?.claimed, turns]);

  const winner = useMemo(() => Boolean(pass), [pass]);

  const load = useCallback(async () => {
    const { turns, attempt, pass } = await getTurns();

    setPass(pass);
    setTurns(turns);
    setAttempts(attempt);

    return { turns, attempt, pass };
  }, []);

  const _createLuckyPass = async (match: boolean, seed: Seed) => {
    const {
      pass,
      turns,
      attempt: _attempt,
    } = match ? await createLuckyPass(seed) : await playATurn();

    setTurns(turns);
    if (pass) setPass(pass);
    if (!attempt || _attempt.attempts !== attempt.attempts)
      setAttempts(_attempt);
  };

  useEffect(() => {
    const timestamp = Date.now();
    const debounce = setTimeout(
      () =>
        load().then(({ pass }) => {
          console.log('LockController:load->then', {
            freeEntry,
            pass,
            gen: freeEntry && !pass,
          });

          if (freeEntry && !pass)
            return setTimeout(
              () =>
                _createLuckyPass(true, {
                  trigger: 500,
                  value: 69,
                  timestamp,
                }),
              1000
            );
        }),
      100
    );

    return () => clearTimeout(debounce);
  }, []);

  return attempt ? (
    <>
      <CountdownProvider onFinished={load}>
        {winner && (
          <Portal
            type="entrance"
            active={winner}
            href={targetUrl}
            onActive={setVortexActivated}
          />
        )}

        <LockDoor
          vortex={vortexActivated}
          disabled={state !== 'playing' && state !== 'idle'}
          onAttempt={_createLuckyPass}
        />

        {state === 'locked' && <Locked attempt={attempt} />}
        {(state === 'hold' || state === 'playing') && (
          <Turns attempts={attempt.attempts} winner={winner} session={turns} />
        )}
      </CountdownProvider>
      <LockChatController state={state} attempts={attempt.attempts} />
    </>
  ) : (
    <span className="loading loading-dots loading-lg text-primary" />
  );
}
