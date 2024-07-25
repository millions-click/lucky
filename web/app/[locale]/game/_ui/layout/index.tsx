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
      <div
        className={className}
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="hero-content text-neutral-content text-center">
          {children}
        </div>
      </div>
    </LuckyBagProvider>
  );
}
