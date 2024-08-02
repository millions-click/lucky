'use server';

import {
  type Seed,
  type LuckyPass,
  type LuckyPassSession,
  LUCKY_PASS_COOKIE,
  LUCKY_PASS_TTL,
} from './types.d';
import { decrypt, encrypt, safeDecrypt } from '@/utils/jwt';

import { cookies } from 'next/headers';
import { lockAttempts } from './turns';

function getExpires(ttl: number, times = 2, now = Date.now()) {
  return now + ttl * times * 1000;
}

export async function getLuckyPass(): Promise<LuckyPassSession | null> {
  const session = cookies().get(LUCKY_PASS_COOKIE)?.value;
  if (!session) return null;
  return (await safeDecrypt(session, LUCKY_PASS_COOKIE)) as LuckyPassSession;
}

async function setLuckyPass(pass: LuckyPass, expires: number) {
  const session = await encrypt(pass, expires);

  cookies().set(LUCKY_PASS_COOKIE, session, {
    expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return (await decrypt(session)) as LuckyPassSession;
}

export async function createLuckyPass(
  seed: Seed,
  address?: string,
  ttl = LUCKY_PASS_TTL
) {
  if (Date.now() < seed.timestamp) throw new Error('Invalid seed');
  const turns = await lockAttempts(address, ttl);

  const expires = getExpires(ttl);
  const pass = await setLuckyPass({ address, seed, ttl }, expires);

  return { pass, ...turns };
}

export async function activateLuckyPass(address: string) {
  const pass = await getLuckyPass();

  if (!pass) return null;
  if (pass.address && pass.address !== address)
    throw new Error('Invalid address');
  if (pass.activated) return pass;

  const expires = getExpires(pass.ttl, 1.5);
  return setLuckyPass(
    {
      ...pass,
      address,
      activated: Date.now(),
    },
    expires
  );
}

export async function saveLuckyPass(): Promise<LuckyPassSession | null> {
  const pass = await getLuckyPass();
  if (!pass) return null;

  let expires = getExpires(pass.ttl, 24, pass.seed.timestamp);
  const session = await encrypt(pass, expires);

  const ttl = 5 * 60; // This is to provide a lazy UX.
  const activated = Date.now();
  expires = getExpires(ttl, 1);

  return setLuckyPass({ ...pass, ttl, activated, code: session }, expires);
}

export async function redeemLuckyPass(jwt: string) {
  const session = (await decrypt(jwt)) as LuckyPassSession;
  if (!session) return null;

  const expires = getExpires(session.ttl, 1.5);
  return setLuckyPass(session, expires);
}
