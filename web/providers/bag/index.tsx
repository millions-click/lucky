import { PropsWithChildren } from 'react';

import { LuckyBagsProvider } from './bags';
import { PlayerProvider } from '@/providers';

export function LuckyBagProvider({ children }: PropsWithChildren) {
  return (
    <LuckyBagsProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </LuckyBagsProvider>
  );
}

export * from './bags';
