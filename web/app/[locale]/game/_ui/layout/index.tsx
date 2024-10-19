'use client';

import { PropsWithChildren } from 'react';

import { Header } from './Header';
import { useGameBackground, LuckyBagProvider } from '@/providers';

export function GameLayout({ children }: PropsWithChildren) {
  const { bg, className: bgClassName } = useGameBackground();

  const className = [
    'hero min-h-screen w-full container mx-auto',
    'bg-cover bg-center bg-no-repeat',
    bgClassName,
  ].join(' ');

  return (
    <LuckyBagProvider>
      <Header />
      <main
        className={className}
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        {children}
      </main>
    </LuckyBagProvider>
  );
}
