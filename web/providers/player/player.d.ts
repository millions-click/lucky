import { PublicKey } from '@solana/web3.js';
import { TokensContext } from '@/providers/tokens/tokens';

type BagType = 'lucky-bag' | 'external' | 'none';
export type PlayerContext = Pick<TokensContext, 'tokens' | 'getAccount'> & {
  player: PublicKey | null;
  bagType: BagType;

  balance: number;
  roundFee: bigint;
  refresh: (onlyBalance?: boolean) => Promise<void>;

  createTokenAccount: TokensContext['create'];
  disconnect: () => void;
};
