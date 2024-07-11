import { cookies } from 'next/headers';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';

const { AUTH_SECRET } = process.env;
if (!AUTH_SECRET) throw new Error('AUTH_SECRET is required');

const key = new TextEncoder().encode(AUTH_SECRET);

export async function encrypt(
  payload: Record<string, unknown>,
  expires: string | number | Date = '1 minute'
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

export async function safeDecrypt(input: string, cookie: string) {
  try {
    return await decrypt(input);
  } catch (e: any) {
    switch (e.code) {
      case 'ERR_JWT_EXPIRED':
      case 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED':
      case 'ERR_JWS_INVALID':
        cookies().set(cookie, '', { maxAge: 0 });
        break;
      default:
        console.log('safeDecrypt', cookie, e.name, e.code, e.message);
    }
  }
  return null;
}
