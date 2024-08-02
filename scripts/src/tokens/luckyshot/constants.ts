import { join } from 'node:path';
import { getTokenDefinition } from '@constants';

const {
  name: NAME,
  symbol: SYMBOL,
  decimals: DECIMALS,
  PIECES_PER_TOKEN,
} = getTokenDefinition('LS');

export { NAME, SYMBOL, DECIMALS, PIECES_PER_TOKEN };
export const TRADES_TO_MINT = BigInt(1000000000);
export const TRADES_FOR_MARKETING = BigInt(60000);
export const TRADES_FOR_SALE = TRADES_TO_MINT - TRADES_FOR_MARKETING;
const IDS_BASE_PATH = '~/.config/solana/luckyland';

export enum ID_NAME {
  TRADER = 'trader-id.json',
  PAYER = 'payer-id.json',
  MINTER = 'minter-id.json',
}

export function idPath(name: ID_NAME) {
  return join(IDS_BASE_PATH, name);
}
