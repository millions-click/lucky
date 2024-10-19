import Link from 'next/link';

import type { LuckyBagState } from '@/adapters';
import type { BagType } from '@/providers/types.d';

export const asLink = (href: string) => ({
  next: '',
  Component: Link,
  props: { href },
  onClick: () => void 0,
});

export function getBagMessage(bag: LuckyBagState, bagType: BagType) {
  switch (bag) {
    case 'idle':
      return 'activate';
    case 'locked':
      return 'locked';
    case 'unlocked':
      if (bagType === 'none') return 'activate';
  }
}
