import type {
  RealmId,
  Realm,
  Game,
  Bounty,
  Player,
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
  realm: Realm | null;
  state: GameState;
  game: Game | null;
  bounty: Bounty | null;

  player: Player | null;
  ammo: TokenAccount | null;
  bag: TokenAccount | null;
  vault: TokenAccount | null;

  playRound: (choices: Array<number>) => Promise<string>;
  setActive: (pda: string) => void;
};
