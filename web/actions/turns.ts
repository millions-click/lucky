'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  type TurnsSession,
  MAX_TTL_ATTEMPTS,
  TURNS_AVAILABLE,
  TURNS_COOKIE,
  ATTEMPTS_COOKIE,
} from './types';
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
  const attempts = await getAttempts(true);
  const user = { address, turns: TURNS_AVAILABLE };

  const expires = Date.now() + computeTTL(attempts);
  const session = await encrypt({ ...user, expires, attempts }, expires);

  cookies().set(TURNS_COOKIE, session, {
    expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return (await decrypt(session)) as TurnsSession;
}

async function setAttempts(attempts = 1) {
  const oneMothInFuture = new Date();
  oneMothInFuture.setMonth(oneMothInFuture.getMonth() + 1);

  const session = await encrypt({ attempts }, oneMothInFuture);
  cookies().set(ATTEMPTS_COOKIE, session, {
    expires: oneMothInFuture,
    httpOnly: true,
    sameSite: 'strict',
  });

  return attempts;
}

async function getAttempts(newAttempt = false): Promise<number> {
  const session = cookies().get(ATTEMPTS_COOKIE)?.value;
  if (!session) return newAttempt ? setAttempts() : 0;

  const attempts =
    Number((await safeDecrypt(session, ATTEMPTS_COOKIE))?.attempts) || 0;
  if (newAttempt) return setAttempts(attempts + 1);
  return attempts;
}

export async function getTurns() {
  const attempts = await getAttempts();
  const pass = await getLuckyPass();
  const session = cookies().get(TURNS_COOKIE)?.value;
  if (!session) return { attempts, turns: null, pass };

  const turns = (await safeDecrypt(session, TURNS_COOKIE)) as TurnsSession;
  return { turns, attempts, pass };
}

export async function playATurn(address?: string) {
  const { turns: session } = await getTurns();
  if (!session) return createTurns(address);
  if (session.hold) {
    if (session.expires > Date.now()) return session;
    return createTurns(address);
  }

  session.turns -= 1;
  session.hold = session.turns <= 0;

  cookies().set(TURNS_COOKIE, await encrypt(session, session.expires), {
    expires: session.expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return session;
}

export async function updateSession(request: NextRequest) {
  const attempts = request.cookies.get(ATTEMPTS_COOKIE)?.value;
  if (!attempts) return;

  // Refresh the attempts so it doesn't expire
  const res = NextResponse.next();
  const oneMothInFuture = new Date();
  oneMothInFuture.setMonth(oneMothInFuture.getMonth() + 1);

  res.cookies.set({
    name: TURNS_COOKIE,
    value: attempts,
    httpOnly: true,
    expires: oneMothInFuture,
    sameSite: 'strict',
  });

  return res;
}
