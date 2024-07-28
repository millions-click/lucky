import type { Bounty, GameAccount, GameMode } from '@/providers/types.d';
import { PublicKey } from '@solana/web3.js';

type PDA = string; // PublicKey;

export type Bounties = Record<PDA, Bounty & { pda: PublicKey }>;
export type Game = GameMode & {
  pda: PublicKey;
  bounties: Bounties;
  probability: number;
};

export type Games = Record<PDA, Game>;
export type Realm = GameAccount & {
  pda: PublicKey;
  games: Games;
};

export type Realms = Record<PDA, Realm>;

type RealmId = Realm['name'];
export type RealmInfo = {
  id: RealmId; // Game->Account->Name
  name: string; // URL path
  image: string;
  next?: string;
};

export type RealmsContext = {
  id?: RealmId;
  next: RealmInfo;
  active: Realm | null;
  realms: Realms;
  activate: (id: string) => void;
};

export const RealmsMap: Record<string, RealmInfo> = {
  coin: {
    id: 'coin',
    name: 'coins',
    image: '/images/realms/coin.png',
    next: 'dice',
  },
  dice: {
    id: 'dice',
    name: 'dices',
    image: '/images/realms/dice.png',
    next: 'card',
  },
  card: {
    id: 'card',
    name: 'cards',
    image: '/images/realms/card.png',
    next: 'slot',
  },
  slot: {
    id: 'slot',
    name: 'slots',
    image: '/images/realms/slot.png',
    next: 'roulette',
  },
  roulette: {
    id: 'roulette',
    name: 'roulette',
    image: '/images/realms/roulette.png',
  },
};
