import { Round } from '@chainlink/solana-sdk';

export type StoredRound = Omit<Round, 'answer'> & { answer: number };
export type Feeds = Record<string, StoredRound>;
export type FeedContext = StoredRound & { decimals: number };
