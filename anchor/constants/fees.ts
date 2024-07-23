import { type Cluster, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function getAvgTxFee(
  amount = 1,
  cluster?: Cluster
): Promise<bigint> {
  switch (cluster) {
    case 'mainnet-beta':
    case 'devnet':
    case 'testnet':
      return BigInt(Math.round(0.000025 * amount * LAMPORTS_PER_SOL));
    default:
      return BigInt(Math.round(0.000005 * amount * LAMPORTS_PER_SOL));
  }
}

const ACCOUNT_COST = 0.0025 * LAMPORTS_PER_SOL;
export async function getTokenAccountCreationCost(): Promise<bigint> {
  return BigInt(ACCOUNT_COST);
}
