import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getUserPrefs } from "@/lib/db/prefs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("token");

  if (!accessToken) {
    const prefs = await getUserPrefs(user.id);
    if (!prefs?.calendarConnected) {
      return NextResponse.json({ events: [], needsSetup: true });
    }
    return NextResponse.json({ events: [], message: "Calendar connected but no token provided" });
  }

  const { fetchCalendarEvents } = await import("@/lib/calendar");
  try {
    const events = await fetchCalendarEvents(accessToken);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [], error: "Calendar fetch failed" });
  }
}
