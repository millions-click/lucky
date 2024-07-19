import { useMemo } from 'react';

import type { BaseProps } from '../card.d';
import { useStoreProgramAccount } from '../../store-data-access';
import { useDataFeed } from '@/providers';
import { fromBN, toBN } from '@luckyland/anchor';

export function PriceUpdate({ storePda }: BaseProps) {
  const { decimals } = useDataFeed();
  const { update, storeQuery } = useStoreProgramAccount({
    storePda,
  });
  const price = useMemo(() => {
    if (!storeQuery.data?.price) return 0;
    return fromBN(storeQuery.data.price, decimals);
  }, [storeQuery.data?.price]);

  return (
    <button
      className="btn btn-xs lg:btn-md btn-outline"
      onClick={() => {
        const value = Number(
          window.prompt('Update token price:', price.toString() ?? '0')
        );
        if (value === price || isNaN(value)) return;

        return update.mutateAsync(toBN(value, decimals));
      }}
      disabled={update.isPending}
    >
      Update Price
    </button>
  );
}
