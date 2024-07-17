import { Keypair, PublicKey } from '@solana/web3.js';

export type LuckyBag = { name: string; kp: Keypair };
export type EncryptedLuckyBag = Omit<LuckyBag, 'kp'> & { kp: string };
export type BagKey = string; // PublicKey.toString()
export type LuckyBags = Record<BagKey, EncryptedLuckyBag>;
export type LuckyBagState = 'empty' | 'idle' | 'locked' | 'unlocked';

export interface LuckyBagProviderContext {
  bags: LuckyBags;
  state: LuckyBagState;

  active: BagKey | null;
  bag: LuckyBag | null;
  name?: string;

  openBag: (luckyKey?: PublicKey | string) => LuckyBag | null;
  closeBag: (clean?: boolean) => void;

  getBag: (luckyKey: PublicKey | string) => LuckyBag | null;
  addBag: (bag: LuckyBag) => LuckyBag;
  deleteBag: (luckyKey: PublicKey | string) => boolean;

  setBagKey: (key: string, ttl?: number) => boolean;
  updateBagsKey: (
    newKey: string,
    prevKey?: string,
    ttl?: number,
    name?: string
  ) => void;
}
