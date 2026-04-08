import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { Task } from "@/types";
import { generateId, todayISO } from "@/lib/utils";

export async function getTasks(userId: string): Promise<Task[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk(userId),
        ":prefix": "TASK#",
      },
    })
  );
  return (res.Items || []) as Task[];
}

export async function createTask(userId: string, title: string, dueDate?: string): Promise<Task> {
  const id = generateId();
  const now = new Date().toISOString();
  const item: Task = {
    id,
    userId,
    title,
    completed: false,
    dueDate: dueDate || null,
    createdAt: now,
    updatedAt: now,
  };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: pk(userId),
        SK: sk.task(id),
        GSI1PK: pk(userId),
        GSI1SK: dueDate ? `TASK#${dueDate}#${id}` : `TASK#9999-99-99#${id}`,
        type: "TASK",
        ...item,
      },
    })
  );
  return item;
}

export async function updateTask(
  userId: string,
  taskId: string,
  updates: Partial<Pick<Task, "title" | "completed" | "dueDate">>
): Promise<void> {
  const expressions: string[] = ["updatedAt = :updatedAt"];
  const attrValues: Record<string, unknown> = { ":updatedAt": new Date().toISOString() };
  if ("title" in updates) { expressions.push("title = :title"); attrValues[":title"] = updates.title; }
  if ("completed" in updates) { expressions.push("completed = :completed"); attrValues[":completed"] = updates.completed; }
  if ("dueDate" in updates) { expressions.push("dueDate = :dueDate"); attrValues[":dueDate"] = updates.dueDate; }
  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: pk(userId), SK: sk.task(taskId) },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeValues: attrValues,
    })
  );
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  await db.send(
    new DeleteCommand({ TableName: TABLE, Key: { PK: pk(userId), SK: sk.task(taskId) } })
  );
}
