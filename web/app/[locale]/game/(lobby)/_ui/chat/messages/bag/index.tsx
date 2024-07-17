import { useState } from 'react';

import { Options, actions } from './actions';

import { type MessageProps } from '@/ui';
import { useTranslations } from 'next-intl';
import { LuckyBagProvider, useCrypto } from '@/providers';

type ActionKey = keyof typeof actions;
const next = {
  generate: 'generated',
  import: 'gifts',
  connect: 'gifts',
} as Record<ActionKey, string>;

export const Bag: MessageProps['Actions'] = ({ onNext, message, ...props }) => {
  const t = useTranslations('Components');
  const { state } = useCrypto();

  const [active, setActive] = useState<ActionKey>();
  const [confirmed, setConfirmed] = useState(false);

  const Action = active && actions[active];
  message.options = Object.keys(actions).map((key) => t(`Bag.options.${key}`));

  return (
    <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col items-center max-w-sm mx-auto relative">
      <h1 className="text-center">{t('Bag.title')}</h1>
      <p className="label-text-alt text-center">{t('Bag.description')}</p>

      <Options
        message={message}
        {...props}
        onNext={(action) => setActive(action as ActionKey)}
      />
      <LuckyBagProvider>
        {Action && (
          <dialog className="modal modal-bottom sm:modal-middle modal-open">
            <div className="modal-box">
              <Action onChange={setConfirmed} />
              {confirmed && (
                <div className="modal-action">
                  <button
                    className="btn btn-lg btn-ghost text-orange-500 "
                    onClick={() => {
                      onNext?.(
                        state === 'unsafe' && active === 'import'
                          ? 'secure'
                          : next[active]
                      );
                    }}
                  >
                    {t(
                      active === 'generate'
                        ? 'Common.action.save'
                        : active === 'import' && state === 'unsafe'
                        ? 'Common.action.secure'
                        : 'Common.action.activate'
                    )}
                  </button>
                </div>
              )}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setActive(undefined)}>Close</button>
            </form>
          </dialog>
        )}
      </LuckyBagProvider>
    </div>
  );
};
