import { useMemo, useState } from 'react';
import { useOwnedToken } from '@/hooks';
import { getKeeperPDA } from '@luckyland/anchor';

import type { BaseProps } from './actions';

import { Create } from './Create';
import { Accounts } from './Accounts';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';

export function VaultActions(props: BaseProps) {
  const {
    token: { mint },
  } = props;
  const ownerPDA = useMemo(() => getKeeperPDA(), []);
  const { token: ownedToken, refresh } = useOwnedToken(ownerPDA, mint);

  const vaultBalance = ownedToken?.amount || 0;
  const [enableActions, setEnableActions] = useState(false);

  return (
    <>
      {!ownedToken ? (
        <Create mint={mint} onCompleted={refresh} />
      ) : (
        <>
          <Accounts {...props} onEnabled={setEnableActions} />
          {enableActions && (
            <div className="flex flex-wrap w-full gap-4 justify-center">
              <Deposit
                {...props}
                balance={vaultBalance}
                onCompleted={refresh}
              />
              <Withdraw
                {...props}
                balance={vaultBalance}
                onCompleted={refresh}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
