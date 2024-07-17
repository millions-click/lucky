import { useCountdown } from '@/providers';
import { CountdownBag } from '@/ui';

export function Header() {
  const { state, countdown } = useCountdown();

  return (
    state !== 'unset' && (
      <div className="fixed top-0 left-0 right-0 flex p-4 lg:p-8">
        <CountdownBag countdown={countdown} size="sm" />
      </div>
    )
  );
}
