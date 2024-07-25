import { Countdown } from '@/providers/countdown/context';

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type CountdownState =
  | 'unset'
  | 'idle'
  | 'running'
  | 'paused'
  | 'finished';

export type CountdownContext = {
  name?: string;
  state: CountdownState;

  ttl: number; // In seconds
  expires: number;
  countdown: Countdown;

  setup: (ttl: number, start?: boolean, name?: string) => void;
  start: (expires?: number) => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
};
