'use client';

import { createContext, useContext, useState } from 'react';
import { Crypto } from '@/utils';
import { atomWithStorage } from 'jotai/utils';
import { atom, useAtomValue, useSetAtom } from 'jotai/index';

export type CryptoState = 'unsafe' | 'safe' | 'expired';
type CryptoContext = {
  state: CryptoState;
  crypto: Crypto;
  updateKey: (key: string, ttl?: number) => void;
};

const keyAtom = atomWithStorage<string | undefined>(
  'lb-key',
  undefined,
  undefined,
  {
    getOnInit: true,
  }
);
const activeKeyAtom = atom<string | undefined>((get) => {
  const encrypted = get(keyAtom);
  if (!encrypted) return;

  const crypto = new Crypto();
  return crypto.decrypt(encrypted);
});

const Context = createContext({
  state: 'unsafe',
  crypto: new Crypto(),
} as CryptoContext);

export function CryptoProvider({ children }: { children: React.ReactNode }) {
  const key = useAtomValue(activeKeyAtom);
  const setKey = useSetAtom(keyAtom);

  const [crypto, setCrypto] = useState(new Crypto(key));

  const value: CryptoContext = {
    state: key ? 'safe' : 'unsafe',
    crypto,
    updateKey: (key: string, ttl?: number) => {
      // TODO: encrypt the key as a JWT token and store it in the local storage.
      const crypto = new Crypto();
      setKey(crypto.encrypt(key));
      setCrypto(new Crypto(key));
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCrypto() {
  return useContext(Context);
}
