import { join } from 'node:path';
import { getTokenDefinition } from '@constants';

const {
  name: NAME,
  symbol: SYMBOL,
  decimals: DECIMALS,
  PIECES_PER_TOKEN: PIECES_PER_GEM,
} = getTokenDefinition('LUCK');

export { NAME, SYMBOL, DECIMALS, PIECES_PER_GEM };
export const GEMS_FOR_PRESALE = BigInt(175_000_000);
export const GEMS_TO_STOCKPILE = BigInt(425_000_000);
const IDS_BASE_PATH = '~/.config/solana/luckyland';

export enum ID_NAME {
  GEM = 'gem-id.json',
  PAYER = 'payer-id.json',
  MINTER = 'minter-id.json',
  SUPPLIER = 'supplier-id.json',
}

export function idPath(name: ID_NAME) {
  return join(IDS_BASE_PATH, name);
}
