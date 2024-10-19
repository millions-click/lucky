'use client';

import { useMemo, useState } from 'react';
import { type Cluster, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IconCalculator } from '@tabler/icons-react';
import { ProgressBar } from 'react-progressbar-fancy';
import { useTranslations } from 'next-intl';

import type { Sale } from '@/providers/types.d';
import { usePlayer, useSale } from '@/providers';
import {
  getBalanceOptions,
  getPresaleOptions,
  getTokenAccountsOptions,
  getTokenOptions,
} from '@/queries';
import { fromBN, toBN } from '@luckyland/anchor';
import type { Token } from '@utils/token';
import { ellipsify } from '@/utils';
import { BagButton } from '@/ui/bag';
import { ExplorerLink } from '@/components/cluster/cluster-ui';
import { useTransactionToast } from '@/components/ui/ui-layout';
import { BalanceSol } from '@/components/account/account-ui';
import { loadLuckSale, registerLuckSale } from '@/actions';

const { NEXT_PUBLIC_CA = 'LuckU1gf8CgKKbm7oxHyEn8dAo7kku5Z2ZCSt9x6wQQ' } =
  process.env;
const gem = new PublicKey(NEXT_PUBLIC_CA);
const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

function PresaleNotOpened({ start, name }: { start: number; name: string }) {
  const t = useTranslations('Presale.Planned');

  return (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center space-y-6">
        <h2 className="card-title justify-center text-3xl">{t('title')}</h2>
        <p>
          {t('description', { name, date: new Date(start).toLocaleString() })}
        </p>
      </div>
    </div>
  );
}

function usePurchase(token: Token, stageId: number) {
  const { player } = usePlayer();
  const { cluster, sale } = useSale();
  const transactionToast = useTransactionToast();
  const client = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ['presale', 'session', { token: token.mint, player }],
    queryFn: () => {
      if (!player) throw new Error('Invalid player');
      return loadLuckSale(player.toString(), cluster.name);
    },
    enabled: Boolean(player),
  });

  const stage = useMemo(() => {
    if (!sessionQuery.data?.stages.length) return null;
    return sessionQuery.data.stages.find((stage) => stage.id === stageId);
  }, [sessionQuery.data]);

  const purchase = useMutation({
    mutationKey: ['presale', 'purchase', { cluster, token: token.mint }],
    mutationFn: async (value: number) => {
      if (value < 0) throw new Error('Invalid value');
      if (!sessionQuery.data) throw new Error('Invalid session');
      if (stage && stage.available < value)
        throw new Error('Max limit exceeded');

      const signature = await sale.methods
        .purchase(toBN(value, token.decimals))
        .accounts({ token: token.mint })
        .rpc();

      return {
        stage: stageId,
        signature,
        amount: value,
        timestamp: Date.now(),
      };
    },
    onSuccess: (newSale) => {
      transactionToast(newSale.signature);

      const keys = [
        getTokenAccountsOptions(player, sale.provider.connection).queryKey,
        getBalanceOptions(player, sale.provider.connection).queryKey,
        getPresaleOptions(sale, cluster.network as Cluster, token.mint)
          .queryKey,
      ];

      if (!player) throw new Error('Invalid player'); // This should never happen.
      return Promise.all([
        registerLuckSale(player.toString(), cluster.name, newSale),
        ...keys.map((queryKey) => client.invalidateQueries({ queryKey })),
        sessionQuery.refetch(),
      ]);
    },
  });

  return { session: sessionQuery, stage, purchase };
}

function MaxStageReached() {
  const t = useTranslations('Presale.Stage.MaxReached');

  return (
    <div className="p-8 rounded-box bg-yellow-600 text-black shadow-xl mb-4 max-w-sm space-y-2 text-center">
      <h1 className="">{t('title')}</h1>
      <p className="bg-secondary text-green-400 font-bold p-4 rounded-lg">
        {t('advice')}
      </p>
    </div>
  );
}

