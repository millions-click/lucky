import React from 'react';
import { IconId } from '@tabler/icons-react';

export type CustomIconComponent = React.FC<{
  className?: string;
  style?: React.CSSProperties;
}>;
type IconComponent = typeof IconId | CustomIconComponent;
type IconName = string;

export const IconSet = (
  set: Record<IconName, IconComponent>,
  setName?: string
) => {
  const Icon: React.FC<
    Omit<React.ComponentProps<IconComponent>, 'name'> & { name: IconName }
  > = ({ name, ...IconProps }) => {
    const Icon = set[name];
    if (!Icon) throw new Error(`Missed Icon: ${name} in set ${setName}`);

    return <Icon {...IconProps} />;
  };

  return { Icon, names: Object.keys(set) };
};
