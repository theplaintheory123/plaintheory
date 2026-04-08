import { Task, FocusSession, Habit } from "@/types";
import { formatShortDate } from "@/lib/utils";

interface QuarterlyData {
  userName: string;
  quarterStart: Date;
  quarterEnd: Date;
  tasks: Task[];
  focusSessions: FocusSession[];
  habits: Habit[];
  prevQuarterTaskCount?: number;
  prevQuarterFocusMinutes?: number;
}

function svgBar(values: number[], labels: string[], color = "#C2786B"): string {
  const max = Math.max(...values, 1);
  const w = 460, h = 120, barW = Math.floor(w / values.length) - 8;
  const bars = values.map((v, i) => {
    const bh = Math.round((v / max) * 80);
    const x = i * (w / values.length) + 4;
    const y = h - bh - 24;
    return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" fill="${color}" rx="3" opacity="0.8"/>
            <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" font-size="10" fill="#1A1817" opacity="0.5">${labels[i]}</text>`;
  }).join("");
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
}

export function generateQuarterlyHTML(data: QuarterlyData): string {
  const completedTasks = data.tasks.filter((t) => t.completed).length;
  const totalFocusMinutes = data.focusSessions.reduce((s, f) => s + f.durationMinutes, 0);
  const focusHours = Math.round(totalFocusMinutes / 60);

  // Group by month
  const months: Record<string, { tasks: number; focusMinutes: number }> = {};
  data.tasks.forEach((t) => {
    if (t.completed) {
      const m = t.updatedAt.substring(0, 7);
      if (!months[m]) months[m] = { tasks: 0, focusMinutes: 0 };
      months[m].tasks++;
    }
  });
  data.focusSessions.forEach((s) => {
    const m = s.completedAt.substring(0, 7);
    if (!months[m]) months[m] = { tasks: 0, focusMinutes: 0 };
    months[m].focusMinutes += s.durationMinutes;
  });
  const monthKeys = Object.keys(months).sort().slice(-3);
  const taskValues = monthKeys.map((k) => months[k]?.tasks || 0);
  const focusValues = monthKeys.map((k) => Math.round((months[k]?.focusMinutes || 0) / 60));
  const monthLabels = monthKeys.map((k) => {
    const d = new Date(k + "-01");
    return d.toLocaleDateString("en-US", { month: "short" });
  });

  const taskDelta = data.prevQuarterTaskCount
    ? completedTasks - data.prevQuarterTaskCount
    : null;
  const focusDelta = data.prevQuarterFocusMinutes
    ? totalFocusMinutes - data.prevQuarterFocusMinutes
    : null;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Quarterly Report — Plaintheory</title></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:640px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,24,23,0.08);">

    <div style="background:#1A1817;padding:48px;text-align:center;">
      <p style="margin:0 0 8px;color:#C2786B;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;">Quarterly Report</p>
      <h1 style="margin:0;color:#FAF8F5;font-size:32px;font-weight:300;">3 Months of Progress</h1>
      <p style="margin:12px 0 0;color:#FAF8F5;opacity:0.5;font-size:14px;">
        ${formatShortDate(data.quarterStart)} — ${formatShortDate(data.quarterEnd)}
      </p>
    </div>

    <div style="padding:40px;border-bottom:1px solid #f0ece8;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding:0 16px;">
            <div style="font-size:48px;font-weight:300;color:#C2786B;">${completedTasks}</div>
            <div style="font-size:12px;color:#1A1817;opacity:0.5;text-transform:uppercase;letter-spacing:0.1em;">Tasks Completed</div>
            ${taskDelta !== null ? `<div style="font-size:12px;color:${taskDelta >= 0 ? "#22c55e" : "#ef4444"};margin-top:4px;">${taskDelta >= 0 ? "+" : ""}${taskDelta} vs last quarter</div>` : ""}
          </td>
          <td style="border-left:1px solid #f0ece8;text-align:center;padding:0 16px;">
            <div style="font-size:48px;font-weight:300;color:#C2786B;">${focusHours}h</div>
            <div style="font-size:12px;color:#1A1817;opacity:0.5;text-transform:uppercase;letter-spacing:0.1em;">Focus Time</div>
            ${focusDelta !== null ? `<div style="font-size:12px;color:${focusDelta >= 0 ? "#22c55e" : "#ef4444"};margin-top:4px;">${focusDelta >= 0 ? "+" : ""}${Math.round(focusDelta / 60)}h vs last quarter</div>` : ""}
          </td>
          <td style="border-left:1px solid #f0ece8;text-align:center;padding:0 16px;">
            <div style="font-size:48px;font-weight:300;color:#C2786B;">${data.habits.length}</div>
            <div style="font-size:12px;color:#1A1817;opacity:0.5;text-transform:uppercase;letter-spacing:0.1em;">Active Habits</div>
          </td>
        </tr>
      </table>
    </div>

    ${monthKeys.length > 0 ? `
    <div style="padding:40px;border-bottom:1px solid #f0ece8;">
      <h2 style="margin:0 0 24px;font-size:14px;text-transform:uppercase;letter-spacing:0.15em;color:#1A1817;opacity:0.5;font-weight:500;">Tasks per Month</h2>
      ${svgBar(taskValues, monthLabels)}
    </div>
    <div style="padding:40px;border-bottom:1px solid #f0ece8;">
      <h2 style="margin:0 0 24px;font-size:14px;text-transform:uppercase;letter-spacing:0.15em;color:#1A1817;opacity:0.5;font-weight:500;">Focus Hours per Month</h2>
      ${svgBar(focusValues, monthLabels, "#A88B7D")}
    </div>` : ""}

    <div style="padding:32px 40px;background:#FAF8F5;text-align:center;">
      <p style="margin:0 0 8px;font-size:14px;color:#1A1817;opacity:0.5;">Keep the momentum going next quarter.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/app" style="display:inline-block;background:#C2786B;color:#fff;padding:12px 32px;border-radius:99px;text-decoration:none;font-size:14px;">Open Dashboard</a>
    </div>

    <div style="padding:24px 40px;text-align:center;border-top:1px solid #f0ece8;">
      <p style="margin:0;font-size:12px;color:#1A1817;opacity:0.4;">Plaintheory LifeOS</p>
    </div>
  </div>
</body>
</html>`;
}
