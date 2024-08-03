import { type Portal, confirmAndLogTransaction } from '../../utils';

import type { Token } from '@utils/token';
import {
  getStorePackagePDA,
  getStorePDA,
  toBigInt,
  toBN,
} from '@luckyland/anchor';
import { getUSDToSOLFeed } from '@constants';
import { loadPackages } from './loader';

export async function LoadStorePackages(
  { portal, cluster }: Portal,
  trader: Token
) {
  console.log('------------------ Store Packages ------------------');
  console.log('Retrieving store details...');
  const { feed, decimals } = getUSDToSOLFeed(cluster.asCluster());
  const storePDA = getStorePDA(trader.mint, feed, cluster.asCluster());

  await portal.account.store.fetch(storePDA);
  console.log('Store found. Returning packages details...');

  return Promise.all(
    loadPackages().map(async ({ amount, sales, price }) => {
      const _amount = toBigInt(amount, trader.decimals).toString();
      const pda = getStorePackagePDA(storePDA, _amount, cluster.asCluster());

      let pkg = await portal.account.storePackage.fetchNullable(pda);
      if (pkg) {
        console.log(`Package for ${amount} ${trader.symbol} already exists.`);
        return { pda, ...pkg };
      }

      console.log(
        `Package for ${amount} ${trader.symbol} not found. Creating...`
      );
      const _price = toBN(price, decimals);
      const confirmOptions = { skipPreflight: true };
      const txHash = await portal.methods
        .storePackage(_amount, { price: _price, sales })
        .accounts({ store: storePDA })
        .rpc(confirmOptions);

      await confirmAndLogTransaction(
        txHash,
        portal.provider.connection,
        cluster
      );

      pkg = await portal.account.storePackage.fetch(pda);
      console.log(`Package for ${amount} ${trader.symbol} created.`);

      return { pda, ...pkg };
    })
  );
}
