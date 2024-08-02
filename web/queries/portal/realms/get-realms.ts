import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { type Cluster } from '@solana/web3.js';

import type { Portal, Realms, Games, Bounties } from '@/providers/types.d';
import { getGameProb } from '@/models';

export function getRealmsOptions(portal: Portal, cluster: Cluster) {
  return queryOptions({
    queryKey: ['realms', { cluster }],
    queryFn: (): Promise<Realms> =>
      portal.account.game
        .all()
        .then((games) =>
          Object.fromEntries(
            games.map(({ account, publicKey }) => [
              publicKey,
              { ...account, pda: publicKey, games: {} },
            ])
          )
        ),
  });
}

type RealmsAndGames = { realms: Realms; games: Games };
export function getGameModesOptions(
  realms: Realms | null | undefined,
  portal: Portal,
  cluster: Cluster
) {
  const queryClient = useQueryClient();

  return queryOptions({
    queryKey: ['game-modes', { cluster }],
    queryFn: async (): Promise<RealmsAndGames> => {
      if (!realms || !Object.keys(realms).length)
        throw new Error('No realms found');

      const _games = {} as Games;
      const games = await portal.account.gameMode.all();
      games.forEach(({ account, publicKey }) => {
        const { game } = account;
        const parent = game.toString();

        if (!(parent in realms)) return; // This should be a 404 error

        const pda = publicKey.toString();
        const _game = {
          ...account,
          pda: publicKey,
          bounties: {},
          probability: getGameProb(account),
        };
        realms[parent].games[pda] = _games[pda] = _game;
      });

      queryClient.setQueryData(['realms', { cluster }], realms);
      return { realms, games: _games };
    },
    enabled: Boolean(realms && Object.keys(realms).length),
  });
}

export function getBountiesOptions(
  _realms: RealmsAndGames | null | undefined,
  portal: Portal,
  cluster: Cluster
) {
  const queryClient = useQueryClient();

  return queryOptions({
    queryKey: ['bounties', { cluster }],
    queryFn: async () => {
      if (!_realms || !Object.keys(_realms.games).length)
        throw new Error('No games found');

      const { games } = _realms;
      const _bounties = {} as Bounties;
      const bounties = await portal.account.bounty.all();
      bounties.forEach(({ account, publicKey }) => {
        const { task } = account;
        const parent = task.toString();

        if (!(parent in games)) return; // This should be a 404 error

        const pda = publicKey.toString();
        games[parent].bounties[pda] = _bounties[pda] = {
          ...account,
          pda: publicKey,
        };
      });

      queryClient.setQueryData(['realms', { cluster }], _realms.realms);
      return { ..._realms, bounties: _bounties };
    },
    enabled: Boolean(_realms && Object.keys(_realms.games).length),
  });
}
