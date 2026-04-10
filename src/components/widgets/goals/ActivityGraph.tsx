"use client";

import { useEffect, useState } from "react";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { Activity } from "lucide-react";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity as GraphActivity } from "@/components/kibo-ui/contribution-graph";

function buildActivityData(logs: { date: string }[]): GraphActivity[] {
  const counts: Record<string, number> = {};
  for (const log of logs) {
    counts[log.date] = (counts[log.date] || 0) + 1;
  }

  // Build a full year of dates from today
  const today = new Date();
  const start = new Date(today);
  start.setFullYear(start.getFullYear() - 1);

  const result: GraphActivity[] = [];
  const cur = new Date(start);
  while (cur <= today) {
    const dateStr = cur.toISOString().split("T")[0];
    const count = counts[dateStr] || 0;
    const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
    result.push({ date: dateStr, count, level });
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

export default function ActivityGraph() {
  const [data, setData] = useState<GraphActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/goals").then((r) => r.json()),
      fetch("/api/habits/activity").then((r) => r.json()),
    ])
      .then(([goalsData, habitsData]) => {
        const goalLogs: { date: string }[] = (goalsData.logs || []).map((l: { date: string }) => ({ date: l.date }));
        const habitChecks: { date: string }[] = (habitsData.checks || []).map((c: { date: string }) => ({ date: c.date }));
        const allLogs = [...goalLogs, ...habitChecks];
        setTotalLogs(allLogs.length);
        setData(buildActivityData(allLogs));
      })
      .catch(() => setData(buildActivityData([])))
      .finally(() => setLoading(false));
  }, []);

  const year = new Date().getFullYear();

  if (loading) {
    return (
      <>
        <CardHeader className="border-b border-stone-100 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Activity</span>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="h-32 animate-pulse bg-stone-50 rounded-xl" />
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader className="border-b border-stone-100 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Activity</span>
          </div>
          <span className="text-[10px] text-stone-400">{year}</span>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {data.length > 0 ? (
          <ContributionGraph
            data={data}
            blockSize={10}
            blockMargin={3}
            blockRadius={2}
            fontSize={10}
            className="w-full"
          >
            <ContributionGraphCalendar
              className="[&_rect[data-level='0']]:fill-stone-100 [&_rect[data-level='1']]:fill-[#C2786B]/30 [&_rect[data-level='2']]:fill-[#C2786B]/55 [&_rect[data-level='3']]:fill-[#C2786B]/75 [&_rect[data-level='4']]:fill-[#C2786B] [&_text]:fill-stone-400"
            >
              {({ activity, dayIndex, weekIndex }) => (
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                  className="cursor-pointer"
                />
              )}
            </ContributionGraphCalendar>
            <ContributionGraphFooter className="mt-2">
              <ContributionGraphTotalCount className="text-[10px]">
                {({ totalCount }) => (
                  <span className="text-[10px] text-stone-400">
                    {totalCount} activities this year
                  </span>
                )}
              </ContributionGraphTotalCount>
              <ContributionGraphLegend className="text-[10px]" />
            </ContributionGraphFooter>
          </ContributionGraph>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-stone-400">No activity data yet</p>
          </div>
        )}
      </CardContent>
    </>
  );
}
