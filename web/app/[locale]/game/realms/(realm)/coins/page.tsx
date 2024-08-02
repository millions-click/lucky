'use client';

import { useMemo, useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

import { Coin, Side } from './_ui';
import { Gamepad } from '@/ui/realms';
import { useGame } from '@/providers';

function getOption(
  slot: number,
  lastRound?: number[],
  choices?: number
): Side | null {
  if (choices === undefined) return null;
  if (!lastRound) return 'heads';

  return lastRound[slot] % choices === 1 ? 'heads' : 'tails';
}
export default function Coins() {
  const { player, game } = useGame();
  const [choice, setChoice] = useState(NaN);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const sides = useMemo(
    () =>
      Array.from({ length: game?.slots ?? 0 }, (_, i) =>
        getOption(i, player?.lastRound, game?.choices)
      ).filter(Boolean) as Side[],
    [player?.lastRound, game?.slots, game?.choices]
  );

  function handleDragEnd(event: DragEndEvent) {
    if (event.over) {
      const match = event.over.id.toString().match(/^choice#(\d+)/);
      if (match) {
        setChoice(Number(match[1]));
      }
    }
    setIsDragging(false);
  }

  function reset() {
    setChoice(NaN);
    setIsOver(false);
    setIsDragging(false);
  }

  return (
    <DndContext
      onDragStart={() => setIsDragging(true)}
      onDragOver={(e) => setIsOver(Boolean(e.over))}
      onDragEnd={handleDragEnd}
    >
      {sides.map((side, i) => (
        <Coin
          key={i}
          side={side}
          slot={i}
          slots={game?.slots}
          isDragging={isDragging}
          isOver={isOver}
          playing={!Number.isNaN(choice)}
        />
      ))}
      <Gamepad selected={choice} onCompleted={reset} onError={reset} />
    </DndContext>
  );
}
