'use server';

import { cookies } from 'next/headers';

import {
  type Attempt,
  type TurnsSession,
  MAX_TTL_ATTEMPTS,
  TURNS_AVAILABLE,
  TURNS_COOKIE,
  ATTEMPTS_COOKIE,
} from './types.d';
import { decrypt, encrypt, safeDecrypt } from '@/utils/jwt';
import { getLuckyPass } from './lucky-pass';

const TTL = 30 * 1000;

/**
 * Exponentially increase the TTL based on the number of attempts
 * */
function computeTTL(attempt: number): number {
  return TTL * Math.pow(2, Math.min(attempt - 1, MAX_TTL_ATTEMPTS));
}

async function createTurns(address?: string) {
  const { attempts } = await getAttempts(true);
  const user = { address, turns: TURNS_AVAILABLE };

  const expires = Date.now() + computeTTL(attempts);
  const session = await encrypt({ ...user, attempts }, expires);

  cookies().set(TURNS_COOKIE, session, {
    expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return (await decrypt(session)) as TurnsSession;
}

async function setAttempts(attempts = 1, claim = false): Promise<Attempt> {
  const claimed = claim ? Date.now() : undefined;
  const expires = (claimed || Date.now()) + 60 * 60 * 3 * 1000;

  const attempt = { attempts, claimed };
  const session = await encrypt(attempt, expires);
  cookies().set(ATTEMPTS_COOKIE, session, {
    expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return attempt;
}

async function getAttempts(newAttempt = false): Promise<Attempt> {
  const session = cookies().get(ATTEMPTS_COOKIE)?.value;
  if (!session) return newAttempt ? setAttempts() : { attempts: 0 };

  const attempt = (await safeDecrypt(session, ATTEMPTS_COOKIE)) as Attempt;
  const { attempts } = attempt;

  if (newAttempt) return setAttempts(attempts + 1);
  return attempt;
}

export async function getTurns() {
  const attempt = await getAttempts();
  const pass = await getLuckyPass();
  const session = cookies().get(TURNS_COOKIE)?.value;
  if (!session) return { attempt, turns: null, pass };

  const turns = (await safeDecrypt(session, TURNS_COOKIE)) as TurnsSession;
  return { turns, attempt, pass };
}

export async function playATurn(address?: string) {
  const { turns: session, attempt } = await getTurns();
  if (!session) return { turns: await createTurns(address), attempt };
  if (session.hold) {
    if (session.exp > Date.now()) return { turns: session, attempt };
    return { turns: await createTurns(address), attempt };
  }

  session.turns -= 1;
  session.hold = session.turns <= 0;

  cookies().set(TURNS_COOKIE, await encrypt(session, session.exp), {
    expires: session.exp,
    httpOnly: true,
    sameSite: 'strict',
  });

  return { turns: session, attempt };
}

export async function lockAttempts(address?: string) {
  const {
    turns,
    attempt: { attempts, claimed },
  } = await playATurn(address);
  if (claimed) throw new Error('Already claimed');

  const attempt = await setAttempts(attempts, true);
  return { turns, attempt };
}
