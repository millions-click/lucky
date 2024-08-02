'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';

import styles from './styles.module.css';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

import { useGame } from '@/providers';
import { IconFingerprint } from '@tabler/icons-react';

function getChoices(choice: number, length: number) {
  return Array.from({ length }, (_, i) => choice);
}

type GamepadProps = {
  selected: number;
  onPlay?: () => void;
  onCompleted?: () => void;
  onError?: () => void;
};
export function Gamepad({
  selected,
  onPlay,
  onCompleted,
  onError,
}: GamepadProps) {
  const { playRound, game, details } = useGame();
  const choices = useMemo(() => {
    if (!game) return [];

    const length = game.pickWinner ? game.choices : 1;
    const di = game.pickWinner ? 1 : 0;
    return Array.from({ length }, (_, i) => i + di);
  }, [game]);

  useEffect(() => {
    if (
      Number.isNaN(selected) ||
      !game ||
      selected < 0 ||
      selected > game?.choices
    )
      return onError?.();

    const debounce = setTimeout(async () => {
      try {
        onPlay?.();
        const choices = getChoices(selected, game?.slots || 0);
        await playRound(choices);
        onCompleted?.();
      } catch (error) {
        onError?.();
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [selected]);

  return (
    <div className={`${styles.container} group`} data-choices={choices.length}>
      <div className={styles.area} data-choices={choices.length}>
        {choices.map((choice) => (
          <Droppable
            key={choice}
            choice={choice}
            selected={selected === choice}
            className={styles.droppable}
          >
            {details?.choices?.[choice] && (
              <figure className="relative w-full h-full">
                <Image
                  src={details.choices[choice].image}
                  alt={details.choices[choice].name}
                  fill
                />
              </figure>
            )}
          </Droppable>
        ))}

        <Draggable className={styles.draggable}>
          <span
            className="tooltip tooltip-secondary group-hover:tooltip-open"
            data-tip="Arrastrame"
          >
            <IconFingerprint size={48} />
          </span>
        </Draggable>
      </div>
    </div>
  );
}
