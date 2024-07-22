import { Token } from '@utils/token';
import { usePlayer } from '@/providers';
import { BalanceSol } from '@/components/account/account-ui';

const TX_FEE = 0.00002;

function FairiesDust({ className }: { className?: string }) {
  const { balance, refresh } = usePlayer();

  return (
    <div className={`cursor-pointer ${className}`} onClick={refresh}>
      <BalanceSol balance={balance} />
    </div>
  );
}

function LuckyShot({ token, className }: { token: Token; className?: string }) {
  const { getAccount } = usePlayer();
  const account = getAccount(token.mint);
  if (!account) return null;

  return <div className={className}>{account.amount}</div>;
}

type AmmoProps = {
  token: Token;
  className?: string;
  dust?: string;
  shot?: string;
};
export function Ammo({ token, className = '', shot, dust }: AmmoProps) {
  const { player } = usePlayer();
  if (!player) return null;

  return (
    <div className={' ' + className}>
      <FairiesDust className={dust} />
      <LuckyShot token={token} className={shot} />
    </div>
  );
}
