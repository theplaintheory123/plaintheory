import { getSessionUser } from "@/lib/auth/session";
import { getReports } from "@/lib/db/reports";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, ExternalLink } from "lucide-react";

function reportLabel(type: string) {
  return { weekly: "Weekly Review", quarterly: "Quarterly Report", annual: "Year in Review" }[type] || type;
}

export default async function ReportsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  const reports = await getReports(user.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#1A1817]">Reports</h1>
        <p className="mt-1 text-sm text-[#1A1817]/50">Your weekly, quarterly, and annual summaries.</p>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#1A1817]/6 bg-white py-20 text-center">
          <BarChart3 size={32} className="mb-3 text-[#1A1817]/10" />
          <p className="text-sm text-[#1A1817]/40">No reports yet</p>
          <p className="mt-1 text-xs text-[#1A1817]/25">Reports are generated automatically every week, quarter, and year.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between rounded-2xl border border-[#1A1817]/6 bg-white px-6 py-4 hover:border-[#C2786B]/20 transition">
              <div>
                <p className="font-medium text-sm text-[#1A1817]">{reportLabel(report.reportType)}</p>
                <p className="text-xs text-[#1A1817]/40 mt-0.5">
                  {new Date(report.periodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {" – "}
                  {new Date(report.periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {report.emailSentAt && (
                  <span className="text-[10px] text-[#1A1817]/30 uppercase tracking-wider">Sent</span>
                )}
                {report.reportType === "annual" && report.shareToken && (
                  <a
                    href={`/reports/annual/${new Date(report.periodStart).getFullYear()}?token=${report.shareToken}`}
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-[#C2786B] hover:underline"
                  >
                    <ExternalLink size={12} />
                    Share
                  </a>
                )}
                <Link
                  href={`/app/reports/${report.id}`}
                  className="rounded-xl border border-[#1A1817]/8 px-3 py-1.5 text-xs text-[#1A1817]/60 hover:border-[#C2786B]/30 hover:text-[#C2786B] transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
