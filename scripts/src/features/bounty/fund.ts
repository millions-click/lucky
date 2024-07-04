import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

import { confirmAndLogTransaction, Portal } from '../../utils';

import { getBountyVaultPDA, RENEW_THRESHOLD } from '@luckyland/anchor';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { Token } from '@utils/token';

export async function FundBounties(_: Portal, gem: Token) {
  console.log('------------------ Bounties ------------------');
  console.log('Funding bounties...');
  const { portal } = _;
  const bounties = await portal.account.bounty.all();

  const vaults = await Promise.all(
    bounties.map(
      async ({
        publicKey: pda,
        account: { currentlyIssued, reward, gem: mint },
      }) => {
        if (!mint.equals(gem.mint)) return;

        const vault = await loadVault(pda, _);
        if (!vault) return { bounty: pda, reward, available: BigInt(0) };

        if (
          currentlyIssued.lt(reward) ||
          currentlyIssued.gte(
            new BN((vault.amount * RENEW_THRESHOLD).toString())
          )
        )
          return { bounty: pda, reward, available: vault.amount };
      }
    )
  );

  const emptyVaults = vaults.filter(Boolean);
  if (!emptyVaults.length) {
    console.log('No bounties to fund.');
    return [];
  }

  const reserve = await loadReserve(_, gem);
  const maxAmount = reserve.amount / BigInt(emptyVaults.length);

  const fundedBounties = await Promise.all(
    emptyVaults.map(async ({ bounty, reward, available }) => {
      const winners = new BN(maxAmount.toString()).div(reward);
      const amount = winners.mul(reward).sub(new BN(available.toString()));

      await fundVault(bounty, gem.mint, reserve.address, amount, _);
      const vault = loadVault(bounty, _);
      return { bounty, vault };
    })
  );

  console.log('Bounties funded.');
  return fundedBounties;
}

async function loadVault(pda: PublicKey, { portal, cluster }: Portal) {
  const vaultPDA = getBountyVaultPDA(pda, cluster.asCluster());

  try {
    return await getAccount(portal.provider.connection, vaultPDA);
  } catch (e) {
    return null;
  }
}

async function loadReserve({ portal, authority }: Portal, gem: Token) {
  const { mint } = gem;

  try {
    const address = await getAssociatedTokenAddress(mint, authority.publicKey);
    return await getAccount(portal.provider.connection, address);
  } catch (e) {
    throw new Error('Reserve account not found. Probably and invalid gem.');
  }
}

async function fundVault(
  bounty: PublicKey,
  gem: PublicKey,
  reserve: PublicKey,
  amount: BN,
  { portal, cluster }: Portal
) {
  const confirmOptions = { skipPreflight: true };
  const txHash = await portal.methods
    .fundBounty(amount)
    .accounts({ bounty, gem, reserve })
    .rpc(confirmOptions);

  await confirmAndLogTransaction(txHash, portal.provider.connection, cluster);
  console.log('Vault funded.');

  return { bounty, amount };
}
