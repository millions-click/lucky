import type {
  Bounty,
  Game,
  Player,
  RealmId,
  TokenAccount,
} from '@/providers/types.d';

export type GameState =
  | 'idle'
  | 'loading'
  | 'newbie'
  | 'winner'
  | 'loser'
  | 'not-enough-ammo';

export type GameContext = {
  id?: RealmId;
  state: GameState;
  game: Game;
  bounty: Bounty;

  player: Player;
  ammo: TokenAccount | null;
  bag: TokenAccount | null;
  vault: TokenAccount | null;

  playRound: (choices: Array<number>) => Promise<string>;
};
