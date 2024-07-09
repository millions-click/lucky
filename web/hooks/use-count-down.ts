import { useEffect, useState } from 'react';
import moment from 'moment';

const defaultCountDown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function useCountDown({
  expire,
  pause = false,
  delta = 1000,
  onFinished,
}: {
  expire?: number;
  pause?: boolean;
  delta?: number;
  onFinished?: () => void;
}) {
  const [countDown, setCountDown] = useState(defaultCountDown);

  useEffect(() => {
    if (pause) return;
    if (!expire) return setCountDown(defaultCountDown);
    if (moment().isAfter(expire)) {
      onFinished?.();
      return setCountDown(defaultCountDown);
    }

    const timeout = setTimeout(() => {
      const diff = moment.duration(moment(expire).diff(moment()));
      const days = Math.floor(diff.asDays());
      const hours = diff.hours();
      const minutes = diff.minutes();
      const seconds = diff.seconds();

      setCountDown({ days, hours, minutes, seconds: seconds + 1 });
    }, delta);

    return () => clearTimeout(timeout);
  }, [pause, delta, expire, countDown]);

  return countDown;
}
