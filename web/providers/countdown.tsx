'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import moment from 'moment';

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const defaultCountDown: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};
type State = 'unset' | 'idle' | 'running' | 'paused' | 'finished';
type CountdownContext = {
  name?: string;
  state: State;

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
const Context = createContext({
  state: 'idle',
  countdown: defaultCountDown,
} as CountdownContext);

export type CountdownProviderProps = {
  children: React.ReactNode;
  delta?: number;
  onFinished?: () => void;
};

export function getCountdown(expires: number): Countdown {
  const now = moment();
  const diff = moment.duration(moment(expires).diff(now));

  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();
  const seconds = diff.seconds();

  return { days, hours, minutes, seconds };
}

export function CountdownProvider({
  children,
  delta = 1000,
  onFinished,
}: CountdownProviderProps) {
  const [name, setName] = useState<string>();
  const [state, setState] = useState<State>('unset');
  const [ttl, setTtl] = useState(0);
  const [expires, setExpires] = useState(0);
  const [countdown, setCountdown] = useState(defaultCountDown);

  useEffect(() => {
    if (state !== 'running') return;

    const interval = setInterval(() => {
      const now = moment();
      if (now.isAfter(expires)) {
        onFinished?.();
        setState('finished');
        setCountdown(defaultCountDown);
        return;
      }

      setCountdown(getCountdown(expires));
    }, delta);

    return () => clearInterval(interval);
  }, [state, delta, expires]);

  const value = {
    name,
    state,

    ttl,
    expires,
    countdown,

    setup: (ttl: number, start = false, name?: string) => {
      const expires = Date.now() + ttl * 1000;

      if (name) setName(name);
      setTtl(ttl);
      setExpires(start ? expires : 0);
      setCountdown(getCountdown(expires));
      setState(start ? 'running' : 'idle');
    },
    start: (expires?: number) => {
      const _expires = expires || Date.now() + ttl * 1000;

      setExpires(_expires);
      setCountdown(getCountdown(_expires));
      setState('running');
    },
    reset: () => {
      setTtl(0);
      setExpires(0);
      setCountdown(defaultCountDown);
      setState('unset');
    },
    pause: () => state === 'running' && setState('paused'),
    resume: () => state === 'paused' && setState('running'),
    toggle: () =>
      setState((state) => (state === 'running' ? 'paused' : 'running')),
  } as CountdownContext;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCountdown() {
  return useContext(Context);
}

type Settings = {
  ttl?: number;
  start?: boolean;
  expires?: number;
  pause?: boolean;
};
export function useConfigurableCountdown({
  ttl,
  start,
  expires,
  pause,
}: Settings = {}) {
  const countdown = useCountdown();

  if (ttl) countdown.setup(ttl, start);

  useEffect(() => {
    if (expires) countdown.start(expires);
  }, [expires]);

  useEffect(() => {
    if (pause === undefined) return;

    if (pause) countdown.pause();
    else countdown.resume();
  }, [pause]);

  return countdown;
}
