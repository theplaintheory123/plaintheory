import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "@/lib/db/client";
import { pk } from "@/lib/db/schema";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk(user.id),
        ":prefix": "HABIT_CHECK#",
        ":t": true,
      },
      FilterExpression: "completed = :t",
      ProjectionExpression: "#d",
      ExpressionAttributeNames: { "#d": "date" },
    })
  );

  const checks = (res.Items || []).map((i) => ({ date: i.date as string }));
  return NextResponse.json({ checks });
}
