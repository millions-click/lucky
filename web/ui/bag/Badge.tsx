import type { PropsWithChildren } from 'react';
import { AmmoIcon, FairyDustIcon, IconSet } from '@/ui/icons';

const CLASSES = {
  xs: {
    icon: 'w-8 h-8',
    badge: 'border-2 pl-6 pr-2',
  },
  sm: {
    icon: 'w-12 h-12',
    badge: 'border-2 pl-10 pr-2',
  },
  md: {
    icon: 'w-14 h-14',
    badge: 'border-2 pl-12 pr-2',
  },
  lg: {
    icon: 'w-20 h-20',
    badge: 'border-4 pl-[4.5rem] pr-4',
  },
};

const Icons = {
  dust: FairyDustIcon,
  ammo: AmmoIcon,
};
const { Icon } = IconSet(Icons);

type size = keyof typeof CLASSES;
type BadgeProps = PropsWithChildren<{
  size?: size;
  icon?: keyof typeof Icons;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}>;
export function Badge({
  size = 'md',
  icon,
  className,
  children,
  onClick,
  glow,
}: BadgeProps) {
  const classNames = CLASSES[size];

  return (
    <div
      className={`flex text-white items-end relative ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`bg-base-100 border-orange-500 rounded-box flex items-center ${
          glow ? 'shadow-glow' : ''
        } ${classNames.badge}`}
      >
        {icon && (
          <Icon
            name={icon}
            className={`${className} ${classNames.icon} absolute -left-1 z-10`}
          />
        )}
        {children}
      </div>
    </div>
  );
}
