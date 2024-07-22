import { PublicKey } from '@solana/web3.js';
import type { TokenAccount } from '@/hooks';

type CreateTokenAccountResult = {
  signature: string;
  mint: PublicKey;
  address: PublicKey;
};
export type TokensContext = {
  owner: PublicKey;

  tokens: TokenAccount[];
  mints: Record<string, TokenAccount>;

  getAccount: (mint: PublicKey) => TokenAccount | null;
  create: (mint: PublicKey) => Promise<CreateTokenAccountResult>;

  refresh: () => Promise<void>;
};

export { TokenAccount };
