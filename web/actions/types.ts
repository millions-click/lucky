export type Seed = {
  value: number;
  trigger: number;
  timestamp: number;
};

export type Turns = {
  address?: string;
  hold?: boolean;
  turns: number;
  expires: number;
  attempts: number;
};

export type TurnsSession = Turns & {
  iat: number;
  exp: number;
};

export const TURNS_AVAILABLE = 2;
export const TURNS_COOKIE = 'll-turns';
export const ATTEMPTS_COOKIE = 'll-attempts';
