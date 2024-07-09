'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  type TurnsSession,
  TURNS_AVAILABLE,
  TURNS_COOKIE,
  ATTEMPTS_COOKIE,
} from './types';
import { decrypt, encrypt } from '@/utils/jwt';

const TTL = 30 * 1000;
const cookie = TURNS_COOKIE;

/**
 * Exponentially increase the TTL based on the number of attempts
 * */
function computeTTL(attempt: number): number {
  return TTL * Math.pow(2, attempt - 1);
}

async function createTurns(address?: string) {
  const attempts = await getAttempts(true);
  const user = { address, turns: TURNS_AVAILABLE };

  const expires = Date.now() + computeTTL(attempts);
  const session = await encrypt({ ...user, expires, attempts });

  cookies().set(cookie, session, {
    expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return (await decrypt(session)) as TurnsSession;
}

function setAttempts(attempts = 1) {
  const oneMothInFuture = new Date();
  oneMothInFuture.setMonth(oneMothInFuture.getMonth() + 1);

  cookies().set(ATTEMPTS_COOKIE, attempts.toString(), {
    expires: oneMothInFuture,
    httpOnly: true,
    sameSite: 'strict',
  });

  return attempts;
}

export async function getAttempts(newAttempt = false) {
  const attempts = Number(cookies().get(ATTEMPTS_COOKIE)?.value);
  if (!Number.isNaN(attempts)) {
    if (newAttempt) return setAttempts(attempts + 1);
    return attempts;
  }

  return newAttempt ? setAttempts() : 0;
}

export async function getTurns() {
  const session = cookies().get(cookie)?.value;
  if (!session) return null;
  return (await decrypt(session)) as TurnsSession;
}

export async function playATurn(address?: string) {
  const session = await getTurns();
  if (!session) return createTurns(address);
  if (session.hold) {
    if (session.expires > Date.now()) return session;
    return createTurns(address);
  }

  session.turns -= 1;
  session.hold = session.turns <= 0;

  cookies().set(cookie, await encrypt(session), {
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
    name: cookie,
    value: attempts,
    httpOnly: true,
    expires: oneMothInFuture,
    sameSite: 'strict',
  });

  return res;
}
