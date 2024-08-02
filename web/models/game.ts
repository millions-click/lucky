import type { Game as IGame } from '@/providers/types';

export function getGameProb(
  game: Pick<IGame, 'slots' | 'choices' | 'winnerChoice'>
): number {
  const { slots, choices, winnerChoice } = game;
  const winners = winnerChoice ? 1 : choices;

  return (
    winners *
    Array.from({ length: slots }).reduce(
      (acc: number) => acc * (1 / choices),
      1
    )
  );
}

export function sortedGames(modes: Record<string, IGame>): IGame[] {
  const games = Object.values(modes);

  return games.sort((a, b) => {
    const probabilityDiff = b.probability - a.probability;
    if (probabilityDiff !== 0) {
      return probabilityDiff;
    }
    return a.slots - b.slots;
  });
}
