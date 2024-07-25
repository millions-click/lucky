'use client';

import { useTranslations } from 'next-intl';

import { TURNS_AVAILABLE, type TurnsSession } from '@/actions/types.d';
import { useConfigurableCountdown } from '@/providers';

export function Turns({
  session,
  attempts,
  winner,
}: {
  session: TurnsSession | null;
  attempts: number | null;
  winner?: boolean;
}) {
  const t = useTranslations('Index');
  const { countdown } = useConfigurableCountdown({
    expires: session?.expires,
    pause: winner,
  });

  if (winner) return null;
  if (!session && attempts !== null) return null;

  return (
    <div className="fixed bottom-0 max-lg:left-0 lg:right-0">
      {!session ? (
        <span className="loading loading-dots loading-lg text-primary m-4" />
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
            <div className="grid grid-flow-col gap-2 text-center auto-cols-max *:pointer-events-none">
              {Object.entries(countdown)
                // @ts-expect-error Somehow this is losing the type context. CHECK.
                .filter(([_, value]) => value > 0)
                .map(([key, value], i) => (
                  <div
                    key={i}
                    className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content"
                  >
                    <span className="countdown font-mono text-xl *:pointer-events-none">
                      {/* @ts-expect-error as `--value` is not a known prop. */}
                      <span style={{ '--value': value }}></span>
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <span className={`badge badge-lg badge-info`}>
            {t('turns.attempts')}: {session.attempts}
          </span>
        </div>
      )}
    </div>
  );
}
