'use client';

import { PropsWithChildren } from 'react';

import { Background } from '@/providers';
import { LobbyChatController } from './_ui';

const bg = 'lobby.jpeg';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Background name={bg} className="bg-left-bottom" />
      <div className="max-w-md bg-base-300/20 p-8">{children}</div>
      <LobbyChatController />
    </>
  );
}
