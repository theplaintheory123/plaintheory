import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const COOKIE_NAME = "lifeos-session";
const region = process.env.COGNITO_REGION || "us-east-1";
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;

const JWKS = createRemoteJWKSet(
  new URL(`https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`)
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /app/* routes
  if (pathname.startsWith("/app")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    try {
      await jwtVerify(token, JWKS, {
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      });
    } catch {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // Redirect signed-in users away from auth pages
  if (["/sign-in", "/sign-up"].includes(pathname)) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, JWKS, {
          issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        });
        return NextResponse.redirect(new URL("/app", request.url));
      } catch {
        // Token invalid, let them proceed to sign-in
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/sign-in", "/sign-up"],
};
