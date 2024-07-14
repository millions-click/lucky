import { useTranslations } from 'next-intl';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export type NavProps = {
  next?: string;
  previous?: string;
  onNext?: (next: string) => void;
  backdrop?: boolean;
};

const Icons = {
  left: IconChevronLeft,
  right: IconChevronRight,
};

export function NavAction({
  icon,
  target,
  message,
  onClick,
  backdrop,
}: {
  icon: 'left' | 'right';
  target: string;
  message: string;
  onClick: (target: string) => void;
  backdrop?: boolean;
}) {
  const Icon = Icons[icon];
  return (
    <button
      className={`btn btn-ghost text-orange-500 ${
        backdrop ? 'max-md:btn-circle btn-lg' : 'btn-circle'
      }
      ${icon === 'left' ? '' : 'flex-row-reverse'}
      `}
      onClick={() => onClick(target)}
    >
      <Icon className={backdrop ? 'w-8 h-8' : 'w-10 h-10'} />
      <span className={backdrop ? 'max-md:hidden' : 'hidden'}>{message}</span>
    </button>
  );
}

export function Nav({
  className = '',
  onNext,
  next,
  previous,
  backdrop,
}: NavProps & { className?: string }) {
  const t = useTranslations('Components');
  if (!onNext) return null;

  return (
    <div className={`w-full flex justify-between ${className}`}>
      {previous && (
        <NavAction
          icon="left"
          target={previous}
          message={t('Message.back')}
          onClick={onNext}
          backdrop={backdrop}
        />
      )}

      <div />

      {next && (
        <NavAction
          icon="right"
          target={next}
          message={t('Message.next')}
          onClick={onNext}
          backdrop={backdrop}
        />
      )}
    </div>
  );
}
