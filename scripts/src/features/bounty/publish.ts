import { BN } from '@coral-xyz/anchor';

import { confirmAndLogTransaction, Portal } from '../../utils';
import { Modes } from '../game-mode';

import { Token } from '@utils/token';
import { getBountyPDA } from '@luckyland/anchor';

type BountyInput = {
  price: string;
  reward: string;
};

export async function PublishBounties(
  portal: Portal,
  modes: Modes,
  gem: Token,
  trader: Token
) {
  console.log('------------------ Bounties ------------------');
  console.log(
    `Publishing bounties for gem:${gem.name} | trader:${trader.name}`
  );

  const bounties = await Promise.all(
    modes.map((mode) => {
      const { name, bounties } = mode;
      console.log(`Bounties for: ${name}`);

      return Promise.all(
        bounties.map(async ({ bounty }) =>
          publishBounty(mode, gem, trader, bounty, portal)
        )
      );
    })
  );

  console.log('Bounties published.');
  return bounties.flat();
}

async function publishBounty(
  { pda: task, name }: Modes[number],
  gem: Token,
  trader: Token,
  bounty: BountyInput,
  { portal, cluster }: Portal
) {
  const log = (() => {
    const prefix = `BOUNTY|${gem.symbol}x${trader.symbol}|${name.padStart(
      20,
      ' '
    )} =>\t`;
    return (...args: unknown[]) => console.log(prefix, ...args);
  })();

  log('Publishing...');
  log('Retrieving bounty details...');

  const pda = getBountyPDA(task, gem.mint, trader.mint, cluster.asCluster());
  let _bounty = await portal.account.bounty.fetchNullable(pda);

  if (_bounty) {
    log('Bounty already exists.');
    return { pda, ..._bounty };
  }

  log('Bounty not found. Creating...');
  const price = new BN(BigInt(`0x${bounty.price}`).toString());
  const reward = new BN(BigInt(`0x${bounty.reward}`).toString());

  const confirmOptions = { skipPreflight: true };
  const txHash = await portal.methods
    .issueBounty({ price, reward })
    .accounts({ task, gem: gem.mint, trader: trader.mint })
    .rpc(confirmOptions);

  await confirmAndLogTransaction(txHash, portal.provider.connection, cluster);
  _bounty = await portal.account.bounty.fetch(pda);
  log('Bounty created.');

  return { pda, ..._bounty };
}
