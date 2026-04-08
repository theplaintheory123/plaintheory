import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getUserPrefs, upsertUserPrefs } from "@/lib/db/prefs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prefs = await getUserPrefs(user.id);
  return NextResponse.json({ prefs });
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const updates = await req.json();
  await upsertUserPrefs(user.id, updates);
  return NextResponse.json({ ok: true });
}
