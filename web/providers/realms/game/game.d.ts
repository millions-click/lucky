import type { Portal, TokenAccount } from '@/providers/types.d';

export type Mode = Awaited<ReturnType<Portal['account']['gameMode']['fetch']>>;
export type Bounty = Awaited<ReturnType<Portal['account']['bounty']['fetch']>>;
export type Player = Awaited<ReturnType<Portal['account']['player']['fetch']>>;

export type GameContext = {
  mode: Mode;
  bounty: Bounty;

  player: Player;
  ammo: TokenAccount | null;
  bag: TokenAccount | null;

  playRound: (choices: Array<number>) => Promise<string>;
};
