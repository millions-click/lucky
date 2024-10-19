import { PublicKey } from '@solana/web3.js';

import { confirmAndLogTransaction, type Portal } from '../../utils';
import { type Games } from '../game';

import { type GameMode, getGameModePDA } from '@luckyland/anchor';
import type { Mode, Bounties } from '../../assets/games';

export type Modes = Array<
  Mode & {
    pda: PublicKey;
    name: string;
    bounties: Bounties;
  }
>;

export async function UpsertGameModes(
  portal: Portal,
  games: Games
): Promise<Modes> {
  console.log('------------------ Game Modes ------------------');

  const modes = await Promise.all(
    games.map((game) => {
      const { name, modes } = game;
      console.log(`Game Modes for: ${name}`);

      return Promise.all(
        modes.map(async ({ seeds: { seed }, mode, bounties }) => {
          const _mode = await upsertGameMode(game, seed, mode, portal);
          return { ..._mode, bounties: Object.values(bounties) };
        })
      );
    })
  );

  console.log('Game Modes upserted.');
  return modes.flat();
}

async function upsertGameMode(
  { pda: game, name, secret }: Games[number],
  seed: string,
  mode: GameMode,
  { portal, cluster }: Portal
) {
  const pda = getGameModePDA(game, seed, cluster.asCluster());

  const log = (() => {
    const id = pda.toString();
    return (...args: unknown[]) =>
      console.log(`GAME_MODE|${id}|${name.padStart(32, ' ')} =>\t`, ...args);
  })();

  log('Upserting...');
  log('Retrieving game mode details...');

  let gameMode = await portal.account.gameMode.fetchNullable(pda);
  const modeName = `${name}>${seed}>${mode.slots}x${mode.choices}`;

  if (gameMode) {
    log('Game mode already exists.');
    return { pda, ...gameMode, name: modeName };
  }

  log('Game mode not found. Creating...');
  const confirmOptions = { skipPreflight: true };
  const txHash = await portal.methods
    .addGameMode(seed, mode)
    .accounts({ secret })
    .rpc(confirmOptions);

  await confirmAndLogTransaction(txHash, portal.provider.connection, cluster);
  gameMode = await portal.account.gameMode.fetch(pda);
  log('Game mode created.');

  return { pda, gameMode, name: modeName };
}
