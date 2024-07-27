'use client';

import { useMemo, useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

import { Coin, Side } from './_ui';
import { Gamepad } from '@/ui/realms';
import { useGame } from '@/providers';

function getOption(lastRound?: number[], choices?: number): Side {
  if (!lastRound || !choices) return 'heads';

  const [outcome] = lastRound;
  return outcome % choices === 1 ? 'heads' : 'tails';
}
export default function Coins() {
  const { player, mode } = useGame();
  const [choice, setChoice] = useState(NaN);

  const side = useMemo(
    () => getOption(player?.lastRound, mode?.choices),
    [player?.lastRound]
  );

  function handleDragEnd(event: DragEndEvent) {
    if (event.over) {
      const match = event.over.id.toString().match(/^choice#(\d+)/);
      if (match) {
        setChoice(Number(match[1]));
      }
    }
  }

  function reset() {
    setChoice(NaN);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Coin side={side} playing={!Number.isNaN(choice)} />
      <Gamepad selected={choice} onCompleted={reset} onError={reset} />
    </DndContext>
  );
}
