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
export async function getTokenAccountCreationCost(
  accounts = 1
): Promise<bigint> {
  return BigInt(Math.round(ACCOUNT_COST * accounts));
}

const PLAYER_ACCOUNT_COST = 0.0018 * LAMPORTS_PER_SOL;
export async function getPlayerAccountCreationCost(
  accounts = 1
): Promise<bigint> {
  return BigInt(Math.round(PLAYER_ACCOUNT_COST * accounts));
}
