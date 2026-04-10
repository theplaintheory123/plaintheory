import { PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { Goal, GoalLog } from "@/types";
import { generateId } from "@/lib/utils";

export async function getGoals(userId: string): Promise<Goal[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": "GOAL#" },
    })
  );
  return ((res.Items || []) as Goal[]).filter(
    (g) => !g.archived && !g.id.includes("#")
  );
}

export async function createGoal(
  userId: string,
  data: Pick<Goal, "title" | "description" | "category" | "targetValue" | "unit" | "deadline" | "color">
): Promise<Goal> {
  const id = generateId();
  const now = new Date().toISOString();
  const item: Goal = {
    id,
    userId,
    title: data.title,
    description: data.description,
    category: data.category,
    targetValue: data.targetValue,
    currentValue: 0,
    unit: data.unit,
    deadline: data.deadline,
    color: data.color,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: pk(userId), SK: sk.goal(id), type: "GOAL", ...item },
    })
  );
  return item;
}

export async function updateGoal(
  userId: string,
  goalId: string,
  updates: Partial<Pick<Goal, "title" | "description" | "category" | "targetValue" | "currentValue" | "unit" | "deadline" | "color">>
): Promise<void> {
  const expressions: string[] = ["updatedAt = :updatedAt"];
  const attrValues: Record<string, unknown> = { ":updatedAt": new Date().toISOString() };
  const attrNames: Record<string, string> = {};

  if ("title" in updates) { expressions.push("title = :title"); attrValues[":title"] = updates.title; }
  if ("description" in updates) { expressions.push("description = :desc"); attrValues[":desc"] = updates.description; }
  if ("category" in updates) { expressions.push("category = :cat"); attrValues[":cat"] = updates.category; }
  if ("targetValue" in updates) { expressions.push("targetValue = :tv"); attrValues[":tv"] = updates.targetValue; }
  if ("currentValue" in updates) { expressions.push("currentValue = :cv"); attrValues[":cv"] = updates.currentValue; }
  if ("unit" in updates) { expressions.push("#u = :unit"); attrValues[":unit"] = updates.unit; attrNames["#u"] = "unit"; }
  if ("deadline" in updates) { expressions.push("deadline = :dl"); attrValues[":dl"] = updates.deadline; }
  if ("color" in updates) { expressions.push("color = :color"); attrValues[":color"] = updates.color; }

  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: pk(userId), SK: sk.goal(goalId) },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeValues: attrValues,
      ...(Object.keys(attrNames).length > 0 && { ExpressionAttributeNames: attrNames }),
    })
  );
}

export async function archiveGoal(userId: string, goalId: string): Promise<void> {
  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: pk(userId), SK: sk.goal(goalId) },
      UpdateExpression: "SET archived = :t, updatedAt = :now",
      ExpressionAttributeValues: { ":t": true, ":now": new Date().toISOString() },
    })
  );
}

export async function logGoalProgress(
  userId: string,
  goalId: string,
  value: number,
  note = ""
): Promise<GoalLog> {
  const id = generateId();
  const now = new Date().toISOString();
  const date = now.split("T")[0];
  const item: GoalLog = { id, goalId, userId, value, date, note, createdAt: now };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: pk(userId), SK: sk.goalLog(goalId, now), type: "GOAL_LOG", ...item },
    })
  );
  // Update currentValue on the goal
  await updateGoal(userId, goalId, { currentValue: value });
  return item;
}

export async function getGoalLogs(userId: string, goalId: string): Promise<GoalLog[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": `GOAL_LOG#${goalId}#` },
    })
  );
  return (res.Items || []) as GoalLog[];
}

export async function getAllGoalLogs(userId: string): Promise<GoalLog[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": "GOAL_LOG#" },
    })
  );
  return (res.Items || []) as GoalLog[];
}
