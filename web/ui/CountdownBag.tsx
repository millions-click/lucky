import { IconAlarm } from '@tabler/icons-react';

import { MoneyBagIcon } from '@/ui/icons';
import type { Countdown, LuckyPassState } from '@/providers/types.d';

const DISPLAY = ['hours', 'minutes', 'seconds'];

const CLASSES = {
  sm: {
    icon: 'w-12 h-12 mr-[-10px] mb-[-8px]',
    alarm: 'w-5 h-5',
    clock: 'border-2 px-2',
    countdown: 'text-sm',
  },
  md: {
    icon: 'w-16 h-16 mr-[-12px] mb-[-10px]',
    alarm: 'w-6 h-6',
    clock: 'border-2 px-2',
    countdown: 'text-lg',
  },
  lg: {
    icon: 'w-24 h-24 mr-[-22px] mb-[-14px]',
    alarm: 'w-9 h-9',
    clock: 'border-4 px-4',
    countdown: 'text-2xl',
  },
};

const STATES: Record<LuckyPassState, { text: string }> = {
  idle: { text: 'text-gray-500' },
  active: { text: 'text-white' },
  saved: { text: 'text-warning' },
  expired: { text: 'text-error' },
};

type Size = keyof typeof CLASSES;
type CountdownProps = {
  countdown: Countdown;
  display?: string[];
  size?: Size;
  state: LuckyPassState;
};
export function CountdownBag({
  countdown,
  display = DISPLAY,
  size = 'md',
  state,
}: CountdownProps) {
  const classNames = CLASSES[size];

  return (
    <div className="flex items-end">
      <MoneyBagIcon className={`${classNames.icon} z-10`} />
      <div
        className={`bg-base-100 border-orange-500 rounded-box flex items-center ${STATES[state].text} ${classNames.clock}`}
      >
        <IconAlarm className={classNames.alarm} />
        <span
          className={`countdown font-mono pointer-events-none select-none ${classNames.countdown}`}
        >
          {display.map((key, i) => (
            <>
              {/* @ts-expect-error as `--value` is not a known prop. */}
              <span key={i} style={{ '--value': countdown[key] }} />
              {i < display.length - 1 ? ':' : null}
            </>
          ))}
        </span>
      </div>
    </div>
  );
}
