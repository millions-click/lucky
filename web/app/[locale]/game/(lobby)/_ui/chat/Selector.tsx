import type { MessageProps } from '@/ui';
import { useMemo } from 'react';

type Action = string;
type ActionProps = {
  next: Action;
  className?: string;
  label?: string;
  onClick?: (next: string) => void;
};
type Option = ActionProps & { label: string };
type SelectorProps = {
  actions: Array<Action | ActionProps>;
  className?: string;
  noTitle?: boolean;
};

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
          {options.map(({ label, className, next, onClick }, i) => (
            <li
              key={i}
              className={
                className ||
                'btn text-amber-100 bg-orange-500 max-sm:btn-sm hover:btn-accent'
              }
              onClick={() => (onClick ? onClick(next) : onNext?.(next))}
            >
              {label}
            </li>
          ))}
        </ul>
      )
    );
  };
}
