import { type JWTPayload, jwtVerify, SignJWT } from 'jose';

const { AUTH_SECRET } = process.env;
if (!AUTH_SECRET) throw new Error('AUTH_SECRET is required');

const key = new TextEncoder().encode(AUTH_SECRET);

export async function encrypt(
  payload: Record<string, unknown>,
  expires: string | number | Date = '1 h'
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });

  return payload;
}
