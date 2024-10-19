import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

import type { EncryptedLuckyBag, LuckyBag } from './LuckyWallet.d';

import { Crypto } from '@/utils';

export const getKey = (luckyKey: PublicKey | string) =>
  typeof luckyKey === 'string' ? luckyKey : luckyKey.toString();

export const encryptBag = (
  bag: LuckyBag,
  crypto: Crypto
): EncryptedLuckyBag => {
  return {
    ...bag,
    kp: crypto.encrypt(bs58.encode(bag.kp.secretKey)),
  };
};

// TODO: Remove this in 5 versions TOP.
export const legacyDecryptBag = (
  encrypted: string,
  crypto: Crypto
): LuckyBag => {
  const _ = crypto.decrypt(encrypted);
  const { name, kp } = JSON.parse(_);
  return { name, kp: Keypair.fromSecretKey(Buffer.from(kp, 'base64')) };
};

export const decryptBag = (
  encrypted: EncryptedLuckyBag,
  crypto: Crypto
): LuckyBag => {
  const { kp, ...bag } = encrypted;

  return {
    ...bag,
    kp: Keypair.fromSecretKey(bs58.decode(crypto.decrypt(kp))),
  };
};
