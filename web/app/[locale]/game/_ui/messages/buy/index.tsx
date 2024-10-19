'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconBuildingStore, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import { Pay } from './pay';
import { type Package, PACKAGES } from './contants';

import type { MessageProps } from '@/ui/messages';
import { StoreProvider, useStore, useTraders } from '@/providers';

function Packages({
  active,
  setActive,
}: {
  active: Package | null;
  setActive: (pkg: Package) => void;
}) {
  const t = useTranslations('Components.Buy.package');
  const { store, trader, getPackage, getPrice } = useStore();
  const options = useMemo(
    () =>
      store
        ? (PACKAGES.map((pkg) => {
            const _pkg = getPackage(pkg.amount);
            if (!_pkg) return null;

            const price = (getPrice(_pkg.account, true) || 0) as number;
            const discount =
              _pkg.account.sales < _pkg.account.max
                ? Math.round(
                    (1 -
                      _pkg.account.price.toNumber() / store.price.toNumber()) *
                      100
                  )
                : 0;
            const available = Math.max(
              _pkg.account.max - _pkg.account.sales,
              0
            );

            return {
              ...pkg,
              title: t(`${pkg.name}.title`),
              description: t(`${pkg.name}.description`),
              price,
              discount,
              available,
            };
          }).filter(Boolean) as Package[])
        : [],
    [getPackage, getPrice]
  );

  return (
    trader && (
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
        {options.map((pkg, i) => (
          <li
            key={i}
            className={`card card-compact glass transition-transform hover:scale-110 hover:shadow-glow ${
              active?.amount === pkg.amount ? 'animate-glow' : ''
            }`}
            onClick={() => setActive(pkg)}
          >
            <div className="card-body justify-center items-center hover:cursor-pointer">
              <div
                className="card-title tooltip tooltip-info max-sm:text-sm"
                data-tip={pkg.description}
              >
                {pkg.title}
              </div>
              <div className="max-sm:text-xs">
                {pkg.amount} ${trader.symbol}
              </div>

              {pkg.discount > 0 && (
                <div className="rotate-12 absolute -top-4 -right-4 flex flex-col justify-end items-center">
                  <span className="badge badge-xs badge-primary badge-outline">
                    {pkg.available}
                  </span>
                  <span className="badge bg-red-500 text-white">
                    -{pkg.discount}%
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  );
}

export const Buy: MessageProps['Actions'] = ({ next, onNext }) => {
  const { trader: token } = useTraders();
  const t = useTranslations('Components.Buy');
  const [active, setActive] = useState<Package | null>(null);
  const [pay, setPay] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return token ? (
    <StoreProvider>
      <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col items-center max-w-sm mx-auto relative">
        <h1 className="text-center">
          {t('title', { token: `$${token.symbol}` })}
        </h1>
        <p className="label-text-alt text-center">
          {t('description', { token: token.name })}
        </p>

        <Packages active={active} setActive={setActive} />

        {active && (
          <button
            className="btn btn-block btn-success"
            onClick={() => setPay(true)}
          >
            <IconBuildingStore />
            {t('action.buy', {
              amount: active.amount,
              token: `$${token.symbol}`,
            })}
          </button>
        )}

        {pay && active && (
          <dialog className="modal modal-bottom sm:modal-middle modal-open">
            <div className="modal-box glass">
              <Pay
                confirmed={confirmed}
                token={token}
                pkg={active}
                onChange={setConfirmed}
              />
              {confirmed && (
                <div className="modal-action">
                  <Link
                    href={next ? '' : 'realms?from=store&action=buy'}
                    className="btn btn-lg btn-ghost text-orange-500 "
                    onClick={() => onNext?.(next || 'success')}
                  >
                    {t('action.continue')}
                    <IconChevronRight />
                  </Link>
                </div>
              )}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setPay(false)}>Close</button>
            </form>
          </dialog>
        )}
      </div>
    </StoreProvider>
  ) : (
    <span className="loading loading-infinity w-full" />
  );
};
