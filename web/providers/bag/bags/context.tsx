'use client';

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { PublicKey } from '@solana/web3.js';
import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai/index';
import { useAtomValue, useSetAtom } from 'jotai';
import { Crypto, legacyDecryptBag } from '@/utils';

import type {
  BagKey,
  LuckyBag,
  LuckyBags,
  LuckyBagState,
  EncryptedLuckyBag,
  LuckyBagProviderContext,
} from '@/adapters';

import { decryptBag, encryptBag, getKey } from '@/utils';
import { CryptoProvider, useCrypto } from './crypto';

const defaultBags = {} as LuckyBags;
const bagsAtom = atomWithStorage<LuckyBags>('elb', defaultBags, undefined, {
  getOnInit: true,
});
const bagAtom = atomWithStorage<BagKey | null>('elb-active', null, undefined, {
  getOnInit: true,
});

const availableBagsAtom = atom<LuckyBags>((get) => get(bagsAtom));
const activeBagAtom = atom<BagKey | null>((get) => get(bagAtom));

const Context = createContext({
  state: 'empty',
} as LuckyBagProviderContext);

function Provider({ children }: PropsWithChildren) {
  const { crypto, updateKey, clearKey } = useCrypto();
  const bags = useAtomValue(availableBagsAtom);
  const active = useAtomValue(activeBagAtom);
  const setBags = useSetAtom(bagsAtom);
  const setActive = useSetAtom(bagAtom);

  // TODO: Remove this in 5 versions TOP.
  function migrateBagDecryption(
    bag: string | EncryptedLuckyBag,
    crypto: Crypto
  ) {
    if (typeof bag !== 'string') return;

    const decrypted = legacyDecryptBag(bag, crypto);
    setTimeout(
      () =>
        setBags((prev) => ({
          ...prev,
          [getKey(decrypted.kp.publicKey)]: encryptBag(decrypted, crypto),
        })),
      500
    );
    return decrypted;
  }

  const getBag = useCallback(
    (luckyKey: PublicKey | string) => {
      const bag = bags[getKey(luckyKey)];
      if (!bag) throw new Error('Bag does not exist');

      try {
        const _bag = migrateBagDecryption(bag, crypto);
        if (_bag) return _bag;

        return decryptBag(bag, crypto);
      } catch (e) {
        return null;
      }
    },
    [bags, crypto]
  );

  const [bag, setBag] = useState(() => (active ? getBag(active) : null));
  const [state, setState] = useState<LuckyBagState>(() =>
    bag
      ? 'unlocked'
      : Object.keys(bags).length
      ? active
        ? 'locked'
        : 'idle'
      : 'empty'
  );
  const openBag = useCallback(
    (luckyKey?: PublicKey | string) => {
      const key = luckyKey ? getKey(luckyKey) : active;
      if (!key || !bags[key]) return null;

      if (key !== active) setActive(key);
      return getBag(key);
    },
    [active, bags, getBag]
  );

  const addBag = useCallback(
    (bag: LuckyBag) => {
      const key = getKey(bag.kp.publicKey);
      if (bags[key]) return bag;

      setBags((prev) => ({ ...prev, [key]: encryptBag(bag, crypto) }));
      setBag(bag);
      setActive(key);

      return bag;
    },
    [bags, crypto]
  );

  const deleteBag = useCallback(
    (luckyKey: PublicKey | string) => {
      const key = getKey(luckyKey);
      if (!bags[key]) return false;

      if (key === active) {
        setBag(null);
        setActive(null);
      }

      setBags((prev) => {
        const { [key]: _, ...bags } = prev;
        return bags;
      });

      return true;
    },
    [active, bags]
  );

  const setBagKey = useCallback(
    (key: string, ttl?: number) => {
      if (!active || !bags[active]) throw new Error('Bag does not exist');

      try {
        const newCrypto = new Crypto(key);
        const bag = bags[active];

        const _bag = migrateBagDecryption(bag, newCrypto);
        if (_bag) return true;

        decryptBag(bag, newCrypto);
        updateKey(key, ttl);
        return true;
      } catch (e) {
        return false;
      }
    },
    [active, bags]
  );

  const updateBagsKey = useCallback(
    (newKey: string, prevKey?: string, ttl?: number, name?: string) => {
      const keys = Object.keys(bags);
      if (!keys.length) return;

      const newCrypto = new Crypto(newKey);
      const prevCrypto = new Crypto(prevKey);

      const encryptedBags = Object.fromEntries(
        keys.map((key) => {
          const bag = bags[key];
          if (name && key === active) bag.name = name;

          try {
            return [key, encryptBag(decryptBag(bag, prevCrypto), newCrypto)];
          } catch (e) {
            return [key, bag];
          }
        })
      );

      setBags(encryptedBags);
      updateKey(newKey, ttl);
    },
    [bags, crypto]
  );

  useEffect(() => {
    if (!active && (!bag || bag.kp.publicKey.toString() !== active)) return;
    const id = setTimeout(() => {
      setBag(getBag(active));
    });

    return () => clearTimeout(id);
  }, [active]);

  useEffect(() => {
    setState(() => {
      if (!Object.keys(bags).length) return 'empty';
      if (bag) return 'unlocked';
      return 'locked';
    });
  }, [bag]);

  const value: LuckyBagProviderContext = {
    bags,
    state,

    active,
    bag,
    get name() {
      if (bag) return bag.name;
      if (active) return bags[active]?.name;
    },

    openBag,
    closeBag: (clean = false) => {
      if (clean) clearKey();
      setBag(null);
      setActive(null);
    },

    getBag,
    addBag,
    deleteBag,

    setBagKey,
    updateBagsKey,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function LuckyBagsProvider({ children }: PropsWithChildren) {
  return (
    <CryptoProvider>
      <Provider>{children}</Provider>
    </CryptoProvider>
  );
}

export function useLuckyBags() {
  return useContext(Context);
}

export { useCrypto };
