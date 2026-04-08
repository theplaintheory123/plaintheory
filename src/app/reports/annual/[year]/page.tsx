import { getReportByShareToken } from "@/lib/db/reports";
import { notFound } from "next/navigation";

export default async function AnnualMicrositePage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { year } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  const report = await getReportByShareToken(token);
  if (!report || report.reportType !== "annual") notFound();

  // Validate the year matches
  const reportYear = new Date(report.periodStart).getFullYear();
  if (String(reportYear) !== year) notFound();

  return (
    <div
      dangerouslySetInnerHTML={{ __html: report.htmlContent }}
    />
  );
}
