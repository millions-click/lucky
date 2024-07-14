'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const defaultPath = `/assets/images/bg/`;
const defaultBg = 'loading.webp';

type GameBackground = {
  name: string;
  setImage: (name: string) => void;
  path: string;
  updatePath: (path: string) => void;

  bg: string;

  className?: string;
  setClassName: (className?: string) => void;
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
  const [className, setClassName] = useState<string>();

  const value: GameBackground = {
    name,
    setImage,

    path,
    updatePath,

    get bg() {
      return `${path}${name}`;
    },

    className,
    setClassName,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function Background({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { setImage, setClassName } = useGameBackground();

  useEffect(() => {
    setImage(name);
    setClassName(className);
  }, [name, className]);

  return null;
}
