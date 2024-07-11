import { type HTMLAttributes, useMemo } from 'react';

import { TokenAccount, useEscrowGems, useTreasureGems } from '@/hooks';

import { MoneyBagIcon } from '@/ui/icons';
import { formatAmount } from '@luckyland/anchor';
import { useTranslations } from 'next-intl';

type Props = {
  onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, 'aria-controls'>;

function useTreasureBalance() {
  const { mints: treasure } = useTreasureGems();
  const { gems: bounties } = useEscrowGems();

  const balances = useMemo(() => {
    const _balances: Record<string, { gem: TokenAccount; amount: number }> = {};

    bounties.forEach(({ mint, amount }) => {
      if (!mint || !amount) return;

      const key = mint.toString();
      if (key in treasure) {
        if (key in _balances) _balances[key].amount += amount;
        else _balances[key] = { amount, gem: treasure[key] };
      }
    });

    return _balances;
  }, [treasure, bounties]);

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
        className="btn btn-ghost btn-sm flex-row-reverse px-0 rounded-full"
        aria-controls={props['aria-controls']}
        aria-expanded={false}
        aria-label="Open menu"
        onClick={props.onClick}
      >
        <span className="div bg-neutral text-white border-2 border-primary animate-glow rounded-xl px-2 py-1 ml-[-16px]">
          {total ? (
            '$ ' + formatAmount(total)
          ) : (
            <span className="loading loading-ring loading-xs" />
          )}
        </span>
        <MoneyBagIcon className="h-8 w-8 self-center" aria-hidden />
      </button>
    </div>
  );
};
