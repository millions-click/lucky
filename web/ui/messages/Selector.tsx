import { PropsWithChildren, useMemo } from 'react';
import type { MessageProps } from '@/ui';

type ItemComponentProps = PropsWithChildren<{
  className?: string;
  onClick?: () => void;
}>;

type Action = string;
type ActionProps = {
  next: string;
  className?: string;
  label?: string;
  onClick?: (next: string) => void;
  Component?: React.ElementType;
  props?: Record<string, unknown>;
};
type Option = ActionProps & { label: string };
type SelectorProps = {
  actions: Array<Action | ActionProps>;
  className?: string;
  noTitle?: boolean;
};

const DefaultComponent: React.FC<ItemComponentProps> = ({
  className,
  onClick,
  children,
}) => (
  <li className={className} onClick={onClick}>
    {children}
  </li>
);

function Item({
  label,
  className,
  next,
  onClick,
  onNext,
  Component,
  props,
}: ActionProps & { onNext?: (next: string) => void }) {
  const Li = Component || DefaultComponent;

  return (
    <Li
      className={
        className ||
        'btn text-amber-100 bg-orange-500 max-sm:btn-sm hover:btn-accent'
      }
      onClick={() => (onClick ? onClick(next) : onNext?.(next))}
      {...props}
    >
      {label}
    </Li>
  );
}

export function Selector({
  actions,
  className,
  noTitle,
}: SelectorProps): NonNullable<MessageProps['Actions']> {
  return function Selector({ message, onNext }) {
    const options: Option[] = useMemo(
      () =>
        actions.map((action, i) => {
          const label = message.options?.[i];

          if (typeof action === 'string') {
            return {
              next: action,
              label: label || action,
            };
          }

          return {
            ...action,
            label: label || action.label || action.next,
          };
        }),
      [message.options]
    );

    return (
      options.length && (
        <ul
          className={
            className ||
            'menu bg-base-200 my-4 p-4 gap-2.5 rounded-box lg:menu-lg'
          }
        >
          {!noTitle && <li className="menu-title">{message.select}</li>}
          {options.map((options, i) => (
            <Item key={i} {...options} onNext={onNext} />
          ))}
        </ul>
      )
    );
  };
}
