'use client';

import { useEffect, useMemo } from 'react';

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

    const length = game.winnerChoice === 0 ? 1 : game.choices;
    const di = game.winnerChoice === 0 ? 0 : 1;
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
    <div className="fixed top-[80dvh] group rounded-full p-2 w-full max-w-xs border-2 border-amber-100">
      <div className="flex w-full justify-between px-4 top-0">
        {choices.map((choice) => (
          <Droppable
            key={choice}
            choice={choice}
            selected={selected === choice}
            className="w-16 h-16 border-2 border-red-300 rounded-full flex justify-center items-center"
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

        <Draggable className="w-16 h-16 rounded-full border-2 border-violet-500 top-2 left-[calc(50%_-_32px)] absolute flex justify-center items-center group">
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
