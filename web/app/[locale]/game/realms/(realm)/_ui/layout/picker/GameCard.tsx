import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  IconBuildingBank,
  IconNotebook,
  IconPokerChip,
  IconTrophy,
} from '@tabler/icons-react';

import type { Bounty, Game, Player, TokenAccount } from '@/providers/types.d';
import type { Token } from '@utils/token';
import { fromBN } from '@luckyland/anchor';
import { Badge } from '@/ui/bag';
import { ExplorerWrapper } from '@/components/cluster/cluster-ui';
import { PublicKey } from '@solana/web3.js';
import { PropsWithChildren } from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'standard',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
});

type BountyProps = {
  game: Game & { bounty: Bounty; vault: TokenAccount };
  gem: Token;
  trader: Token;
};
function Bounty({
  game,
  gem,
  trader,
  children,
}: PropsWithChildren<BountyProps>) {
  const t = useTranslations('Components.GamePicker.Card.bounty');

  return (
    <>
      <div className="tooltip tooltip-primary" data-tip={t('vault')}>
        <Badge icon="gem" size="sm" glow={false}>
          <span className="text-sm">{formatter.format(game.vault.amount)}</span>
        </Badge>
      </div>
      {children}
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
    </>
  );
}

type GameModeProps = {
  game: Game;
};
function GameMode({ game }: GameModeProps) {
  const t = useTranslations('Components.GamePicker.Card.game');

  return (
    <div className="badge badge-outline uppercase badge-info py-4 text-xl my-2">
      <span
        className="mr-2 tooltip tooltip-left tooltip-info"
        data-tip={t(`${game.pickWinner ? 'pick' : 'house'}`)}
      >
        {game.pickWinner ? <IconPokerChip /> : <IconBuildingBank />}
      </span>
      <div className="space-x-2 select-none">
        <span className="tooltip tooltip-info z-10" data-tip={t('slots')}>
          {game.slots}
        </span>
        <span>x</span>
        <span className="tooltip tooltip-info" data-tip={t('choices')}>
          {game.choices}
        </span>
      </div>
      <span
        className="ml-2 tooltip tooltip-right tooltip-info"
        data-tip={t(
          `${game.pickWinner || !game.winnerChoice ? 'any' : 'winner'}`,
          { choice: game.winnerChoice }
        )}
      >
        <IconTrophy />
      </span>
    </div>
  );
}

type PlayerStatsProps = BountyProps & {
  player: (Player & { pda: PublicKey }) | null;
};

function PlayerStats({ player, gem, trader, game }: PlayerStatsProps) {
  const t = useTranslations('Components.GamePicker.Card.stats');

  return (
    <figure className="relative">
      <div className="absolute backdrop-blur bg-base-300/10 w-full h-full flex flex-col py-4 px-2">
        {player ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-green-400">
            <h1 className="text-2xl font-bold text-center">{t('title')}</h1>
            <div className="flex flex-wrap justify-around gap-2">
              <div className="tooltip tooltip-info" data-tip={t('gem')}>
                <Badge icon="gem" size="xs" glow={false}>
                  <span className="pl-1 text-sm">
                    {formatter.format(
                      player.winningCount *
                        fromBN(game.bounty.reward, gem.decimals)
                    )}
                  </span>
                </Badge>
              </div>
              <div className="tooltip tooltip-warning" data-tip={t('ammo')}>
                <Badge icon="ammo" size="xs" glow={false}>
                  <span className="pl-1 text-sm">
                    {formatter.format(
                      player.rounds * fromBN(game.bounty.price, trader.decimals)
                    )}
                  </span>
                </Badge>
              </div>
              <div className="tooltip tooltip-warning" data-tip={t('dust')}>
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
                {`${t('wins')}: ${formatter.format(player.winningCount)}`}
              </span>

              <span className="badge badge-lg badge-error">
                {`${t('losses')}: ${formatter.format(
                  player.rounds - player.winningCount
                )}`}
              </span>

              <span
                className="badge badge-lg badge-primary tooltip tooltip-info z-10"
                data-tip={t('rate')}
              >
                {formatter.format((player.winningCount / player.rounds) * 100)}%
              </span>
            </div>
            <ExplorerWrapper
              path={`account/${player.pda}`}
              className="absolute flex right-2 top-2 btn btn-circle btn-sm btn-outline"
            >
              <span
                className="tooltip tooltip-info tooltip-left z-10"
                data-tip={t('account')}
              >
                <IconNotebook />
              </span>
            </ExplorerWrapper>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-black">
            <p className="text-center text-xl font-sans font-semibold">
              {t('no-data')}
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
  );
}

export type GameCardProps = PlayerStatsProps & {
  selected: boolean;
  game: Game & { vault: TokenAccount };
  onSelect: (pda: string) => void;
};

export function GameCard({
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
        <PlayerStats player={player} game={game} gem={gem} trader={trader} />
      )}
      <div className="card-body max-w-48 items-center">
        {selected && <h2 className="card-title mb-4">{t('title')}</h2>}
        <Bounty game={game} gem={gem} trader={trader}>
          <GameMode game={game} />
        </Bounty>
      </div>
    </li>
  );
}
