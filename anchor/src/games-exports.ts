// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import GamesIDL from '../target/idl/games.json';
import type { Games } from '../target/types/games';

// Re-export the generated IDL and type
export { Games, GamesIDL };

// The programId is imported from the program IDL.
export const GAMES_PROGRAM_ID = new PublicKey(GamesIDL.address);

// This is a helper function to get the Games Anchor program.
export function getGamesProgram(provider: AnchorProvider) {
  return new Program(GamesIDL as Games, provider);
}

// This is a helper function to get the program ID for the Games program depending on the cluster.
export function getGamesProgramId(cluster?: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return GAMES_PROGRAM_ID;
  }
}

export function getGamePDA(
  owner: PublicKey,
  secret: PublicKey,
  cluster?: Cluster
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(GAME_SEED, 'utf8'), owner.toBuffer(), secret.toBuffer()],
    getGamesProgramId(cluster)
  )[0];
}

const GAME_SEED = 'GAME_CONFIG';

export type GameSettings = {
  name?: Array<number>;
  slots: number;
  digits: number;
  choices: number;
  winnerChoice: number;
  pickWinner: boolean;
};
