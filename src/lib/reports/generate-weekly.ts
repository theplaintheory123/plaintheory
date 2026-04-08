import { Task, FocusSession, Habit, HabitCheck } from "@/types";
import { formatShortDate } from "@/lib/utils";

interface WeeklyData {
  userName: string;
  weekStart: Date;
  weekEnd: Date;
  tasks: Task[];
  focusSessions: FocusSession[];
  habits: Habit[];
  checks: HabitCheck[];
  weatherSummary?: string;
  quote?: string;
}

const QUOTES = [
  "Small steps every day lead to great distances.",
  "The secret of getting ahead is getting started.",
  "Progress, not perfection.",
  "Do something today that your future self will thank you for.",
  "One day at a time. One habit at a time.",
];

export function generateWeeklyHTML(data: WeeklyData): string {
  const completedTasks = data.tasks.filter((t) => t.completed);
  const totalFocusMinutes = data.focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const avgFocusPerDay = Math.round(totalFocusMinutes / 7);
  const quote = data.quote || QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const habitRows = data.habits
    .map((h) => {
      const checked = data.checks.filter((c) => c.habitId === h.id && c.completed).length;
      return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ece8;">${h.emoji} ${h.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ece8;text-align:center;">${checked}/7</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ece8;text-align:center;">${h.currentStreak} days</td>
      </tr>`;
    })
    .join("");

  const taskList = completedTasks
    .slice(0, 10)
    .map((t) => `<li style="margin:4px 0;color:#1A1817;">${t.title}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Your Weekly Review — Plaintheory</title></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(26,24,23,0.08);">

    <!-- Header -->
    <div style="background:#1A1817;padding:40px;text-align:center;">
      <p style="margin:0 0 8px;color:#C2786B;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;">Weekly Review</p>
      <h1 style="margin:0;color:#FAF8F5;font-size:28px;font-weight:300;">Your Week in Review</h1>
      <p style="margin:12px 0 0;color:#FAF8F5/60;font-size:14px;opacity:0.6;">
        ${formatShortDate(data.weekStart)} — ${formatShortDate(data.weekEnd)}
      </p>
    </div>

    <!-- Greeting -->
    <div style="padding:32px 40px;border-bottom:1px solid #f0ece8;">
      <p style="margin:0;color:#1A1817;font-size:16px;line-height:1.6;">
        Here's a calm look at how your week unfolded, ${data.userName}.
      </p>
    </div>

    <!-- Stats -->
    <div style="padding:32px 40px;display:flex;gap:24px;border-bottom:1px solid #f0ece8;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;padding:0 12px;">
            <div style="font-size:36px;font-weight:300;color:#C2786B;">${completedTasks.length}</div>
            <div style="font-size:12px;color:#1A1817;opacity:0.5;text-transform:uppercase;letter-spacing:0.1em;">Tasks Done</div>
          </td>
          <td style="text-align:center;padding:0 12px;border-left:1px solid #f0ece8;border-right:1px solid #f0ece8;">
            <div style="font-size:36px;font-weight:300;color:#C2786B;">${avgFocusPerDay}m</div>
            <div style="font-size:12px;color:#1A1817;opacity:0.5;text-transform:uppercase;letter-spacing:0.1em;">Avg Focus / Day</div>
          </td>
          <td style="text-align:center;padding:0 12px;">
            <div style="font-size:36px;font-weight:300;color:#C2786B;">${data.habits.length}</div>
            <div style="font-size:12px;color:#1A1817;opacity:0.5;text-transform:uppercase;letter-spacing:0.1em;">Active Habits</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Completed Tasks -->
    ${completedTasks.length > 0 ? `
    <div style="padding:32px 40px;border-bottom:1px solid #f0ece8;">
      <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:0.15em;color:#1A1817;opacity:0.5;font-weight:500;">Completed This Week</h2>
      <ul style="margin:0;padding-left:20px;">${taskList}</ul>
      ${completedTasks.length > 10 ? `<p style="margin:8px 0 0;font-size:13px;color:#1A1817;opacity:0.4;">+ ${completedTasks.length - 10} more</p>` : ""}
    </div>` : ""}

    <!-- Habits -->
    ${data.habits.length > 0 ? `
    <div style="padding:32px 40px;border-bottom:1px solid #f0ece8;">
      <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:0.15em;color:#1A1817;opacity:0.5;font-weight:500;">Habit Progress</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 12px;color:#1A1817;opacity:0.4;font-weight:500;font-size:12px;">Habit</th>
            <th style="text-align:center;padding:8px 12px;color:#1A1817;opacity:0.4;font-weight:500;font-size:12px;">This Week</th>
            <th style="text-align:center;padding:8px 12px;color:#1A1817;opacity:0.4;font-weight:500;font-size:12px;">Streak</th>
          </tr>
        </thead>
        <tbody>${habitRows}</tbody>
      </table>
    </div>` : ""}

    <!-- Quote -->
    <div style="padding:32px 40px;background:#FAF8F5;text-align:center;">
      <p style="margin:0;font-size:18px;font-style:italic;color:#1A1817;line-height:1.6;">"${quote}"</p>
    </div>

    <!-- Footer -->
    <div style="padding:24px 40px;text-align:center;border-top:1px solid #f0ece8;">
      <p style="margin:0;font-size:12px;color:#1A1817;opacity:0.4;">
        Plaintheory LifeOS · <a href="${process.env.NEXT_PUBLIC_APP_URL}/app" style="color:#C2786B;">View Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
