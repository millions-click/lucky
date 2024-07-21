'use client';

import { PropsWithChildren } from 'react';

import {
  CryptoProvider,
  LuckyBagsProvider,
  LuckyBagProvider,
  Background,
} from '@/providers';
import { StoreChatController } from '@/app/[locale]/game/store/_ui';

const bg = 'store.webp';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <CryptoProvider>
      <LuckyBagsProvider>
        <LuckyBagProvider>
          <Background name={bg} />
          <div className="max-w-md bg-base-300/20 p-8">{children}</div>
          <StoreChatController />
        </LuckyBagProvider>
      </LuckyBagsProvider>
    </CryptoProvider>
  );
}
