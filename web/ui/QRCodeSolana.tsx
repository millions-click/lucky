'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createQR } from '@solana/pay';
import { IconTransfer } from '@tabler/icons-react';

function QR({ url }: { url: URL }) {
  const ref = useRef(null);
  const qrCode = createQR(
    url,
    300,
    'oklch(74.7224% 0.072456 131.116276/1)',
    '#111827'
  );

  useEffect(() => {
    if (!ref.current) return;
    qrCode.append(ref.current);
  }, [ref]);

  return <figure ref={ref} />;
}

type QRCodeProps = PropsWithChildren<{
  url: URL | null;
  title?: string;
  action?: string;
  className?: string;
}>;
export function QRCode({
  url,
  title,
  action,
  className = '',
  children,
}: QRCodeProps) {
  return url ? (
    <div className={'space-y-4 ' + className}>
      <h1 className="text-xl text-center">{title}</h1>
      <QR url={url} />
      <Link className="btn btn-primary btn-block" href={url} target="_blank">
        <IconTransfer />
        {action}
      </Link>
      {children}
    </div>
  ) : (
    <span className="loading w-full" />
  );
}
