import type { PropsWithChildren } from 'react';

import type { LuckyPassSession } from '@/actions/types.d';
import type { Countdown } from '@/providers/types.d';

export type LuckyPassState = 'idle' | 'active' | 'saved' | 'expired';
export type LuckyPassContext = {
  state: LuckyPassState;
  winner: boolean;
  pass: LuckyPassSession;
  countdown: { countdown: Countdown; state: LuckyPassState };

  save: () => Promise<string>;
  activate: (bag: string) => Promise<void>;
  redeem: () => Promise<void>;

  setWinner: (winner: boolean) => void;
};

export type LuckyPassProviderProps = PropsWithChildren<{
  session: LuckyPassSession;
}>;
