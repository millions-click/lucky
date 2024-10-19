import { IconClipboardCopy } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';

type CopyToClipboardProps = PropsWithChildren<{
  payload: string;
  icon?: boolean;
  className?: string;
  onClick?: () => void;
  onCopied?: () => void;
}>;
export function CopyToClipboard({
  payload,
  icon = true,
  className,
  onClick,
  onCopied,
  children,
}: CopyToClipboardProps) {
  const copyToClipboard = () => {
    if (!payload) return onClick?.();
    navigator.clipboard.writeText(payload);

    onCopied?.();
    onClick?.();
  };

  return (
    <button className={className ? className : 'btn'} onClick={copyToClipboard}>
      {icon && <IconClipboardCopy />}
      {children}
    </button>
  );
}
