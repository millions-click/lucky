import { useTranslations } from 'next-intl';
import { IconMinus, IconPlus } from '@tabler/icons-react';

import type { MessageProps } from '@/ui/messages';
import { useLuckyBags, useLuckyPass, useLuckyWallet } from '@/providers';
import { ellipsify } from '@/utils';

export const Activate: MessageProps['Actions'] = ({ next = '', onNext }) => {
  const t = useTranslations('Components');
  const { active, bags, openBag, deleteBag } = useLuckyBags();
  const { activate } = useLuckyWallet();
  const { state } = useLuckyPass();

  const keys = Object.entries(bags);
  const activateLuckyBag = (key: string) => {
    const bag = openBag(key);

    if (bag) {
      activate();
      return onNext?.(next);
    }
    return onNext?.('locked');
  };

  return (
    <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col items-center relative">
      <h1 className="text-center">{t(`Activate.title`)}</h1>
      <p className="label-text-alt text-center">{t('Activate.description')}</p>

      <ul className="flex flex-wrap justify-around gap-4 sm:p-4 max-w-sm">
        {keys.map(([key, value]) => (
          <li
            key={key}
            className="card max-sm:card-compact glass group w-24 sm:w-36"
            onClick={() => activateLuckyBag(key)}
          >
            <div className="card-body items-center cursor-pointer relative">
              {value.name && (
                <span className="text-center label-text">{value.name}</span>
              )}
              <span className="group-hover:text-info pointer-events-none">
                {ellipsify(key)}
              </span>
              <button
                className="btn btn-outline btn-circle btn-error btn-xs absolute top-[-0.5rem] right-[-0.5rem] group-hover:visible sm:invisible"
                onClick={(e) => {
                  e.stopPropagation();

                  const _confirm = confirm(t('Activate.delete.confirm'));
                  if (!_confirm) return;

                  deleteBag(key);
                }}
              >
                <IconMinus size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {keys.length < 4 && !active && state !== 'active' && (
        <button
          className="btn btn-outline btn-circle btn-info absolute top-2 right-2 btn-sm"
          onClick={() => onNext?.('bag')}
        >
          <IconPlus />
        </button>
      )}
    </div>
  );
};
