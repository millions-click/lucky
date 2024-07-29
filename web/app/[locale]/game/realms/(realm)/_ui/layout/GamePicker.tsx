import { useMemo } from 'react';
import { type Cluster } from '@solana/web3.js';
import {
  IconBuildingBank,
  IconPokerChip,
  IconTrophy,
} from '@tabler/icons-react';

import type {
  Bounty,
  Game,
  Player,
  Realm,
  TokenAccount,
} from '@/providers/types.d';
import { useBounties, useCluster } from '@/providers';
import { fromBN, getBountyPDA, getBountyVaultPDA } from '@luckyland/anchor';
import type { Token } from '@utils/token';
import { sortedGames } from '@/models';
import { Badge } from '@/ui/bag';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'standard',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
});

type GameCardProps = {
  selected: boolean;
  player: Player | null;
  game: Game & {
    bounty: Bounty;
    vault: TokenAccount;
  };
  gem: Token;
  trader: Token;
  onSelect: (pda: string) => void;
};
function GameCard({
  game,
  gem,
  trader,
  player,
  selected,
  onSelect,
}: GameCardProps) {
  const t = useTranslations('Components.GamePicker.Card');

  return (
    <li
      className={`card w-72 cursor-pointer group ${
        selected
          ? 'bg-base-300 shadow-glow'
          : 'hover:shadow-glow glass card-compact'
      }`}
      onClick={() => !selected && onSelect(game.pda.toString())}
    >
      {selected && (
        <figure className="relative">
          <div className="absolute backdrop-blur bg-base-300/10 w-full h-full flex flex-col py-4 px-2">
            {player ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-green-400">
                <h1 className="text-2xl font-bold text-center">
                  {t('stats.title')}
                </h1>
                <div className="flex flex-wrap justify-around gap-2">
                  <div
                    className="tooltip tooltip-info"
                    data-tip={t('stats.gem')}
                  >
                    <Badge icon="gem" size="xs" glow={false}>
                      <span className="pl-1 text-sm">
                        {formatter.format(
                          player.winningCount *
                            fromBN(game.bounty.reward, gem.decimals)
                        )}
                      </span>
                    </Badge>
                  </div>
                  <div
                    className="tooltip tooltip-warning"
                    data-tip={t('stats.ammo')}
                  >
                    <Badge icon="ammo" size="xs" glow={false}>
                      <span className="pl-1 text-sm">
                        {formatter.format(
                          player.rounds *
                            fromBN(game.bounty.price, trader.decimals)
                        )}
                      </span>
                    </Badge>
                  </div>
                  <div
                    className="tooltip tooltip-warning"
                    data-tip={t('stats.dust')}
                  >
                    <Badge
                      icon="dust"
                      size="xs"
                      glow={false}
                      className="text-[#FFE9B0] bottom-0"
                    >
                      <span className="pl-1 text-sm">
                        {formatter.format(player.rounds)}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-around w-full">
                  <span className="badge badge-lg badge-success">
                    {`${t('stats.wins')}: ${formatter.format(
                      player.winningCount
                    )}`}
                  </span>

                  <span className="badge badge-lg badge-error">
                    {`${t('stats.losses')}: ${formatter.format(
                      player.rounds - player.winningCount
                    )}`}
                  </span>

                  <span
                    className="badge badge-lg badge-primary tooltip tooltip-info z-10"
                    data-tip={t('stats.rate')}
                  >
                    {formatter.format(
                      (player.winningCount / player.rounds) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 p-8 text-black">
                <p className="text-center text-xl font-sans font-semibold">
                  {t('stats.no-data')}
                </p>
              </div>
            )}
          </div>
          <Image
            src="/assets/images/pages/leaderboard.png"
            alt="player stats"
            className="w-full"
            width={512}
            height={512}
          />
        </figure>
      )}
      <div className="card-body max-w-48 items-center">
        {selected && <h2 className="card-title mb-4">{t('game.title')}</h2>}
        <div className="tooltip tooltip-primary" data-tip={t('bounty.vault')}>
          <Badge icon="gem" size="sm" glow={false}>
            <span className="text-sm">
              {formatter.format(game.vault.amount)}
            </span>
          </Badge>
        </div>
        <div className="badge badge-outline uppercase badge-info py-4 text-xl my-2">
          <span
            className="mr-2 tooltip tooltip-left tooltip-info"
            data-tip={t(`game.${game.pickWinner ? 'pick' : 'house'}`)}
          >
            {game.pickWinner ? <IconPokerChip /> : <IconBuildingBank />}
          </span>
          <div className="space-x-2 select-none">
            <span
              className="tooltip tooltip-info z-10"
              data-tip={t('game.slots')}
            >
              {game.slots}
            </span>
            <span>x</span>
            <span className="tooltip tooltip-info" data-tip={t('game.choices')}>
              {game.choices}
            </span>
          </div>
          <span
            className="ml-2 tooltip tooltip-right tooltip-info"
            data-tip={t(
              `game.${
                game.pickWinner || !game.winnerChoice ? 'any' : 'winner'
              }`,
              { choice: game.winnerChoice }
            )}
          >
            <IconTrophy />
          </span>
        </div>

        <div className="card-actions justify-end">
          <span
            className="tooltip tooltip-left tooltip-primary"
            data-tip={t('bounty.price')}
          >
            <Badge icon="ammo" size="xs" glow={false}>
              <span className="pl-1 text-sm">
                {formatter.format(fromBN(game.bounty.price, trader.decimals))}
              </span>
            </Badge>
          </span>

          <span
            className="tooltip tooltip-right tooltip-primary"
            data-tip={t('bounty.reward')}
          >
            <Badge icon="gem" size="xs" glow={false}>
              <span className="pl-1 text-sm">
                {formatter.format(fromBN(game.bounty.reward, gem.decimals))}
              </span>
            </Badge>
          </span>
        </div>
      </div>
    </li>
  );
}

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
