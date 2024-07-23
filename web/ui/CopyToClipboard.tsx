import { IconClipboardCopy } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';

type CopyToClipboardProps = PropsWithChildren<{
  payload: string;
  icon?: boolean;
  className?: string;
  onCopied?: () => void;
}>;
export function CopyToClipboard({
  payload,
  icon = true,
  className,
  onCopied,
  children,
}: CopyToClipboardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(payload);
    onCopied?.();
  };

  return (
    <button className={className ? className : 'btn'} onClick={copyToClipboard}>
      {icon && <IconClipboardCopy />}
      {children}
    </button>
  );
}
