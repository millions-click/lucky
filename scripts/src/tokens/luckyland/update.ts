import { Connection } from '@solana/web3.js';

import { type Cluster, loadOrCreateKeypair } from '../../utils';
import { NAME, SYMBOL, idPath, ID_NAME } from './constants';
import { getMetadataURI, updateMetadata } from '../utils';

export async function UpdateGem(connection: Connection, cluster: Cluster) {
  console.log(`Update ${NAME} gem ($${SYMBOL}) on ${cluster.name} cluster`);

  const authority = loadOrCreateKeypair(idPath(ID_NAME.MINTER));
  const payer = loadOrCreateKeypair(idPath(ID_NAME.PAYER));
  const gem = loadOrCreateKeypair(idPath(ID_NAME.GEM)).publicKey;
  const uri = getMetadataURI(SYMBOL);

  console.log(`Updating metadata for ${SYMBOL} gem | URI: ${uri}`);
  console.log(`Authority: ${authority.publicKey.toBase58()}`);
  console.log(`Payer: ${payer.publicKey.toBase58()}`);
  console.log(`Gem: ${gem.toBase58()}`);

  await updateMetadata(connection, { uri }, gem, payer, authority);

  return { gem };
}
