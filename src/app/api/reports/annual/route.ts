import { NextRequest, NextResponse } from "next/server";
import { getTasks } from "@/lib/db/tasks";
import { getFocusSessions } from "@/lib/db/focus";
import { getHabits } from "@/lib/db/habits";
import { saveReport } from "@/lib/db/reports";
import { generateAnnualHTML } from "@/lib/reports/generate-annual";
import { sendReport } from "@/lib/reports/email";
import { generateId } from "@/lib/utils";
import { db, TABLE } from "@/lib/db/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

function authorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.REPORT_CRON_SECRET}`;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const year = new Date().getFullYear() - 1;
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

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
        getFocusSessions(u.userId, 365),
        getHabits(u.userId),
      ]);
      const shareToken = generateId();
      const html = generateAnnualHTML(
        { userName: u.displayName || u.email, year, tasks, focusSessions: sessions, habits },
        shareToken
      );
      await saveReport(u.userId, "annual", yearStart.toISOString(), yearEnd.toISOString(), html, shareToken);
      if (u.email) {
        await sendReport({ to: u.email, subject: `Your ${year} Year in Review — Plaintheory`, html });
      }
    })
  );

  return NextResponse.json({ processed: users.length });
}
