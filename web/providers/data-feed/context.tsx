'use client';

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PublicKey } from '@solana/web3.js';
import { atomWithStorage } from 'jotai/utils';
import { atom, useAtomValue, useSetAtom } from 'jotai/index';

import {
  OCR2Feed,
  Round,
  CHAINLINK_AGGREGATOR_PROGRAM_ID,
} from '@chainlink/solana-sdk';

import {
  type FeedAddress,
  type StoredRound,
  type Feeds,
  type FeedContext,
  USD_SOL_FEED_ADDRESS,
  DECIMALS,
} from './constants';

import { useAnchorProvider } from '@/providers/solana-provider';
import { useCluster } from '@/components/cluster/cluster-data-access';

const feedsAtom = atomWithStorage<Feeds>('feeds', {}, undefined, {
  getOnInit: true,
});
const lastFeedsAtom = atom<Feeds>((get) => get(feedsAtom));

const DataFeedContext = createContext({} as FeedContext);
export const useDataFeed = () => useContext(DataFeedContext);

export function DataFeedProvider({ children }: PropsWithChildren) {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();

  const feeds = useAtomValue(lastFeedsAtom);
  const setFeeds = useSetAtom(feedsAtom);

  const [dataFeed, setDataFeed] = useState<OCR2Feed | null>(null);
  const [feedAddress, setFeedAddress] = useState<PublicKey>(
    USD_SOL_FEED_ADDRESS[cluster.network as FeedAddress]
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const feed = USD_SOL_FEED_ADDRESS[cluster.network as FeedAddress];
    if (!feed) return;

    setDataFeed(null);
    setFeedAddress(feed);
  }, [cluster.network]);

  useEffect(() => {
    if (dataFeed) return;

    const timeout = setTimeout(async () => {
      try {
        const feed = await OCR2Feed.load(
          CHAINLINK_AGGREGATOR_PROGRAM_ID,
          provider
        );
        setDataFeed(feed);
        setInterval(() => setTick((tick) => tick + 1), 30000);
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [provider]);

  useEffect(() => {
    if (!dataFeed) return;
    let listener: number;

    const timeout = setTimeout(async () => {
      const setAndRemove = ({ answer, ...rest }: Round) => {
        const round = { ...rest, answer: answer.toNumber() } as StoredRound;
        setFeeds((feeds) => ({
          ...feeds,
          [feedAddress.toString()]: round,
        }));
        return dataFeed.removeListener(listener);
      };
      listener = dataFeed.onRound(feedAddress, setAndRemove);
    }, 100);

    return () => clearTimeout(timeout);
  }, [dataFeed, feedAddress, tick]);

  return (
    <DataFeedContext.Provider
      value={{
        ...feeds[feedAddress.toString()],
        decimals: DECIMALS,
      }}
    >
      {children}
    </DataFeedContext.Provider>
  );
}
