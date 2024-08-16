import { PublicKey } from '@solana/web3.js';

import { type Portal, confirmAndLogTransaction } from '../../utils';
import { type Game, type Modes, loadGames } from './loader';

import { getGamePDA } from '@luckyland/anchor';

export type Games = Array<
  Game & {
    pda: string;
    modes: Modes;
  }
>;
type IGame = ReturnType<typeof loadGames>[number]['game'];

export async function InitGames(portal: Portal): Promise<Games> {
  console.log('------------------ Games ------------------');
  console.log('Initializing games...');

  const games = await Promise.all(
    loadGames().map(async ({ seeds: { secret }, game, modes }) => {
      console.log(`Game: ${game.name}`);
      const _game = await initGame(game, secret, portal);
      return { ..._game, modes: Object.values(modes) };
    })
  );

  console.log('Games initialized.');
  return games;
}

async function initGame(_game: IGame, secret: string | PublicKey, _: Portal) {
  if (typeof secret === 'string')
    return initGame(_game, new PublicKey(secret), _);

  const { name, state } = _game;
  const { portal, authority, cluster } = _;
  const owner = authority.publicKey;
  const pda = getGamePDA(owner, secret, cluster.asCluster());

  const log = (() => {
    const id = pda.toString();
    return (...args: unknown[]) =>
      console.log(`GAME|${id}|${name.padStart(32, ' ')} =>\t`, ...args);
  })();

  log('Initializing...');
  log('Retrieving game details...');

  let game = await portal.account.game.fetchNullable(pda);
  if (game) {
    log('Game already exists.');
    return { pda, secret, ...game };
  }

  log('Game not found. Creating...');
  const confirmOptions = { skipPreflight: true };
  const txHash = await portal.methods
    .createGame(name)
    .accounts({ secret })
    .rpc(confirmOptions);

  await confirmAndLogTransaction(txHash, portal.provider.connection, cluster);
  game = await portal.account.game.fetch(pda);
  log('Game created.');

  if ('active' in state) {
    log('Activating game...');
    await portal.methods
      .activateGame()
      .accounts({ secret })
      .rpc(confirmOptions);
    log('Game activated.');
  }

  return { pda, secret, ...game };
}
