'use server';

import {
  type Sale,
  type Sales,
  type Stage,
  type LuckSale,
  type LuckSaleSession,
  SALE_COOKIE,
} from './types.d';
import { decrypt, encrypt, safeDecrypt } from '@/utils/jwt';

import { cookies } from 'next/headers';
import { Redis } from '@upstash/redis';

const { SALE_MAX_TOKENS_PER_STAGE, UPSTASH_API_KEY, UPSTASH_API_URL } =
  process.env;

const maxPerStage = Number(SALE_MAX_TOKENS_PER_STAGE) || 10_000_000;
const redis = new Redis({ url: UPSTASH_API_URL, token: UPSTASH_API_KEY });

function getExpires(ttl: number, times = 2, now = Date.now()) {
  return now + ttl * times * 1000;
}

function cookieName(address: string) {
  return `${SALE_COOKIE}-${address}`;
}

async function getLuckSale(address: string): Promise<LuckSaleSession | null> {
  const session = cookies().get(cookieName(address))?.value;
  if (!session) return null;
  return (await safeDecrypt(session, cookieName(address))) as LuckSaleSession;
}

async function setLuckSale(sale: LuckSale, expires: number) {
  const session = await encrypt(sale, expires);

  cookies().set(cookieName(sale.address), session, {
    expires,
    httpOnly: true,
    sameSite: 'strict',
  });

  return (await decrypt(session)) as LuckSaleSession;
}

function getStages({ sales }: Sales): Array<Stage> {
  const stages = {} as Record<number, Stage>;

  sales.map((sale) => {
    const stage = stages[sale.stage];
    if (!stage)
      return (stages[sale.stage] = {
        id: sale.stage,
        available: maxPerStage - sale.amount,
      });

    stages[sale.stage].available -= sale.amount;
  });

  return Object.values(stages).sort((a, b) => a.id - b.id);
}

export async function createLuckSale(
  address: string,
  cluster: string
): Promise<LuckSaleSession> {
  let sales = (await redis.get(`sales-${address}-${cluster}`)) as Sales;
  if (!sales) {
    sales = {
      address,
      sales: [],
      created: Date.now(),
      updated: Date.now(),
    } as Sales;
    await redis.set(`sales-${address}-${cluster}`, sales);
  }

  const expires = getExpires(60 * 60 * 24);
  return setLuckSale(
    {
      address,
      maxPerStage,
      stages: getStages(sales),
    },
    expires
  );
}

export async function loadLuckSale(address: string, cluster: string) {
  const sale = await getLuckSale(address);

  if (!sale) return createLuckSale(address, cluster);
  if (sale.address !== address) throw new Error('Inconsistent address');

  return sale;
}

export async function registerLuckSale(
  address: string,
  cluster: string,
  sale: Sale
) {
  const session = await getLuckSale(address);
  if (!session) throw new Error('Missing session');

  const sales = (await redis.get(`sales-${address}-${cluster}`)) as Sales;
  if (!sales) throw new Error('Missing sales');

  sales.sales.push(sale);
  sales.updated = Date.now();
  await redis.set(`sales-${address}-${cluster}`, sales);

  return setLuckSale(
    {
      ...session,
      stages: getStages(sales),
    },
    getExpires(60 * 60 * 24)
  );
}
