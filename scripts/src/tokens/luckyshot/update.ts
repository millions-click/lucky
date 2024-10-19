import { Connection } from '@solana/web3.js';

import { type Cluster, loadOrCreateKeypair } from '../../utils';
import { NAME, SYMBOL, idPath, ID_NAME } from './constants';
import { getMetadataURI, updateMetadata } from '../utils';

export async function UpdateTrader(connection: Connection, cluster: Cluster) {
  console.log(`Update ${NAME} gem ($${SYMBOL}) on ${cluster.name} cluster`);

  const authority = loadOrCreateKeypair(idPath(ID_NAME.MINTER));
  const trader = loadOrCreateKeypair(idPath(ID_NAME.TRADER)).publicKey;
  const payer = loadOrCreateKeypair(idPath(ID_NAME.PAYER));
  const uri = getMetadataURI(SYMBOL);

  console.log(`Updating metadata for ${SYMBOL} ammo | URI: ${uri}`);
  console.log(`Authority: ${authority.publicKey.toBase58()}`);
  console.log(`Payer: ${payer.publicKey.toBase58()}`);
  console.log(`Trader: ${trader.toBase58()}`);

  await updateMetadata(connection, { uri }, trader, payer, authority);

  return { trader };
}
