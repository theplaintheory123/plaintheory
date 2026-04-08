"use client";

import { WeatherData } from "@/types";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Cloud } from "lucide-react";

const ICONS: Record<string, string> = {
  "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️",
};

export default function WeatherDisplay({ data }: { data: WeatherData }) {
  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Weather</span>
          </div>
          <span className="text-xs text-stone-400">{data.location}</span>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Current */}
        <div className="flex items-center gap-4">
          <span className="text-5xl leading-none">{ICONS[data.current.icon] || "🌡️"}</span>
          <div>
            <p className="text-4xl font-light text-stone-900">{data.current.temp}°<span className="text-lg text-stone-400">C</span></p>
            <p className="text-xs capitalize text-stone-400 mt-0.5">{data.current.description}</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-3 text-xs text-stone-400">
          <span>Feels {data.current.feelsLike}°</span>
          <span className="text-stone-200">·</span>
          <span>{data.current.humidity}% humidity</span>
          <span className="text-stone-200">·</span>
          <span>{data.current.windSpeed} m/s</span>
        </div>

        {/* Forecast */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {data.forecast.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1 rounded-xl bg-stone-50 py-3">
              <p className="text-[10px] font-medium text-stone-400">
                {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <span className="text-xl">{ICONS[day.icon] || "🌡️"}</span>
              <p className="text-xs font-semibold text-stone-700">{Math.round(day.high)}°</p>
              <p className="text-[10px] text-stone-400">{Math.round(day.low)}°</p>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}
