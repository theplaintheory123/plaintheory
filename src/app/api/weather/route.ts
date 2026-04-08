import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getUserPrefs } from "@/lib/db/prefs";
import { fetchWeather } from "@/lib/weather";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lon = parseFloat(searchParams.get("lon") || "");

  if (!isNaN(lat) && !isNaN(lon)) {
    const data = await fetchWeather(lat, lon);
    return NextResponse.json({ data });
  }

  const prefs = await getUserPrefs(user.id);
  if (!prefs?.weatherLocation) {
    return NextResponse.json({ data: null, needsSetup: true });
  }

  const data = await fetchWeather(prefs.weatherLocation.lat, prefs.weatherLocation.lon);
  return NextResponse.json({ data });
}
