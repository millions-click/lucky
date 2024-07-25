'use client';

import { useMemo } from 'react';

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
  const side = useMemo(
    () => getOption(player?.lastRound, mode?.choices),
    [player?.lastRound]
  );

  return (
    <>
      <Coin side={side} />
      <Gamepad />
    </>
  );
}
