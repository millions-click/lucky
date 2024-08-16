import { Account, getAccount } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

import { confirmAndLogTransaction, Portal } from '../../utils';
import type { Token } from '@utils/token';
import { getCollectorPDA, toBigInt } from '@luckyland/anchor';
import { TRADES_FOR_MARKETING } from '../../tokens/luckyshot/constants';

export async function FillStock(
  { portal, cluster }: Portal,
  trader: Token,
  reserve: Account
) {
  console.log('------------------ Vendor ------------------');
  const vault = getCollectorPDA(trader.mint, cluster.asCluster());
  let collector = await getAccount(portal.provider.connection, vault);

  if (collector.amount > 0) {
    console.log('Stock already filled.');
    return { collector, trader };
  }
  const marketing_reserve = toBigInt(
    Number(TRADES_FOR_MARKETING),
    trader.decimals
  );

  if (reserve.amount <= marketing_reserve)
    throw new Error('Insufficient reserve to fill stock');

  const amount = reserve.amount - marketing_reserve;
  console.log(`Transferring ${trader.name} reserve to vendor stock...`);
  console.log(`Reserve: ${reserve.address}`);
  console.log(`Amount to transfer: ${amount}`);

  const confirmOptions = { skipPreflight: true };
  const txHash = await portal.methods
    .storeFill(new BN(amount.toString()))
    .accounts({ trader: trader.mint, reserve: reserve.address })
    .rpc(confirmOptions);
  await confirmAndLogTransaction(txHash, portal.provider.connection, cluster);

  console.log('Stock filled.');
  collector = await getAccount(portal.provider.connection, vault);
  console.log('Stock: ' + collector.address);
  console.log('Balance: ' + collector.amount);

  return { collector, trader };
}
