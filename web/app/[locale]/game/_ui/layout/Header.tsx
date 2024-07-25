import { useLuckyPass, useTraders } from '@/providers';
import { CountdownBag } from '@/ui';
import { Ammo } from '@/ui/bag';

export function Header() {
  const { countdown } = useLuckyPass();
  const { trader: token } = useTraders();

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 lg:p-8">
      <div className="space-y-8">
        <CountdownBag {...countdown} size="md" />
        <Ammo className="flex flex-col gap-4" token={token} size="sm" />
      </div>
    </header>
  );
}
