import { getSessionUser } from "@/lib/auth/session";
import { getReports } from "@/lib/db/reports";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ReportViewPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  const reports = await getReports(user.id);
  const report = reports.find((r) => r.id === reportId);
  if (!report) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/app/reports" className="flex items-center gap-1.5 text-sm text-[#1A1817]/50 hover:text-[#1A1817] transition">
          <ArrowLeft size={14} />
          Reports
        </Link>
      </div>

      <div
        className="rounded-2xl overflow-hidden border border-[#1A1817]/6"
        dangerouslySetInnerHTML={{ __html: report.htmlContent }}
      />
    </div>
  );
}
