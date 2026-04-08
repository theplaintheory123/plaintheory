import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getFocusSessions, logFocusSession } from "@/lib/db/focus";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sessions = await getFocusSessions(user.id);
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { durationMinutes } = await req.json();
  const session = await logFocusSession(user.id, durationMinutes || 25);
  return NextResponse.json({ session }, { status: 201 });
}
