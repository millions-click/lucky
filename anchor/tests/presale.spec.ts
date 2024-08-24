import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import {
  createAssociatedTokenAccount,
  createMint,
  getAccount,
  getAssociatedTokenAddress,
  mintToChecked,
} from '@solana/spl-token';

import {
  getPresaleProgram,
  getSaleKeeperPDA,
  getSalePDA,
  getSaleVaultPDA,
} from '../src/presale-exports';
import { BN } from '@coral-xyz/anchor';

const DECIMALS = 8;
describe('presale', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;

  anchor.setProvider(provider);
  const program = getPresaleProgram(provider);

  const { payer } = provider.wallet as anchor.Wallet;
  let token: PublicKey;

  beforeAll(async () => {
    token = await createMint(
      connection, // conneciton
      payer, // fee payer
      payer.publicKey, // mint authority
      null, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
      DECIMALS
    );

    const ata = await createAssociatedTokenAccount(
      connection, // connection
      payer, // fee payer
      token, // mint
      payer.publicKey // owner,
    );

    await mintToChecked(
      connection, // connection
      payer, // fee payer
      token, // mint
      ata, // receiver (should be a token account)
      payer, // mint authority
      1000 * 10 ** DECIMALS, // amount. if your decimals is 8, you mint 10^8 for 1 token.
      DECIMALS
    );
  });

  it('Initialize Presale', async () => {
    const reserve = await getAssociatedTokenAddress(token, payer.publicKey);
    const settings = {
      prices: [100, 200, 300].map((x) => new BN(x)),
      amounts: [10, 20, 30].map((x) => new BN(x)),
      start: new BN(Date.now() / 1000),
      end: new BN(Date.now() / 1000 + 86400),
      min: new BN(1),
      max: new BN(100),
    };

    await program.methods
      .initSale(settings)
      .accounts({
        token,
        reserve,
      })
      .rpc();

    const salePDA = getSalePDA(token);
    const vaultPDA = getSaleVaultPDA(token);
    const keeper = getSaleKeeperPDA();
    const sale = await program.account.sale.fetch(salePDA);
    const vault = await getAccount(connection, vaultPDA);

    expect(sale.token).toEqual(token);
    expect(sale.start).toEqual(settings.start);
    expect(sale.end).toEqual(settings.end);
    expect(sale.min.toString()).toEqual(settings.min.toString());
    expect(sale.max.toString()).toEqual(settings.max.toString());
    expect(sale.prices.toString()).toEqual(settings.prices.toString());
    expect(sale.amounts.toString()).toEqual(settings.amounts.toString());

    expect(vault.owner).toEqual(keeper);
    expect(vault.amount.toString()).toEqual(
      settings.amounts.reduce((a, b) => a.add(b), new BN(0)).toString()
    );
  });

  // TODO: Create all the settings validations tests.
});
