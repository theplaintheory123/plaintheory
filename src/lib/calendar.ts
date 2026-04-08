import { CalendarEvent } from "@/types";

export async function fetchCalendarEvents(accessToken: string): Promise<CalendarEvent[]> {
  const now = new Date();
  const weekLater = new Date(now);
  weekLater.setDate(weekLater.getDate() + 7);

  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: weekLater.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "20",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) throw new Error("Calendar fetch failed");
  const data = await res.json();

  return (data.items || []).map((item: any): CalendarEvent => ({
    id: item.id,
    title: item.summary || "Untitled event",
    start: item.start?.dateTime || item.start?.date || "",
    end: item.end?.dateTime || item.end?.date || "",
    allDay: !item.start?.dateTime,
    location: item.location,
  }));
}
