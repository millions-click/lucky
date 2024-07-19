import { type Portal, confirmAndLogTransaction } from '../../utils';

import type { Token } from '@utils/token';
import { getStorePDA, toBN } from '@luckyland/anchor';
import { getUSDToSOLFeed } from '@constants';

const PRICE = 1; // The price of the token in USD. Chainlink feed is used to get the price of SOL in USD.

export async function LaunchStore({ portal, cluster }: Portal, trader: Token) {
  console.log('------------------ Store ------------------');
  console.log('Retrieving store details...');
  const { feed, decimals } = getUSDToSOLFeed(cluster.asCluster());
  const pda = getStorePDA(trader.mint, feed, cluster.asCluster());
  let store = await portal.account.store.fetchNullable(pda);

  if (store) {
    console.log(
      `Store for "${trader.name}" using default feed already exists.`
    );
    return { pda, store, trader };
  }

  console.log('Store not found. Launching store...');
  console.log(
    `Launching vendor for ${trader.name} ($${trader.symbol}) trader on ${cluster.name} market`
  );
  const price = toBN(PRICE, decimals);
  console.log(
    `Price: ${PRICE} USD using ${decimals} decimals from USD/SOL feed`
  );
  console.log(`Feed: ${feed}`);

  const confirmOptions = { skipPreflight: true };
  const txHash = await portal.methods
    .launchStore({ price })
    .accounts({ trader: trader.mint, feed })
    .rpc(confirmOptions);
  await confirmAndLogTransaction(txHash, portal.provider.connection, cluster);

  store = await portal.account.store.fetch(pda);
  console.log('Store created.');

  return { pda, store, trader };
}
