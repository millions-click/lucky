type JWTProps = {
  iat: number;
  exp: number;
};

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

export type TurnsSession = Turns & JWTProps;

export type LuckyPass = {
  address?: string;
  seed: Seed;
  ttl: number;
  activated?: number;
  code?: string; // Only active for the temporary pass.
};

export type LuckyPassSession = LuckyPass & JWTProps;

export const TURNS_AVAILABLE = 2;
export const MAX_TTL_ATTEMPTS = 5; // MAX 16 MINUTES to refresh the attempts.
export const TURNS_COOKIE = 'll-turns';
export const ATTEMPTS_COOKIE = 'll-attempts';
export const LUCKY_PASS_COOKIE = 'll-pass';
export const LUCKY_PASS_TTL = 60 * 60; // 1 hour in seconds.
