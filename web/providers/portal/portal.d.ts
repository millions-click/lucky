import { PublicKey } from '@solana/web3.js';

import { getGamesProgram } from '@luckyland/anchor';
import type { Cluster } from '@/providers';

export type Portal = ReturnType<typeof getGamesProgram>;
export type PortalContext = {
  cluster: Cluster;

  portalId: PublicKey;
  portal: Portal;
};

export type Bounty = Awaited<ReturnType<Portal['account']['bounty']['fetch']>>;
export type GameMode = Awaited<
  ReturnType<Portal['account']['gameMode']['fetch']>
>;
export type GameAccount = Awaited<
  ReturnType<Portal['account']['game']['fetch']>
>;
export type Player = Awaited<ReturnType<Portal['account']['player']['fetch']>>;
