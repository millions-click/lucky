import { PublicKey } from '@solana/web3.js';
import type { TokensContext } from '@/providers/tokens/tokens';

type BagType = 'lucky-bag' | 'external' | 'none';
export type CreateTokenAccountResult = {
  signature: string;
  mint: PublicKey;
  address: PublicKey;
};

export type PlayerContext = Pick<TokensContext, 'tokens' | 'getAccount'> & {
  player: PublicKey | null;
  bagType: BagType;

  balance: number;
  roundFee: bigint;
  refresh: (onlyBalance?: boolean) => Promise<void>;

  createTokenAccount: (mint: PublicKey) => Promise<CreateTokenAccountResult>;
  disconnect: () => void;
};
