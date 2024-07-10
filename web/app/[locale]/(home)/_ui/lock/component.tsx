'use client';

import { useState } from 'react';
import styles from './styles.module.css';

import type { Seed } from '@/actions/types';

const MIN = 1;
const MAX = 99;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomArray(length: number, min: number, max: number) {
  return Array.from({ length }, () => randomInt(min, max));
}

export function LockDoor({
  winner,
  disabled = false,
  reset = true,
  onAttempt,
}: {
  winner?: boolean;
  disabled?: boolean;
  onAttempt?: (match: boolean, seed: Seed) => void;
  reset?: boolean;
}) {
  const [holding, setHolding] = useState<boolean>(true);

  const [result, setResult] = useState<number>(NaN);
  const [pending, setPending] = useState<boolean>(false);
  const [values, setValues] = useState<number[]>(randomArray(8, MIN, MAX));
  const [match, setMatch] = useState(false);

  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);
  const [playTimeout, setPlayTimeout] = useState<number>(1000);
  const [restartRef, setRestartRef] = useState<NodeJS.Timeout | null>(null);

  const shiftAndPush = () => {
    setValues((values) => randomArray(values.length, MIN, MAX));
    setPlayTimeout(randomInt(500, 3000));
  };

  const start = () => {
    if (pending || match || disabled) return;

    setHolding(false);
    restartRef && clearTimeout(restartRef);

    setResult(NaN);
    shiftAndPush();

    setIntervalRef(setInterval(shiftAndPush, 200));
  };

  const play = () => {
    if (pending || match || disabled) return;

    const timestamp = Date.now();
    setPending(true);
    intervalRef && clearInterval(intervalRef);

    setTimeout(() => {
      const pos = randomInt(1, values.length);
      const value = values[pos - 1];
      const match = value % values.length === pos - 1;
      setResult(pos);
      setMatch(match);
      setPending(false);
      onAttempt && onAttempt(match, { value, trigger: playTimeout, timestamp });

      reset &&
        !match &&
        setRestartRef(
          setTimeout(() => {
            setMatch(false);
            setResult(NaN);
            setHolding(true);
          }, 5000)
        );
    }, playTimeout);
  };

  return (
    <button
      className={`${styles.border} bg-[url('/assets/images/entry/lock/full.svg')] bg-center bg-no-repeat bg-cover`}
      onMouseDown={start}
      onMouseUp={play}
      onTouchStart={start}
      onTouchEnd={play}
      disabled={pending || match || disabled}
      data-pending={pending}
      data-match={match}
      data-winner={winner}
      data-revealed={!Number.isNaN(result)}
      data-result={result || undefined}
    >
      <div className={`${styles.door} w-full h-full`}>
        {values.map((value, i) => (
          <div
            key={i}
            className={[
              styles.value,
              holding ? styles.holding : '',
              result === i + 1 ? styles.active : '',
              !holding && value % values.length === i ? styles.match : '',
            ].join(' ')}
            style={{ gridArea: `i${i + 1}` }}
            data-area={`i${i + 1}`}
          />
        ))}
      </div>
    </button>
  );
}
