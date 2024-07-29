import { useMemo } from 'react';

import { Badge } from './Badge';

import type { Token } from '@utils/token';
import { usePlayer } from '@/providers';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

const CLASSES = {
  xs: {
    label: 'text-sm',
    dust: '',
  },
  sm: {
    label: 'text-base',
    dust: '',
  },
  md: {
    label: 'text-2xl',
    dust: '',
  },
  lg: {
    label: 'text-4xl',
    dust: '',
  },
};
type Size = keyof typeof CLASSES;
type BadgeProps = {
  size: Size;
  glow: boolean;
};

function Gem({ token, size, glow }: BadgeProps & { token: Token }) {
  const { getAccount } = usePlayer();
  const account = getAccount(token.mint);
  const className = CLASSES[size];

  return (
    <Badge icon="gem" size={size} glow={glow}>
      <span className={`pl-1 select-none ${className.label}`}>
        {formatter.format(account?.amount || 0)}
      </span>
    </Badge>
  );
}

function FairiesDust({ size, glow }: BadgeProps) {
  const { balance, roundFee } = usePlayer();
  const dust = useMemo(
    () => formatter.format(balance / Number(roundFee)),
    [balance, roundFee]
  );
  const className = CLASSES[size];

  return (
    <Badge
      icon="dust"
      size={size}
      glow={glow}
      className={`text-[#FFE9B0] bottom-0 ${className.dust}`}
    >
      <span className={`pl-1 select-none ${className.label}`}>{dust}</span>
    </Badge>
  );
}

function LuckyShot({ token, size, glow }: BadgeProps & { token: Token }) {
  const { getAccount } = usePlayer();
  const account = getAccount(token.mint);
  const className = CLASSES[size];

  return (
    <Badge icon="ammo" size={size} glow={glow}>
      <span className={`pl-1 select-none ${className.label}`}>
        {formatter.format(account?.amount || 0)}
      </span>
    </Badge>
  );
}

type BagProps = Partial<BadgeProps> & {
  gem: Token | null;
  trader: Token | null;
  className?: string;
  vault?: Size;
  dust?: Size;
  shot?: Size;
};
export function Bag({
  gem,
  trader,
  className = '',
  size = 'sm',
  glow = true,
  vault,
  dust,
  shot,
}: BagProps) {
  const { player } = usePlayer();
  if (!player || !trader || !gem) return null;

  return (
    <div className={className}>
      <Gem token={gem} size={vault || size} glow={glow} />
      <FairiesDust size={dust || size} glow={glow} />
      <LuckyShot token={trader} size={shot || size} glow={glow} />
    </div>
  );
}
