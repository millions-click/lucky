'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { TURNS_AVAILABLE, type TurnsSession } from '@/actions/types';
import { useCountDown } from '@/hooks';

export function Turns({
  session,
  attempts,
  onRenew,
}: {
  session: TurnsSession | null;
  attempts: number | null;
  onRenew?: () => void;
}) {
  const t = useTranslations('Index');
  const countDown = useCountDown({
    expire: session?.expires,
    onFinished: onRenew,
  });
  const message = Math.min(attempts || 0, 4);

  return (
    <div className="absolute bottom-0 max-lg:left-0 lg:right-0">
      {!session ? (
        attempts !== null ? (
          <div className="chat chat-start lg:chat-end mx-4 max-w-xs lg:max-w-lg">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image
                  alt="Lucky Rabbit"
                  src="/assets/avatars/lucky.png"
                  width={128}
                  height={128}
                  className="lg:scale-x-[-1]"
                />
              </div>
            </div>
            <div className="chat-bubble chat-bubble-warning">
              {t(`messages.${message}.message`)}
            </div>
            <div className="chat-footer opacity-50">
              {t(`messages.${message}.advise`)}
            </div>
          </div>
        ) : (
          <span className="loading loading-dots loading-lg text-primary m-4" />
        )
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 p-4 bg-base-300/20 rounded-box">
          <span
            className={`badge badge-lg ${session.hold ? 'badge-error' : ''}`}
          >
            {t('turns.left')}:{' '}
            {session.hold ? 0 : session.turns || TURNS_AVAILABLE + 1}
          </span>

          <div
            className="tooltip tooltip-left tooltip-info"
            data-tip={t('turns.hold')}
          >
            <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
              {Object.entries(countDown)
                .filter(([_, value]) => value > 0)
                .map(([key, value], i) => (
                  <div
                    key={i}
                    className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content"
                  >
                    <span className="countdown font-mono text-xl">
                      {/* @ts-expect-error as `--value` is not a known prop. */}
                      <span style={{ '--value': value }}></span>
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <span className={`badge badge-lg badge-info cursor-pointer`}>
            {t('turns.attempts')}: {session.attempts}
          </span>
        </div>
      )}
    </div>
  );
}
