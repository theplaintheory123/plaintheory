import CalendarDisplay from "./CalendarDisplay";

export default function CalendarWidget() {
  // Calendar events are fetched client-side since they require a Google OAuth token
  return <CalendarDisplay />;
}
