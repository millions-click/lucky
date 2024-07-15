import { useTranslations } from 'next-intl';

import { MessageProps } from '@/ui';
import { useLuckyBags } from '@/providers';
import { ellipsify } from '@/utils';
import { IconPlus } from '@tabler/icons-react';

const next = 'gifts';

export const Activate: MessageProps['Actions'] = ({ onNext }) => {
  const t = useTranslations('Components');
  const { bags, openBag } = useLuckyBags();

  const keys = Object.keys(bags);
  // const keys = Array.from({ length: 6 }, (_, i) => `key-${i + 1}`);
  const activate = (key: string) => {
    const bag = openBag(key);

    if (bag) return onNext?.(next);
    return onNext?.('locked');
  };

  return (
    <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col relative">
      <h1 className="text-center">{t(`Activate.title`)}</h1>
      <p className="label-text-alt text-center">{t('Activate.description')}</p>

      <ul className="grid grid-cols-12 max-h-32 gap-4 overflow-scroll">
        {keys.map((key) => (
          <li
            key={key}
            className="card card-compact col-span-6 md:col-span-4 glass group"
            onClick={() => activate(key)}
          >
            <div className="card-body items-center cursor-pointer">
              <span className="group-hover:text-primary pointer-events-none">
                {ellipsify(key)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button
        className="btn btn-outline btn-circle btn-info absolute top-2 right-2 btn-sm"
        onClick={() => onNext?.('generate')}
      >
        <IconPlus />
      </button>
    </div>
  );
};
