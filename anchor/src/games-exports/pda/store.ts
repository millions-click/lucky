import { type Cluster, PublicKey } from '@solana/web3.js';
import { getGamesProgramId, STORE_SEED } from '..';

export function getStorePDA(
  trader: PublicKey,
  feed: PublicKey,
  cluster?: Cluster
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(STORE_SEED, 'utf8'), trader.toBytes(), feed.toBytes()],
    getGamesProgramId(cluster)
  )[0];
}
