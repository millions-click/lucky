import type { AttemptSession } from '@/actions/types.d';
import { useConfigurableCountdown } from '@/providers';
import { CountdownBag } from '@/ui';

export function Locked({ attempt }: { attempt: AttemptSession }) {
  const { countdown } = useConfigurableCountdown({
    expires: attempt.exp + 300,
  });

  return (
    <div className="fixed top-16 bottom-16 flex justify-center items-center w-48 z-50">
      <div className="flex justify-center items-center rounded-full bg-base-100/80 w-48 h-48">
        <CountdownBag countdown={countdown} state="saved" />
      </div>
    </div>
  );
}
