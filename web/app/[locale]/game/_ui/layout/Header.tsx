import { useGems, useLuckyPass, useTraders } from '@/providers';
import { CountdownBag } from '@/ui';
import { Bag } from '@/ui/bag';

export function Header() {
  const { countdown, winner } = useLuckyPass();
  const { gem } = useGems();
  const { trader } = useTraders();

  return (
    <header className="fixed top-0 left-0 flex items-center justify-between p-4 lg:p-8">
      <div className="space-y-8">
        <CountdownBag {...countdown} size="md" />
        <Bag
          className="flex flex-col gap-4"
          gem={gem}
          trader={trader}
          size="sm"
          vault={{ glow: winner ? 'win' : undefined }}
        />
      </div>
    </header>
  );
}
