import { PublicKey } from '@solana/web3.js';

import type { TokensContext, TokenAccount } from '@/providers/tokens/tokens';

export type GemsContext = {
  owner: PublicKey;

  gem: TokenAccount | null;
  gems: TokenAccount[];

  select: (gem: PublicKey) => Promise<void>;
  getGem: TokensContext['getAccount'];

  refresh: () => void;
};

export { TokenAccount };
