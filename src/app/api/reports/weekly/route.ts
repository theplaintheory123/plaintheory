import { NextRequest, NextResponse } from "next/server";
import { getTasks } from "@/lib/db/tasks";
import { getFocusSessions } from "@/lib/db/focus";
import { getHabits, getTodayChecks } from "@/lib/db/habits";
import { getUserPrefs } from "@/lib/db/prefs";
import { saveReport } from "@/lib/db/reports";
import { generateWeeklyHTML } from "@/lib/reports/generate-weekly";
import { sendReport } from "@/lib/reports/email";
import { startOfWeek, endOfWeek } from "@/lib/utils";
import { db, TABLE } from "@/lib/db/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

function authorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.REPORT_CRON_SECRET}`;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Get all users (scan for PREFS items)
  const res = await db.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression: "#type = :t",
      ExpressionAttributeNames: { "#type": "type" },
      ExpressionAttributeValues: { ":t": "PREFS" },
    })
  );

  const users = res.Items || [];
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const results = await Promise.allSettled(
    users.map(async (u: any) => {
      const userId = u.userId;
      const [tasks, sessions, habits] = await Promise.all([
        getTasks(userId),
        getFocusSessions(userId, 7),
        getHabits(userId),
      ]);
      const checks = await getTodayChecks(userId, weekStart.toISOString().split("T")[0]);

      const html = generateWeeklyHTML({
        userName: u.displayName || u.email,
        weekStart,
        weekEnd,
        tasks: tasks.filter((t) => {
          const d = new Date(t.updatedAt);
          return t.completed && d >= weekStart && d <= weekEnd;
        }),
        focusSessions: sessions,
        habits,
        checks,
      });

      await saveReport(userId, "weekly", weekStart.toISOString(), weekEnd.toISOString(), html);
      if (u.email) {
        await sendReport({ to: u.email, subject: `Your Weekly Review — ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, html });
      }
    })
  );

  return NextResponse.json({ processed: users.length });
}
