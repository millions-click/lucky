import { PublicKey } from '@solana/web3.js';

import type { TokensContext, TokenAccount } from '@/providers/tokens/tokens';

export type TradersContext = {
  owner: PublicKey;

  trader: TokenAccount | null;
  traders: TokenAccount[];

  select: (trader: PublicKey) => Promise<void>;
  getTrader: TokensContext['getAccount'];

  refresh: () => void;
};
