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
      <span className={`pl-1 ${className.label}`}>{dust}</span>
    </Badge>
  );
}

function LuckyShot({ token, size, glow }: BadgeProps & { token: Token }) {
  const { getAccount } = usePlayer();
  const account = getAccount(token.mint);
  const className = CLASSES[size];

  return (
    <Badge icon="ammo" size={size} glow={glow}>
      <span className={`pl-1 ${className.label}`}>
        {formatter.format(account?.amount || 0)}
      </span>
    </Badge>
  );
}

type AmmoProps = Partial<BadgeProps> & {
  token: Token | null;
  className?: string;
  dust?: Size;
  shot?: Size;
};
export function Ammo({
  token,
  className = '',
  size = 'sm',
  glow = true,
  dust,
  shot,
}: AmmoProps) {
  const { player } = usePlayer();
  if (!player || !token) return null;

  return (
    <div className={className}>
      <FairiesDust size={dust || size} glow={glow} />
      <LuckyShot token={token} size={shot || size} glow={glow} />
    </div>
  );
}
