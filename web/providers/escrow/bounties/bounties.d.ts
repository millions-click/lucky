import { PublicKey } from '@solana/web3.js';

import type { TokensContext, TokenAccount } from '@/providers/tokens/tokens';

export type BountiesContext = {
  owner: PublicKey;

  bounties: TokenAccount[];
  getBounty: TokensContext['getAccount'];

  refresh: () => void;
};

export { TokenAccount };
