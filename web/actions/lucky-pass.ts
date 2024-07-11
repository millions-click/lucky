'use server';

import {
  LUCKY_PASS_COOKIE,
  type LuckyPassSession,
  type Seed,
} from '@/actions/types';
import { decrypt, encrypt, safeDecrypt } from '@/utils/jwt';

import { cookies } from 'next/headers';
import { playATurn } from './turns';

const TTL = 60 * 60 * 24 * 1000;

export async function getLuckyPass(): Promise<LuckyPassSession | null> {
  const session = cookies().get(LUCKY_PASS_COOKIE)?.value;
  if (!session) return null;
  return (await safeDecrypt(session, LUCKY_PASS_COOKIE)) as LuckyPassSession;
}

export async function createLuckyPass(seed: Seed, address?: string) {
  const turns = await playATurn();

  const expires = Date.now() + TTL;
  const session = await encrypt(
    {
      address,
      seed,
      expires,
    },
    expires
  );

  cookies().set(LUCKY_PASS_COOKIE, session, {
    expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return { pass: (await decrypt(session)) as LuckyPassSession, turns };
}
