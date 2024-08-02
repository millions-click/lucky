import { PublicKey } from '@solana/web3.js';
import type { TokenAccount } from '@/hooks';

export type TokensContext = {
  owner: PublicKey;

  tokens: TokenAccount[];
  mints: Record<string, TokenAccount>;

  getAccount: (mint: PublicKey) => TokenAccount | null;

  refresh: () => Promise<void>;
};

export { TokenAccount };
