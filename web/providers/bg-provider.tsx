'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const defaultPath = `/assets/images/bg/`;
const defaultBg = 'loading.webp';

type GameBackground = {
  bg: string;
  name: string;
  setImage: (name: string) => void;
  path: string;
  updatePath: (path: string) => void;
};

const Context = createContext<GameBackground>({
  path: defaultPath,
  name: defaultBg,
  bg: `${defaultPath}${defaultBg}`,
} as GameBackground);

export function useGameBackground() {
  return useContext(Context);
}

export function BgProvider({ children }: { children: React.ReactNode }) {
  const [name, setImage] = useState(defaultBg);
  const [path, updatePath] = useState(defaultPath);

  const value: GameBackground = {
    name,
    setImage,
    path,
    updatePath,
    get bg() {
      return `${path}${name}`;
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function Background({ name }: { name: string }) {
  const { setImage } = useGameBackground();

  useEffect(() => {
    setImage(name);
  }, [name]);

  return null;
}
