import { type HTMLAttributes, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { type TokenAccount } from '@/hooks';

import { MoneyBagIcon } from '@/ui/icons';
import { useBounties, useGems } from '@/providers';
import { formatAmount } from '@luckyland/anchor';

type Props = {
  onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, 'aria-controls'>;

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

export const OpenButton = (props: Props) => {
  const t = useTranslations('General');
  const { total } = useTreasureBalance();

  return (
    <div
      className="tooltip tooltip-right tooltip-primary"
      data-tip={t('bounty.tooltip')}
    >
      <button
        className="btn btn-ghost btn-sm px-0 rounded-full"
        aria-controls={props['aria-controls']}
        aria-expanded={false}
        aria-label="Open menu"
        onClick={props.onClick}
      >
        <MoneyBagIcon className="z-10 h-8 w-8 self-center" aria-hidden />
        <span className="div bg-neutral text-white border-2 border-primary animate-glow rounded-xl px-2 py-1 ml-[-16px]">
          {total ? (
            '$ ' + formatAmount(total)
          ) : (
            <span className="loading loading-ring loading-xs" />
          )}
        </span>
      </button>
    </div>
  );
};
