'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type GamePal = {
  id: string;
  name: string;
  avatar: string;
};

const PALS: Record<string, GamePal> = {
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    avatar: '/assets/avatars/lucky.png',
  },
  jessie: {
    id: 'jessie',
    name: 'Jessie',
    avatar: '/assets/avatars/jessie.png',
  },
  clover: {
    id: 'clover',
    name: 'Clover',
    avatar: '/assets/avatars/clover.webp',
  },
  emili: {
    id: 'emili',
    name: 'Emili',
    avatar: '/assets/avatars/emili.png',
  },
  mike: {
    id: 'mike',
    name: 'Mike',
    avatar: '/assets/avatars/mike.webp',
  },
};

export type GamePalId = keyof typeof PALS;
export type GamePalContext = {
  pal: GamePal;
  getPal: (id: GamePalId) => GamePal;
  setPal: (id: GamePalId) => void;
};

const Context = createContext({
  pal: PALS.lucky,
  getPal: (id: GamePalId) => PALS[id],
} as GamePalContext);

export function useGamePal(active?: GamePalId) {
  const context = useContext(Context);
  const { setPal } = context;

  useEffect(() => {
    if (active) setPal(active);
  }, [active, setPal]);

  return context;
}

type ProviderProps = PropsWithChildren<{ active?: GamePalId }>;
export function GamePalProvider({ children, active = 'lucky' }: ProviderProps) {
  // TODO: Load pals from server. Store active pal in local storage.
  const pals = useMemo(() => PALS, []);
  const [pal, setPal] = useState<GamePal>(() => pals[active]);

  const getPal = (id: GamePalId) => pals[id] || pal;
  const value = {
    pal,
    getPal,
    setPal: (id: GamePalId) => {
      if (!(id in pals)) throw new Error(`Unknown PAL. Invalid pal id: ${id}`);
      setPal(pals[id]);
    },
  } as GamePalContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
