import { PutCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { Expense } from "@/types";
import { generateId } from "@/lib/utils";

export async function getExpenses(userId: string): Promise<Expense[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": "EXPENSE#" },
    })
  );
  return (res.Items || []) as Expense[];
}

export async function createExpense(
  userId: string,
  data: Pick<Expense, "amount" | "category" | "description" | "date">
): Promise<Expense> {
  const id = generateId();
  const now = new Date().toISOString();
  const item: Expense = { id, userId, ...data, createdAt: now };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: pk(userId), SK: sk.expense(id), type: "EXPENSE", ...item },
    })
  );
  return item;
}

export async function deleteExpense(userId: string, expenseId: string): Promise<void> {
  await db.send(
    new DeleteCommand({ TableName: TABLE, Key: { PK: pk(userId), SK: sk.expense(expenseId) } })
  );
}
