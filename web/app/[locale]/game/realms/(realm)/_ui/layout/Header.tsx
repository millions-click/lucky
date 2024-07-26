'use client';

import { useGame } from '@/providers';
import { Badge } from '@/ui/bag';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
});

export function Header() {
  const { vault } = useGame();

  return (
    <header className="fixed top-0 right-0 p-4">
      <div className="flex justify-between items-center mt-7">
        {vault && (
          <Badge icon="gem" size="md">
            {formatter.format(vault.amount)}
          </Badge>
        )}
      </div>
    </header>
  );
}
