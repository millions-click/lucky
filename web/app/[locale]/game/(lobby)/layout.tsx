'use client';

import { PropsWithChildren } from 'react';

import { CryptoProvider, LuckyBagsProvider, Background } from '@/providers';
import { LobbyChatController, Header } from './_ui';
import { CountdownProvider } from '@/providers/countdown';

const bg = 'lobby.jpeg';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <CryptoProvider>
      <LuckyBagsProvider>
        <CountdownProvider>
          <Header />
          <Background name={bg} className="bg-left-bottom" />
          <div className="max-w-md bg-base-300/20 p-8">{children}</div>
          <LobbyChatController />
        </CountdownProvider>
      </LuckyBagsProvider>
    </CryptoProvider>
  );
}
