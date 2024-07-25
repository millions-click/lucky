import { useGame } from '@/providers';
import { useMemo } from 'react';

function getChoices(choice: number, length: number) {
  return Array.from({ length }, (_, i) => choice);
}

type GamepadProps = {
  onPlay?: () => void;
};
export function Gamepad({ onPlay }: GamepadProps) {
  const { playRound, mode } = useGame();
  const choices = useMemo(
    () => Array.from({ length: mode?.choices || 0 }, (_, i) => i + 1),
    [mode]
  );

  async function play(choice: number) {
    const choices = getChoices(choice, mode?.choices || 0);
    await playRound(choices);
    onPlay?.();
  }

  return (
    <div className="fixed top-[80dvh] group rounded-full p-2 w-full max-w-xs border-2 border-amber-100">
      <div className="relative">
        <div className="btn btn-circle btn-outline btn-lg text-white uppercase border-2">
          Play
        </div>

        <div className="flex absolute w-full justify-between px-4 top-0">
          {choices.map((choice) => (
            <div
              key={choice}
              className="btn btn-circle btn-outline btn-lg text-white uppercase border-2"
              onClick={() => play(choice)}
            >
              {choice}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
