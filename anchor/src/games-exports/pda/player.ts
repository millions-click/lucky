import { type Cluster, PublicKey } from '@solana/web3.js';
import { getGamesProgramId, PLAYER_SEED } from '..';

export function getPlayerPDA(
  owner: PublicKey,
  mode: PublicKey,
  cluster?: Cluster
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PLAYER_SEED, 'utf8'), owner.toBytes(), mode.toBytes()],
    getGamesProgramId(cluster)
  )[0];
}