function Presale({
  presale: { presale, pda },
  token,
}: {
  presale: { presale: Sale; pda: PublicKey };
  token: Token;
}) {
  const { balance } = usePlayer();
  const t = useTranslations('Presale');
  const [amount, setAmount] = useState<number>();

  const remaining = useMemo(() => {
    if (!presale.sold) return 0;
    const { sold, amounts } = presale;
    const total = amounts.reduce((acc, amount) => acc.add(amount));
    return fromBN(total.sub(sold), token.decimals);
  }, [presale.sold, token.decimals]);

  const { start, active } = useMemo(() => {
    if (!presale) return { start: 0, end: 0, active: false };
    const now = Date.now();
    const start = fromBN(presale.start) * 1000;
    const end = fromBN(presale.end) * 1000;
    const active = start <= now && (end === 0 || end >= now);

    return {
      start,
      end: fromBN(presale.end) * 1000,
      active,
    };
  }, [presale.start]);

  const { stageId, available, state, stageTotal, price } = useMemo(() => {
    if (!start)
      return {
        state: 'loading',
        stageId: 0,
        available: 0,
        stageTotal: 0,
        price: 0,
      };

    const stageTotal = fromBN(presale.amounts[0], token.decimals);
    if (!presale || BigInt(presale.sold.toString()) === BigInt(0))
      return {
        state: active ? 'open' : 'planned',
        stageId: 1,
        available: stageTotal,
        stageTotal,
        price: fromBN(presale.prices[0], 9),
      };

    const { sold, amounts } = presale;
    let total = sold;

    for (let i = 0; i < amounts.length; i++) {
      if (total.lt(amounts[i]))
        return {
          state: 'open',
          stageId: i + 1,
          available: fromBN(amounts[i].sub(total), token.decimals),
          stageTotal: fromBN(amounts[i], token.decimals),
          price: fromBN(presale.prices[i], 9),
        };
      total = total.sub(amounts[i]);
    }

    return {
      state: 'closed',
      stageId: amounts.length + 1,
      available: 0,
      stageTotal: 0,
      price: 0,
    };
  }, [presale, token.decimals, start]);
  const { stage, purchase } = usePurchase(token, stageId);

  const { min, max, tokens, maxPerStage } = useMemo(() => {
    if (!presale || !token)
      return { min: 1, max: available, tokens: NaN, maxPerStage: 1 };
    const maxPerStage = fromBN(presale.max, token.decimals);

    return {
      min: fromBN(presale.min, token.decimals),
      max: Math.min(
        maxPerStage,
        stage ? Math.min(stage.available, available) : available
      ),
      maxPerStage,
      tokens: maxPerStage - (stage?.available ?? maxPerStage),
    };
  }, [presale, token, available, stage?.available]);

  const setPurchasableAmount = () => {
    if (!balance) return;
    const amount =
      (balance - 0.01 * LAMPORTS_PER_SOL) / LAMPORTS_PER_SOL / price;
    const rounded = Math.floor(amount / min) * min;
    setAmount(Math.min(rounded, max));
  };

  const setRoundedAmount = (amount: number) => {
    const rounded = Math.floor(amount / min) * min;
    setAmount(rounded);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full pt-6 pb-8">
      <h2 className="card-title justify-center text-3xl cursor-pointer">
        {formatter.format(remaining)} {token.symbol}
      </h2>

      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between">
        <span className="badge badge-accent badge-lg capitalize">
          {t(`state.${state}`)}
        </span>
        <span className="badge badge-info badge-lg capitalize">
          {t('Stage.badge', { stage: stageId })}
        </span>
      </div>

      {state === 'open' ? (
        <>
          <div className="flex flex-col items-center gap-2 w-full max-w-md">
            <span className="badge badge-success mb-2">
              {formatter.format(available)} {token.symbol}
            </span>

            <span className="w-full tooltip" data-tip={t('Stage.progress')}>
              <ProgressBar
                score={(1 - available / stageTotal) * 100}
                hideText
              />
            </span>

            <span
              className="w-full tooltip"
              data-tip={t('Stage.available', {
                amount: formatter.format(stage?.available ?? maxPerStage),
                symbol: token.symbol,
              })}
            >
              <ProgressBar
                score={(tokens / maxPerStage) * 100}
                hideText
                progressColor="green"
              />
            </span>
          </div>

          {max < min ? (
            <MaxStageReached />
          ) : (
            <form
              className="flex flex-col w-full max-w-md items-center justify-center"
              action={async (formData) => {
                const amount = Number(formData.get('amount'));
                if (amount < min || (max > 0 && amount > max)) {
                  alert('Invalid amount');
                  return;
                }
                try {
                  await purchase.mutateAsync(amount);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">
                    {t('input.amount.label', { symbol: token.symbol })}
                  </span>
                  <button
                    type="button"
                    className="label-text-alt text-info"
                    onClick={setPurchasableAmount}
                  >
                    Balance: <BalanceSol balance={balance} /> sol
                  </button>
                </div>
                <label className="input input-bordered w-full max-w-xs flex items-center gap-2">
                  <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={min}
                    step={min}
                    max={max ? max : undefined}
                    onBlur={(e) => setRoundedAmount(Number(e.target.value))}
                    placeholder={t('input.amount.placeholder', {
                      symbol: token.symbol,
                    })}
                    className="grow"
                  />
                  <button type="button" onClick={setPurchasableAmount}>
                    <IconCalculator />
                  </button>
                </label>
                <div className="label">
                  <span className="label-text-alt">
                    Min: {formatter.format(min)}
                  </span>
                  {max > 0 && (
                    <span className="label-text-alt">
                      Max: {formatter.format(max)}
                    </span>
                  )}
                </div>
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!amount || amount < min || amount > max}
              >
                Buy
              </button>
            </form>
          )}
        </>
      ) : (
        <PresaleNotOpened start={start} name={token.name} />
      )}

      <ExplorerLink
        path={`account/${pda}`}
        label={ellipsify(pda.toString())}
        className="link font-mono absolute bottom-2 left-4"
      />
    </div>
  );
}

export function Sale() {
  const { player } = usePlayer();
  const { sale, cluster } = useSale();
  const gemQuery = useQuery(getTokenOptions(gem, sale.provider.connection));

  const presale = useQuery(
    getPresaleOptions(sale, cluster.network as Cluster, gemQuery.data?.mint)
  );

  return presale.data && gemQuery.data ? (
    <>
      <BagButton className="absolute bottom-2 right-2 max-sm:btn-sm btn-secondary" />
      {player && <Presale presale={presale.data} token={gemQuery.data} />}
    </>
  ) : (
    <span className="loading loading-ring w-full" />
  );
}
