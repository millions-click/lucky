import { PublicKey } from '@solana/web3.js';
import { TokensContext } from '@/providers/tokens/tokens';

type BagType = 'lucky-bag' | 'external' | 'none';
export type PlayerContext = Pick<
  TokensContext,
  'tokens' | 'refresh' | 'getAccount'
> & {
  player: PublicKey | null;
  bagType: BagType;
  disconnect: () => void;
  balance: number;
  createTokenAccount: TokensContext['create'];
};
