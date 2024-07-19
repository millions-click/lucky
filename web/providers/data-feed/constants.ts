import { PublicKey } from '@solana/web3.js';
import { Round } from '@chainlink/solana-sdk';

export const DECIMALS = 8; // All Chainlink feeds have 8 decimals

export const USD_SOL_FEED_ADDRESS = {
  local: new PublicKey('99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR'),
  devnet: new PublicKey('99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR'),
  mainnet: new PublicKey('CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt'),
};

export type FeedAddress = keyof typeof USD_SOL_FEED_ADDRESS;

export type StoredRound = Omit<Round, 'answer'> & { answer: number };
export type Feeds = Record<string, StoredRound>;
export type FeedContext = StoredRound & { decimals: number };
