import { Keypair, PublicKey } from '@solana/web3.js';

export type LuckyBag = { name: string; kp: Keypair };
export type EncryptedBag = string; // base64 encoded encrypted bag.
export type BagKey = string; // PublicKey.toString()
export type LuckyBags = Record<BagKey, EncryptedBag>;
export type LuckyBagState = 'empty' | 'idle' | 'locked' | 'unlocked';

export interface LuckyBagProviderContext {
  active: BagKey | null;
  bags: LuckyBags;
  state: LuckyBagState;
  bag: LuckyBag | null;
  openBag: (luckyKey?: PublicKey | string) => LuckyBag | null;
  getBag: (luckyKey: PublicKey | string) => LuckyBag | null;
  addBag: (bag: LuckyBag) => LuckyBag;
  deleteBag: (luckyKey: PublicKey | string) => boolean;
  setBagKey: (key: string, ttl?: number) => boolean;
  updateBagsKey: (newKey: string, prevKey?: string, ttl?: number) => void;
  closeBag: (clean?: boolean) => void;
}
