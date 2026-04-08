import { getSessionUser } from "@/lib/auth/session";
import { getUserPrefs } from "@/lib/db/prefs";
import { fetchWeather } from "@/lib/weather";
import WeatherDisplay from "./WeatherDisplay";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Cloud } from "lucide-react";
import Link from "next/link";

export default async function WeatherWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const prefs = await getUserPrefs(user.id);

  if (!prefs?.weatherLocation) {
    return (
      <>
        <CardHeader className="border-b border-stone-100 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <Cloud size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Weather</span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="text-4xl">☀️</span>
          <p className="text-sm text-stone-400">Set your location to see weather</p>
          <Link href="/app/settings" className="text-xs text-[#C2786B] underline-offset-2 hover:underline">
            Open Settings →
          </Link>
        </CardContent>
      </>
    );
  }

  try {
    const data = await fetchWeather(prefs.weatherLocation.lat, prefs.weatherLocation.lon);
    return <WeatherDisplay data={data} />;
  } catch {
    return (
      <CardContent className="flex items-center justify-center py-12">
        <p className="text-sm text-stone-400">Weather unavailable</p>
      </CardContent>
    );
  }
}
