// -----------------------------------------------------------------------------
export type Sale = {
  stage: number;
  amount: number;
  timestamp: number;
  signature: string;
};

export type Sales = {
  address: string;
  sales: Array<Sale>;
  created: number;
  updated: number;
};

/** -------------------------------------------------------------------------
 * @desc Stage of the sale
 *
 * @property {number} id - The stage id.
 * @property {number} available - The `LuckyOne` amount of tokens available to buy in this stage.
 * */
export type Stage = {
  id: number;
  available: number;
};

export type LuckSale = {
  address: string;
  maxPerStage: number;
  stages: Array<Stage>;
};

export type LuckSaleSession = LuckSale & {
  iat: number;
  exp: number;
};

// -----------------------------------------------------------------------------
export const SALE_COOKIE = 'll-sale';
