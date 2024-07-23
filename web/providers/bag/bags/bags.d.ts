import { Crypto } from '@/utils';

export type CryptoState = 'unsafe' | 'safe' | 'expired';
export type CryptoContext = {
  state: CryptoState;
  crypto: Crypto;
  updateKey: (key: string, ttl?: number) => void;
  clearKey: () => void;
};
