import { Task, FocusSession, Habit } from "@/types";

interface AnnualData {
  userName: string;
  year: number;
  tasks: Task[];
  focusSessions: FocusSession[];
  habits: Habit[];
}

function monthlyBars(data: number[], color = "#C2786B"): string {
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const max = Math.max(...data, 1);
  const w = 520, h = 100, bw = 32;
  const bars = data.map((v, i) => {
    const bh = Math.round((v / max) * 60);
    const x = 8 + i * (w / 12);
    const y = h - bh - 20;
    return `
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${color}" rx="4" opacity="0.85"/>
      <text x="${x + bw / 2}" y="${h - 4}" text-anchor="middle" font-size="9" fill="#1A1817" opacity="0.4">${months[i]}</text>`;
  }).join("");
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;">${bars}</svg>`;
}

export function generateAnnualHTML(data: AnnualData, shareToken: string): string {
  const completedTasks = data.tasks.filter((t) => t.completed);
  const totalFocusMinutes = data.focusSessions.reduce((s, f) => s + f.durationMinutes, 0);
  const totalFocusHours = Math.round(totalFocusMinutes / 60);

  const monthlyTasks = Array(12).fill(0);
  const monthlyFocus = Array(12).fill(0);
  completedTasks.forEach((t) => {
    const m = new Date(t.updatedAt).getMonth();
    monthlyTasks[m]++;
  });
  data.focusSessions.forEach((s) => {
    const m = new Date(s.completedAt).getMonth();
    monthlyFocus[m] += Math.round(s.durationMinutes / 60);
  });

  const longestStreak = Math.max(...data.habits.map((h) => h.longestStreak), 0);
  const topHabit = data.habits.sort((a, b) => b.longestStreak - a.longestStreak)[0];

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reports/annual/${data.year}?token=${shareToken}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${data.year} in Review — ${data.userName} · Plaintheory</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1A1817; }
    .container { max-width: 720px; margin: 0 auto; padding: 40px 24px; }
    .hero { text-align: center; padding: 80px 24px; background: #1A1817; border-radius: 24px; margin-bottom: 32px; }
    .hero .year { font-size: 96px; font-weight: 200; color: #C2786B; line-height: 1; }
    .hero .title { font-size: 18px; color: #FAF8F5; opacity: 0.6; margin-top: 8px; }
    .hero .name { font-size: 14px; color: #FAF8F5; opacity: 0.4; margin-top: 4px; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat { background: #fff; border-radius: 16px; padding: 28px 24px; text-align: center; box-shadow: 0 2px 12px rgba(26,24,23,0.06); }
    .stat-val { font-size: 48px; font-weight: 300; color: #C2786B; }
    .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #1A1817; opacity: 0.4; margin-top: 6px; }
    .card { background: #fff; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 2px 12px rgba(26,24,23,0.06); }
    .card-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #1A1817; opacity: 0.4; margin-bottom: 20px; font-weight: 500; }
    .habit-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0ece8; }
    .habit-row:last-child { border-bottom: none; }
    .streak { font-size: 13px; color: #C2786B; margin-left: auto; }
    .share-box { background: #1A1817; color: #FAF8F5; border-radius: 16px; padding: 32px; margin-top: 32px; text-align: center; }
    .share-url { font-family: monospace; font-size: 12px; color: #C2786B; margin-top: 12px; word-break: break-all; }
    @media (max-width: 480px) { .stats { grid-template-columns: 1fr 1fr; } .hero .year { font-size: 64px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <div class="year">${data.year}</div>
      <div class="title">Your Year in Review</div>
      <div class="name">${data.userName}</div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-val">${completedTasks.length}</div>
        <div class="stat-label">Tasks Done</div>
      </div>
      <div class="stat">
        <div class="stat-val">${totalFocusHours}h</div>
        <div class="stat-label">Focus Time</div>
      </div>
      <div class="stat">
        <div class="stat-val">${longestStreak}</div>
        <div class="stat-label">Best Streak</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Tasks Completed Each Month</div>
      ${monthlyBars(monthlyTasks)}
    </div>

    <div class="card">
      <div class="card-title">Focus Hours Each Month</div>
      ${monthlyBars(monthlyFocus, "#A88B7D")}
    </div>

    ${data.habits.length > 0 ? `
    <div class="card">
      <div class="card-title">Habits This Year</div>
      ${data.habits.map((h) => `
        <div class="habit-row">
          <span style="font-size:20px;">${h.emoji}</span>
          <span style="font-size:14px;">${h.name}</span>
          <span class="streak">🔥 ${h.longestStreak}d best</span>
        </div>`).join("")}
    </div>` : ""}

    ${topHabit ? `
    <div class="card" style="background:#FAF8F5;">
      <div class="card-title">Standout Habit</div>
      <p style="font-size:32px;margin-bottom:8px;">${topHabit.emoji} ${topHabit.name}</p>
      <p style="font-size:14px;opacity:0.6;">Best streak: <strong>${topHabit.longestStreak} days</strong></p>
    </div>` : ""}

    <div class="share-box">
      <p style="opacity:0.6;font-size:13px;">Share your year</p>
      <p class="share-url">${shareUrl}</p>
    </div>
  </div>
</body>
</html>`;
}
