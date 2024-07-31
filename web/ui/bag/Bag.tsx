import { useMemo } from 'react';

import { type BadgeProps, Badge } from './Badge';

import type { Token } from '@utils/token';
import { usePlayer } from '@/providers';

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

type Size = NonNullable<BadgeProps['size']>;
type BaseBadgeProps = Pick<Required<BadgeProps>, 'size' | 'glow'>;
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
} as Record<Size, { label: string; dust: string }>;

function Gem({ token, size, glow }: BaseBadgeProps & { token: Token }) {
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

function FairiesDust({ size, glow }: BaseBadgeProps) {
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

function LuckyShot({ token, size, glow }: BaseBadgeProps & { token: Token }) {
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

type BagProps = Partial<BaseBadgeProps> & {
  gem: Token | null;
  trader: Token | null;
  className?: string;
  vault?: Partial<BaseBadgeProps>;
  dust?: Partial<BaseBadgeProps>;
  shot?: Partial<BaseBadgeProps>;
};
export function Bag({
  gem,
  trader,
  className = '',
  size = 'sm',
  glow = 'active',
  vault,
  dust,
  shot,
}: BagProps) {
  const { player } = usePlayer();
  if (!player || !trader || !gem) return null;

  return (
    <div className={className}>
      <Gem token={gem} size={size} glow={glow} {...vault} />
      <FairiesDust size={size} glow={glow} {...dust} />
      <LuckyShot token={trader} size={size} glow={glow} {...shot} />
    </div>
  );
}
