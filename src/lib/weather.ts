import { WeatherData } from "@/types";

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHERMAP_API_KEY not set");

  const [currentRes, forecastRes] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 1800 } }
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=24`,
      { next: { revalidate: 1800 } }
    ),
  ]);

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  // Group forecast by day
  const dailyMap: Record<string, { highs: number[]; lows: number[]; descriptions: string[]; icons: string[] }> = {};
  for (const item of forecast.list || []) {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap[date]) dailyMap[date] = { highs: [], lows: [], descriptions: [], icons: [] };
    dailyMap[date].highs.push(item.main.temp_max);
    dailyMap[date].lows.push(item.main.temp_min);
    dailyMap[date].descriptions.push(item.weather[0].description);
    dailyMap[date].icons.push(item.weather[0].icon);
  }

  const forecastDays = Object.entries(dailyMap)
    .slice(0, 3)
    .map(([date, d]) => ({
      date,
      high: Math.max(...d.highs),
      low: Math.min(...d.lows),
      description: d.descriptions[Math.floor(d.descriptions.length / 2)],
      icon: d.icons[Math.floor(d.icons.length / 2)],
    }));

  return {
    current: {
      temp: Math.round(current.main?.temp ?? 0),
      feelsLike: Math.round(current.main?.feels_like ?? 0),
      description: current.weather?.[0]?.description ?? "",
      icon: current.weather?.[0]?.icon ?? "01d",
      humidity: current.main?.humidity ?? 0,
      windSpeed: Math.round(current.wind?.speed ?? 0),
    },
    forecast: forecastDays,
    location: current.name || "Unknown",
  };
}
