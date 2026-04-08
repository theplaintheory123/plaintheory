import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { FocusSession } from "@/types";
import { generateId } from "@/lib/utils";

export async function getFocusSessions(userId: string, days = 30): Promise<FocusSession[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": "FOCUS#" },
    })
  );
  return ((res.Items || []) as FocusSession[]).filter(
    (s) => new Date(s.completedAt) >= cutoff
  );
}

export async function logFocusSession(userId: string, durationMinutes: number): Promise<FocusSession> {
  const completedAt = new Date().toISOString();
  const id = generateId();
  const item: FocusSession = { id, userId, durationMinutes, completedAt };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: pk(userId),
        SK: sk.focus(completedAt),
        GSI1PK: pk(userId),
        GSI1SK: `FOCUS#${completedAt.split("T")[0]}`,
        type: "FOCUS_SESSION",
        ...item,
      },
    })
  );
  return item;
}
