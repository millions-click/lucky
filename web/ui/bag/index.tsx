import { useWallet } from '@solana/wallet-adapter-react';
import { ellipsify } from '@/utils';

export function BagButton({ className }: { className?: string }) {
  const { publicKey } = useWallet();
  if (!publicKey) return null;

  return (
    <div className={`badge badge-lg ${className}`}>
      <h1>{ellipsify(publicKey.toString())}</h1>
    </div>
  );
}
