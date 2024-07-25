import { Portal } from '@/providers/portal/portal';

// TODO: Extract the correct Game Interface to use it as the T=type.
export type Realm = Awaited<
  ReturnType<Portal['account']['game']['all']>
>[number];

export type RealmInfo = {
  id: string; // Game->Account->Name
  name: string; // URL path
  description: string;
  image: string;
  next?: string;
};

export type RealmsContext<T = Realm> = {
  next: RealmInfo;
  active: T | null;
  realms: T[];
  activate: (id: string) => Promise<void>;
};

export const RealmsMap: Record<string, RealmInfo> = {
  coin: {
    id: 'coin',
    name: 'coins',
    description:
      'Coin is the default realm. It is the most common realm and is used for most transactions.',
    image: '/images/realms/coin.png',
    next: 'dice',
  },
  dice: {
    id: 'dice',
    name: 'dices',
    description:
      'Dice is the second realm. It is used for gambling and games of chance.',
    image: '/images/realms/dice.png',
    next: 'card',
  },
  card: {
    id: 'card',
    name: 'cards',
    description:
      'Card is the third realm. It is used for card games and other games of skill.',
    image: '/images/realms/card.png',
    next: 'slot',
  },
  slot: {
    id: 'slot',
    name: 'slots',
    description:
      'Slot is the fourth realm. It is used for slot machines and other games of chance.',
    image: '/images/realms/slot.png',
    next: 'roulette',
  },
  roulette: {
    id: 'roulette',
    name: 'roulette',
    description:
      'Roulette is the fifth realm. It is used for roulette and other games of chance.',
    image: '/images/realms/roulette.png',
  },
};
