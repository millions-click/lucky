import type { PropsWithChildren } from 'react';

import type { LuckyPassSession } from '@/actions/types.d';
import type { Countdown } from '@/providers';

export type LuckyPassState = 'idle' | 'active' | 'saved';
export type LuckyPassContext = {
  state: LuckyPassState;
  pass: LuckyPassSession;
  countdown: Countdown;

  save: () => Promise<string>;
  activate: (bag: string) => Promise<void>;
  redeem: () => Promise<void>;
};

export type LuckyPassProviderProps = PropsWithChildren<{
  session: LuckyPassSession;
}>;
