import type {
  RealmId,
  Realm,
  Game,
  Bounty,
  Player,
  TokenAccount,
  RealmInfo,
} from '@/providers/types.d';
import { PublicKey } from '@solana/web3.js';

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
  details?: RealmInfo;

  state: GameState;
  game: Game | null;
  bounty: Bounty | null;

  player: (Player & { pda: PublicKey }) | null;
  ammo: TokenAccount | null;
  bag: TokenAccount | null;
  vault: TokenAccount | null;

  playRound: (choices: Array<number>) => Promise<string>;
  setActive: (pda: string) => void;
};
