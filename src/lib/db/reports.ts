import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { Report } from "@/types";
import { generateId } from "@/lib/utils";

export async function getReports(userId: string): Promise<Report[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": "REPORT#" },
      ScanIndexForward: false,
    })
  );
  return (res.Items || []) as Report[];
}

export async function saveReport(
  userId: string,
  reportType: Report["reportType"],
  periodStart: string,
  periodEnd: string,
  htmlContent: string,
  shareToken?: string
): Promise<Report> {
  const id = generateId();
  const createdAt = new Date().toISOString();
  const dateKey = periodStart.split("T")[0];
  const item: Report = {
    id,
    userId,
    reportType,
    periodStart,
    periodEnd,
    htmlContent,
    shareToken: shareToken || null,
    emailSentAt: null,
    createdAt,
  };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: pk(userId),
        SK: sk.report(reportType, dateKey),
        type: "REPORT",
        ...item,
      },
    })
  );
  return item;
}

export async function markReportEmailSent(userId: string, reportType: string, dateKey: string): Promise<void> {
  const { UpdateCommand } = await import("@aws-sdk/lib-dynamodb");
  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: pk(userId), SK: sk.report(reportType, dateKey) },
      UpdateExpression: "SET emailSentAt = :t",
      ExpressionAttributeValues: { ":t": new Date().toISOString() },
    })
  );
}

export async function getReportByShareToken(shareToken: string): Promise<Report | null> {
  const { ScanCommand } = await import("@aws-sdk/lib-dynamodb");
  const res = await db.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression: "shareToken = :t",
      ExpressionAttributeValues: { ":t": shareToken },
    })
  );
  if (!res.Items || res.Items.length === 0) return null;
  return res.Items[0] as Report;
}
