import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { type MessageProps, AdviceMessage, Selector } from '@/ui/messages';

import { CountdownBag, EmailCode, CopyToClipboard } from '@/ui';
import { useLuckyPass } from '@/providers';
import { getBaseURL } from '@/utils';

const next = 'see-you';

export const Later: MessageProps['Actions'] = ({ onNext, ...props }) => {
  const t = useTranslations('Components.Later');
  const {
    pass: { code },
    countdown,
    save,
    redeem,
  } = useLuckyPass();

  const redeemUrl = useMemo(() => {
    if (!code) return;
    return `${getBaseURL()}/redeem?pass=${code}`;
  }, [code]);

  const Options = useMemo(
    () =>
      code
        ? Selector({
            actions: [
              {
                next: props.next || next,
                onClick: (next) => redeem().then(() => onNext?.(next)),
              },
              {
                next,
                Component: EmailCode,
                props: {
                  url: redeemUrl,
                },
              },
              {
                next,
                Component: CopyToClipboard,
                props: {
                  payload: code,
                },
              },
            ],
          })
        : null,
    [redeemUrl]
  );

  return (
    <>
      <AdviceMessage
        advice={t('advice', { time: '24h' })}
        backdrop={props.backdrop}
      />

      <div className="flex flex-col justify-center items-center gap-8 m-4">
        <CountdownBag {...countdown} />

        {!code && (
          <button className="btn btn-primary w-full" onClick={save}>
            Save for later
          </button>
        )}
      </div>

      {Options && <Options {...props} onNext={onNext} />}
    </>
  );
};
