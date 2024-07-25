import { PublicKey } from '@solana/web3.js';

import { getGamesProgram } from '@luckyland/anchor';
import type { Cluster } from '@/providers';

export type Portal = ReturnType<typeof getGamesProgram>;
export type PortalContext = {
  cluster: Cluster;

  portalId: PublicKey;
  portal: Portal;
};
