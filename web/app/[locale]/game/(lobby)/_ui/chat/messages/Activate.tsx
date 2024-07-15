import { useTranslations } from 'next-intl';

import { MessageProps } from '@/ui';
import { useLuckyBags } from '@/providers';
import { ellipsify } from '@/utils';
import { IconMinus, IconPlus } from '@tabler/icons-react';

const next = 'gifts';

export const Activate: MessageProps['Actions'] = ({ onNext }) => {
  const t = useTranslations('Components');
  const { bags, openBag, deleteBag } = useLuckyBags();

  const keys = Object.keys(bags);
  const activate = (key: string) => {
    const bag = openBag(key);

    if (bag) return onNext?.(next);
    return onNext?.('locked');
  };

  return (
    <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col items-center relative">
      <h1 className="text-center">{t(`Activate.title`)}</h1>
      <p className="label-text-alt text-center">{t('Activate.description')}</p>

      <ul className="flex flex-wrap justify-around gap-4 sm:p-4 max-w-sm">
        {keys.map((key) => (
          <li
            key={key}
            className="card max-sm:card-compact glass group w-24 sm:w-36"
            onClick={() => activate(key)}
          >
            <div className="card-body items-center cursor-pointer relative">
              <span className="group-hover:text-primary pointer-events-none">
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

      {keys.length < 4 && (
        <button
          className="btn btn-outline btn-circle btn-info absolute top-2 right-2 btn-sm"
          onClick={() => onNext?.('generate')}
        >
          <IconPlus />
        </button>
      )}
    </div>
  );
};
