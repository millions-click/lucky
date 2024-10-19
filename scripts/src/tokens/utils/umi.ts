import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters';
import {
  mplTokenMetadata,
  fetchMetadataFromSeeds,
  updateV1,
  type Metadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  keypairIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi';

export async function updateMetadata(
  market: Connection,
  metadata: Partial<Metadata>,
  _mint: PublicKey,
  _payer: Keypair,
  _authority: Keypair
) {
  const umi = createUmi(market)
    .use(mplTokenMetadata())
    .use(keypairIdentity(fromWeb3JsKeypair(_payer)));

  const mint = fromWeb3JsPublicKey(_mint);
  const authority = createSignerFromKeypair(umi, fromWeb3JsKeypair(_authority));
  const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });

  await updateV1(umi, {
    mint,
    authority,
    data: { ...initialMetadata, ...metadata },
  }).sendAndConfirm(umi);
}
