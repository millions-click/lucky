import { Token } from '@utils/token';
import { PublicKey } from '@solana/web3.js';

export interface TokenAccount extends Token {
  address: string;
  amount: number;
  balance: bigint;
  publicKey: PublicKey;
}
