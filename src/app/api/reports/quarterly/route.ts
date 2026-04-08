import { NextRequest, NextResponse } from "next/server";
import { getTasks } from "@/lib/db/tasks";
import { getFocusSessions } from "@/lib/db/focus";
import { getHabits } from "@/lib/db/habits";
import { saveReport } from "@/lib/db/reports";
import { generateQuarterlyHTML } from "@/lib/reports/generate-quarterly";
import { sendReport } from "@/lib/reports/email";
import { db, TABLE } from "@/lib/db/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

function authorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.REPORT_CRON_SECRET}`;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const now = new Date();
  const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const quarterEnd = new Date(quarterStart);
  quarterEnd.setMonth(quarterEnd.getMonth() + 3);
  quarterEnd.setDate(quarterEnd.getDate() - 1);

  const res = await db.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression: "#type = :t",
      ExpressionAttributeNames: { "#type": "type" },
      ExpressionAttributeValues: { ":t": "PREFS" },
    })
  );

  const users = res.Items || [];
  await Promise.allSettled(
    users.map(async (u: any) => {
      const [tasks, sessions, habits] = await Promise.all([
        getTasks(u.userId),
        getFocusSessions(u.userId, 90),
        getHabits(u.userId),
      ]);
      const html = generateQuarterlyHTML({
        userName: u.displayName || u.email,
        quarterStart,
        quarterEnd,
        tasks,
        focusSessions: sessions,
        habits,
      });
      await saveReport(u.userId, "quarterly", quarterStart.toISOString(), quarterEnd.toISOString(), html);
      if (u.email) {
        await sendReport({ to: u.email, subject: `Your Quarterly Report — Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}`, html });
      }
    })
  );

  return NextResponse.json({ processed: users.length });
}
