import { Account, getAccount } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

import { confirmAndLogTransaction, Portal } from '../../utils';
import type { Token } from '@utils/token';
import { getCollectorPDA } from '@luckyland/anchor';

export async function FillStock(
  { portal, cluster }: Portal,
  trader: Token,
  reserve: Account
) {
  console.log('------------------ Vendor ------------------');
  console.log(`Transferring ${trader.name} reserve to vendor stock...`);
  console.log(`Reserve: ${reserve.address}`);
  console.log(`Balance: ${reserve.amount}`);

  const confirmOptions = { skipPreflight: true };
  const txHash = await portal.methods
    .storeFill(new BN(reserve.amount.toString()))
    .accounts({ trader: trader.mint, reserve: reserve.address })
    .rpc(confirmOptions);
  await confirmAndLogTransaction(txHash, portal.provider.connection, cluster);

  console.log('Stock filled.');
  const vault = getCollectorPDA(trader.mint, cluster.asCluster());
  const collector = await getAccount(portal.provider.connection, vault);
  console.log('Stock: ' + collector.address);
  console.log('Balance: ' + collector.amount);

  return { collector, trader };
}
