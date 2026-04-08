import { getSessionUser } from "@/lib/auth/session";
import { getUserPrefs } from "@/lib/db/prefs";
import { fetchWeather } from "@/lib/weather";
import WeatherDisplay from "./WeatherDisplay";
import Link from "next/link";

export default async function WeatherWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const prefs = await getUserPrefs(user.id);

  if (!prefs?.weatherLocation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="text-4xl opacity-30">☀️</div>
        <p className="text-sm text-[#1A1817]/40">Set your location in</p>
        <Link href="/app/settings" className="rounded-full border border-[#C2786B]/30 px-3 py-1 text-xs text-[#C2786B] hover:bg-[#C2786B]/10 transition">
          Settings
        </Link>
      </div>
    );
  }

  try {
    const data = await fetchWeather(prefs.weatherLocation.lat, prefs.weatherLocation.lon);
    return <WeatherDisplay data={data} />;
  } catch {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-[#1A1817]/30">Weather unavailable</p>
      </div>
    );
  }
}
