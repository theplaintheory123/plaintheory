import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { UserPrefs } from "@/types";

export async function getUserPrefs(userId: string): Promise<UserPrefs | null> {
  const res = await db.send(
    new GetCommand({ TableName: TABLE, Key: { PK: pk(userId), SK: sk.prefs() } })
  );
  if (!res.Item) return null;
  return res.Item as UserPrefs;
}

export async function upsertUserPrefs(userId: string, prefs: Partial<UserPrefs>): Promise<void> {
  const existing = await getUserPrefs(userId);
  const merged: UserPrefs = {
    userId,
    email: prefs.email || existing?.email || "",
    displayName: prefs.displayName || existing?.displayName || "",
    weatherLocation: prefs.weatherLocation !== undefined ? prefs.weatherLocation : (existing?.weatherLocation ?? null),
    calendarConnected: prefs.calendarConnected ?? existing?.calendarConnected ?? false,
    focusDurationMinutes: prefs.focusDurationMinutes ?? existing?.focusDurationMinutes ?? 25,
    breakDurationMinutes: prefs.breakDurationMinutes ?? existing?.breakDurationMinutes ?? 5,
    timezone: prefs.timezone || existing?.timezone || "UTC",
  };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: pk(userId), SK: sk.prefs(), type: "PREFS", ...merged },
    })
  );
}
