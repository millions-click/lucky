'use client';

import { PropsWithChildren } from 'react';

import { useGameBackground } from '@/providers';

export function GameLayout({ children }: PropsWithChildren) {
  const { bg, className: bgClassName } = useGameBackground();

  const className = [
    'hero min-h-screen w-full container mx-auto',
    'bg-cover bg-center bg-no-repeat',
    bgClassName,
  ].join(' ');

  return (
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
  );
}
