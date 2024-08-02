import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconBuildingStore, IconChevronRight } from '@tabler/icons-react';

import { type Package, packages } from './contants';

import type { MessageProps } from '@/ui';
import { Pay } from './pay';
import { useTraders } from '@/providers';

export const Buy: MessageProps['Actions'] = ({ onNext }) => {
  const { trader: token } = useTraders();
  const t = useTranslations('Components.Buy');
  const [active, setActive] = useState<Package | null>(null);
  const [pay, setPay] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const options = useMemo(
    () =>
      packages.map((pkg) => ({
        ...pkg,
        title: t(`package.${pkg.name}.title`),
        description: t(`package.${pkg.name}.description`),
      })),
    []
  );

  return token ? (
    <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col items-center max-w-sm mx-auto relative">
      <h1 className="text-center">
        {t('title', { token: `$${token.symbol}` })}
      </h1>
      <p className="label-text-alt text-center">
        {t('description', { token: token.name })}
      </p>

      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                {pkg.amount} ${token.symbol}
              </div>
            </div>
          </li>
        ))}
      </ul>

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
                <button
                  className="btn btn-lg btn-ghost text-orange-500 "
                  onClick={() => onNext?.('success')}
                >
                  {t('action.continue')}
                  <IconChevronRight />
                </button>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setPay(false)}>Close</button>
          </form>
        </dialog>
      )}
    </div>
  ) : (
    <span className="loading loading-infinity w-full" />
  );
};
