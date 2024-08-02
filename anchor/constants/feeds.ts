import { Cluster, PublicKey } from '@solana/web3.js';

const DECIMALS = 8;

export function getUSDToSOLFeed(cluster?: Cluster) {
  switch (cluster) {
    case 'mainnet-beta':
      return {
        feed: new PublicKey('CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt'),
        decimals: DECIMALS,
      };
    case 'devnet':
    case 'testnet':
    default:
      return {
        feed: new PublicKey('99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR'),
        decimals: DECIMALS,
      };
  }
}
