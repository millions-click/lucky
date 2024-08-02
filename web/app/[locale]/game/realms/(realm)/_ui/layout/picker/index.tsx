import { useMemo } from 'react';
import { type Cluster } from '@solana/web3.js';

import { type GameCardProps, GameCard } from './GameCard';

import type { Game, Realm } from '@/providers/types.d';
import { useBounties, useCluster } from '@/providers';
import { getBountyPDA, getBountyVaultPDA } from '@luckyland/anchor';
import { sortedGames } from '@/models';
import { useTranslations } from 'next-intl';

type GamePickerProps = Pick<
  GameCardProps,
  'player' | 'gem' | 'trader' | 'onSelect'
> & {
  realm: Realm;
  active: Game;
};

export function GamePicker({
  realm,
  active,
  player,
  gem,
  trader,
  onSelect,
}: GamePickerProps) {
  const t = useTranslations('Components.GamePicker');
  const { cluster } = useCluster();
  const { getBounty } = useBounties();

  const games = useMemo(
    () =>
      sortedGames(realm.games).map((game) => {
        const bountyPDA = getBountyPDA(
          game.pda,
          gem.mint,
          trader.mint,
          cluster.network as Cluster
        );
        const vaultPDA = getBountyVaultPDA(
          bountyPDA,
          cluster.network as Cluster
        );
        const vault = getBounty(vaultPDA);
        if (!vault)
          throw new Error(
            `No vault found for bounty => game-mode:${game.pda} | gem:${gem.mint} | trader:${trader.mint}`
          ); // This could only happen if the bounty wasn't funded yet.

        return {
          ...game,
          bounty: game.bounties[bountyPDA.toString()],
          vault,
        };
      }),
    [realm.games, gem, trader, cluster.network]
  );

  return (
    <div className="bg-base-300/80 text-base-content min-h-full w-80 flex flex-col">
      <h1 className="text-3xl text-center my-4">{t('title')}</h1>
      <ul className="space-y-8 p-4 flex-1">
        {games.map((game, i) => (
          <GameCard
            key={i}
            game={game}
            player={player}
            selected={active.pda.equals(game.pda)}
            gem={gem}
            trader={trader}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}
