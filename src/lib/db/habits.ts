import {
  GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { Habit, HabitCheck } from "@/types";
import { generateId, todayISO } from "@/lib/utils";

export async function getHabits(userId: string): Promise<Habit[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": "HABIT#" },
    })
  );
  return ((res.Items || []) as Habit[]).filter((h) => !h.archived);
}

export async function createHabit(userId: string, name: string, emoji = "✓"): Promise<Habit> {
  const id = generateId();
  const now = new Date().toISOString();
  const item: Habit = { id, userId, name, emoji, archived: false, currentStreak: 0, longestStreak: 0, createdAt: now };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: pk(userId), SK: sk.habit(id), type: "HABIT", ...item },
    })
  );
  return item;
}

export async function archiveHabit(userId: string, habitId: string): Promise<void> {
  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: pk(userId), SK: sk.habit(habitId) },
      UpdateExpression: "SET archived = :t",
      ExpressionAttributeValues: { ":t": true },
    })
  );
}

export async function getTodayChecks(userId: string, date: string): Promise<HabitCheck[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk(userId),
        ":prefix": `HABIT_CHECK#`,
        ":date": date,
      },
      FilterExpression: "#d = :date",
      ExpressionAttributeNames: { "#d": "date" },
    })
  );
  return (res.Items || []).map((i) => ({
    habitId: i.habitId,
    date: i.date,
    completed: i.completed,
  }));
}

export async function toggleHabitCheck(userId: string, habitId: string, date: string, completed: boolean): Promise<void> {
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: pk(userId),
        SK: sk.habitCheck(habitId, date),
        GSI1PK: pk(userId),
        GSI1SK: `HABIT_CHECK#${date}`,
        type: "HABIT_CHECK",
        habitId,
        date,
        completed,
      },
    })
  );

  // Recalculate streak
  const checksRes = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk(userId),
        ":prefix": `HABIT_CHECK#${habitId}#`,
      },
    })
  );
  const checks = ((checksRes.Items || []) as HabitCheck[])
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort()
    .reverse();

  let streak = 0;
  const today = todayISO();
  let expected = today;
  for (const d of checks) {
    if (d === expected) {
      streak++;
      const dt = new Date(expected);
      dt.setDate(dt.getDate() - 1);
      expected = dt.toISOString().split("T")[0];
    } else {
      break;
    }
  }

  // Get current habit to compare longestStreak
  const habitRes = await db.send(
    new GetCommand({ TableName: TABLE, Key: { PK: pk(userId), SK: sk.habit(habitId) } })
  );
  const currentLongest = habitRes.Item?.longestStreak || 0;

  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: pk(userId), SK: sk.habit(habitId) },
      UpdateExpression: "SET currentStreak = :s, longestStreak = :l",
      ExpressionAttributeValues: {
        ":s": streak,
        ":l": Math.max(streak, currentLongest),
      },
    })
  );
}
