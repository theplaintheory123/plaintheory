import { jwtVerify, createRemoteJWKSet } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "lifeos-session";
const region = process.env.COGNITO_REGION || "us-east-1";
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;

const JWKS = createRemoteJWKSet(
  new URL(`https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`)
);

export async function verifyToken(token: string): Promise<{ sub: string; email: string; name?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
    });
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<{ id: string; email: string; name?: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, name: payload.name };
}

export { COOKIE_NAME };
