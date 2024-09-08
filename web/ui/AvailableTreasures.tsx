'use client';

import { useMemo } from 'react';

import type { TokenAccount } from '@/hooks';
import { useBounties, useGems } from '@/providers';
import { formatAmount } from '@luckyland/anchor';
import { useTranslations } from 'next-intl';
import { Badge } from '@/ui/bag';

function useTreasureBalance() {
  const { getGem } = useGems();
  const { bounties } = useBounties();

  const balances = useMemo(() => {
    const _balances: Record<string, { gem: TokenAccount; amount: number }> = {};

    bounties.forEach(({ mint, amount }) => {
      if (!mint || !amount) return;

      const gem = getGem(mint);
      if (!gem) return;

      const key = mint.toString();
      if (key in _balances) _balances[key].amount += amount;
      else _balances[key] = { amount, gem };
    });

    return _balances;
  }, [bounties, getGem]);

  const total = useMemo(() => {
    return Object.values(balances).reduce((acc, { amount }) => acc + amount, 0);
  }, [balances]);

  return { total, balances };
}

export function AvailableTreasures() {
  const t = useTranslations('General.bounty');
  const { total } = useTreasureBalance();

  return (
    <div
      className="tooltip tooltip-left tooltip-primary"
      data-tip={t('tooltip')}
    >
      <Badge icon="gem" size={'sm'}>
        <span className="w-full">
          {total ? (
            '$ ' + formatAmount(total)
          ) : (
            <span className="loading loading-ring loading-xs" />
          )}
        </span>{' '}
      </Badge>
    </div>
  );
}
