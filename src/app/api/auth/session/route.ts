import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth/session";
import { upsertUserPrefs } from "@/lib/db/prefs";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  // Ensure user prefs exist — non-blocking, don't let DB errors crash sign-in
  upsertUserPrefs(payload.sub, {
    email: payload.email,
    displayName: payload.name || payload.email.split("@")[0],
  }).catch((err) => console.error("[session] upsertUserPrefs failed:", err.message));

  const res = NextResponse.json({ user: { id: payload.sub, email: payload.email, name: payload.name } });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
