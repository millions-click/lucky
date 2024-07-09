import { type HTMLAttributes } from 'react';
import { IconX } from '@tabler/icons-react';

type Props = {
  onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, 'aria-controls'>;

export const CloseButton = (props: Props) => {
  return (
    <button
      className="btn btn-circle btn-secondary btn-outline"
      aria-controls={props['aria-controls']}
      aria-expanded={true}
      aria-label="Close menu"
      onClick={props.onClick}
    >
      <IconX aria-hidden />
    </button>
  );
};
