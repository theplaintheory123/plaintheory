"use client";

import { WeatherData } from "@/types";

const WEATHER_ICONS: Record<string, string> = {
  "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️",
};

export default function WeatherDisplay({ data }: { data: WeatherData }) {
  const icon = WEATHER_ICONS[data.current.icon] || "🌡️";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[#1A1817]/40">Weather</h3>
        <span className="text-xs text-[#1A1817]/30">{data.location}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-5xl">{icon}</span>
        <div>
          <p className="text-3xl font-light text-[#1A1817] tracking-tight">{data.current.temp}°</p>
          <p className="text-xs capitalize text-[#1A1817]/50">{data.current.description}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4 text-xs text-[#1A1817]/40">
        <span>Feels {data.current.feelsLike}°</span>
        <span>{data.current.humidity}% humidity</span>
        <span>{data.current.windSpeed} m/s</span>
      </div>

      {/* 3-day forecast */}
      <div className="flex gap-2 mt-auto">
        {data.forecast.map((day) => (
          <div key={day.date} className="flex-1 rounded-xl bg-[#FAF8F5] p-2.5 text-center">
            <p className="text-[10px] text-[#1A1817]/40 mb-1">
              {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
            </p>
            <p className="text-xl mb-1">{WEATHER_ICONS[day.icon] || "🌡️"}</p>
            <p className="text-xs font-medium text-[#1A1817]">{Math.round(day.high)}°</p>
            <p className="text-[10px] text-[#1A1817]/40">{Math.round(day.low)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}
