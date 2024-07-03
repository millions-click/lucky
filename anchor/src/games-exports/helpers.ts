import { BN } from '@coral-xyz/anchor';
import { GAME_NAME_LEN } from './constants';

export function encodeName(name: string) {
  const buffer = new TextEncoder().encode(name);
  const MAX_LEN = GAME_NAME_LEN - 1;
  return Array.from({ length: GAME_NAME_LEN }, (_, i) =>
    i === MAX_LEN ? 0 : buffer[i] ?? 0
  );
}

export function decodeName(name: number[]) {
  return new TextDecoder().decode(Uint8Array.from(name));
}

function toPrecision(value: string, decimals = 0) {
  return Number.parseFloat(value).toFixed(decimals).replace('.', '');
}

export function toBigInt(value?: number, decimals = 0) {
  if (!value || (typeof value === 'number' && isNaN(value))) return BigInt(0);
  if (decimals < 0) throw new Error('Decimals must be a positive number');

  return BigInt(toPrecision(value.toString(), decimals));
}

export function toBN(value?: number, decimals = 0) {
  return new BN(toBigInt(value, decimals).toString());
}

export function fromBigInt(value?: bigint, decimals = 0) {
  if (!value) return 0;
  if (decimals < 0) throw new Error('Decimals must be a positive number');

  const str = value.toString();
  const floating = str.length - decimals;

  if (floating <= 0) return Number(`0.${str.padStart(decimals, '0')}`);

  const integer = str.slice(0, floating);
  const fraction = str.slice(floating);
  return Number(`${integer}.${fraction}`);
}

export function fromBN(value?: BN, decimals = 0) {
  if (!value) return 0;
  return fromBigInt(BigInt(value.toString()), decimals);
}

export function formatAmount(value?: number | bigint) {
  if (!value) return '0';
  return Intl.NumberFormat('en-US').format(value);
}
