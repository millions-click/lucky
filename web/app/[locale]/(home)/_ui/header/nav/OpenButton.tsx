import { type HTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import { IconCategory } from '@tabler/icons-react';

type Props = {
  onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, 'aria-controls'>;

export const OpenButton = (props: Props) => {
  const t = useTranslations('Components.Shortcuts');

  return (
    <div
      className="tooltip tooltip-right tooltip-primary"
      data-tip={t('title')}
    >
      <button
        className="btn max-sm:btn-sm btn-circle shadow-xl btn-accent"
        aria-controls={props['aria-controls']}
        aria-expanded={false}
        aria-label="Open menu"
        onClick={props.onClick}
      >
        <IconCategory />
      </button>
    </div>
  );
};
