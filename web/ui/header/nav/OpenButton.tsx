import { type HTMLAttributes } from 'react';
import { IconMenu } from '@tabler/icons-react';

type Props = {
  onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, 'aria-controls'>;

export const OpenButton = (props: Props) => {
  return (
    <button
      className="btn btn-circle btn-ghost"
      aria-controls={props['aria-controls']}
      aria-expanded={false}
      aria-label="Open menu"
      onClick={props.onClick}
    >
      <IconMenu className="h-6 w-6 shrink-0" aria-hidden />
    </button>
  );
};
