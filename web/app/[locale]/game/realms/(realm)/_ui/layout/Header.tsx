'use client';

import { IconCategory } from '@tabler/icons-react';

import { GamePicker } from './picker';

import { useGame } from '@/providers';
import { Badge } from '@/ui/bag';
import { useTranslations } from 'next-intl';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
});

export function Header() {
  const t = useTranslations('Components');
  const { vault, realm, game, player, bag, ammo, setActive } = useGame();
  const gamePicker = realm && game && bag && ammo;

  return (
    <>
      <header className="fixed top-0 right-0 z-10 drawer drawer-end">
        <input id="game-picker" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-end justify-end pr-4 pt-11 space-y-4">
          {vault && (
            <Badge icon="gem" size="md">
              <span className="pointer-events-none select-none">
                {formatter.format(vault.amount)}
              </span>
            </Badge>
          )}
          {gamePicker && (
            <span
              className="tooltip tooltip-left"
              data-tip={t('GamePicker.title')}
            >
              <label
                htmlFor="game-picker"
                className="drawer-button btn btn-circle btn-ghost group"
              >
                <IconCategory />
              </label>
            </span>
          )}
        </div>
        <div className="drawer-side z-10">
          <label
            htmlFor="game-picker"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          {gamePicker && (
            <GamePicker
              realm={realm}
              active={game}
              player={player}
              gem={bag}
              trader={ammo}
              onSelect={setActive}
            />
          )}
        </div>
      </header>
    </>
  );
}
