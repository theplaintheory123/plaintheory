"use client";

import { useState, useEffect } from "react";
import { Save, MapPin } from "lucide-react";

export default function SettingsPage() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [focusDur, setFocusDur] = useState("25");
  const [breakDur, setBreakDur] = useState("5");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetch("/api/auth/user")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          // Prefs loaded server side — future enhancement: load prefs via API
        }
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weatherLocation: lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : null,
        focusDurationMinutes: parseInt(focusDur),
        breakDurationMinutes: parseInt(breakDur),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function autoLocate() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLon(pos.coords.longitude.toFixed(4));
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#1A1817]">Settings</h1>
        <p className="mt-1 text-sm text-[#1A1817]/50">Configure your dashboard preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Weather */}
        <div className="rounded-2xl border border-[#1A1817]/6 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-[#1A1817]">Weather Location</h2>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[#1A1817]/50">Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="51.5074"
                className="w-full rounded-xl border border-[#1A1817]/10 bg-[#FAF8F5] px-3 py-2 text-sm outline-none focus:border-[#C2786B]/40"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[#1A1817]/50">Longitude</label>
              <input
                type="text"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="-0.1276"
                className="w-full rounded-xl border border-[#1A1817]/10 bg-[#FAF8F5] px-3 py-2 text-sm outline-none focus:border-[#C2786B]/40"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={autoLocate}
            disabled={locating}
            className="flex items-center gap-1.5 text-xs text-[#C2786B] hover:underline disabled:opacity-50"
          >
            <MapPin size={12} />
            {locating ? "Locating…" : "Use my location"}
          </button>
        </div>

        {/* Focus timer */}
        <div className="rounded-2xl border border-[#1A1817]/6 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-[#1A1817]">Focus Timer</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[#1A1817]/50">Focus duration (min)</label>
              <input
                type="number"
                value={focusDur}
                onChange={(e) => setFocusDur(e.target.value)}
                min={5}
                max={120}
                className="w-full rounded-xl border border-[#1A1817]/10 bg-[#FAF8F5] px-3 py-2 text-sm outline-none focus:border-[#C2786B]/40"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[#1A1817]/50">Break duration (min)</label>
              <input
                type="number"
                value={breakDur}
                onChange={(e) => setBreakDur(e.target.value)}
                min={1}
                max={30}
                className="w-full rounded-xl border border-[#1A1817]/10 bg-[#FAF8F5] px-3 py-2 text-sm outline-none focus:border-[#C2786B]/40"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#1A1817] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A1817]/80 disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving…" : saved ? "Saved!" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
