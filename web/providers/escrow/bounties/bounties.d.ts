import { PublicKey } from '@solana/web3.js';

import type { TokenAccount } from '@/providers/tokens/tokens';

export type BountiesContext = {
  owner: PublicKey;

  bounties: TokenAccount[];
  getBounty: (pda: PublicKey) => TokenAccount | null;

  refresh: () => void;
};

export { TokenAccount };
