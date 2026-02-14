"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { priorityChartColors } from "@/lib/utils";

export default function AnalyticsPage() {
  const completedPerWeek = useQuery(api.analytics.completedPerWeek, {});
  const priorityDist = useQuery(api.analytics.priorityDistribution, {});

  const weekData = completedPerWeek ?? [];
  const distData = priorityDist
    ? [
        { name: "High", value: priorityDist.high, fill: priorityChartColors.high },
        { name: "Medium", value: priorityDist.medium, fill: priorityChartColors.medium },
        { name: "Low", value: priorityDist.low, fill: priorityChartColors.low },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-[var(--muted)]">Task completion and priority trends</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks completed per week</CardTitle>
            <p className="text-sm text-[var(--muted)]">Last 8 weeks</p>
          </CardHeader>
          <CardContent>
            {completedPerWeek === undefined ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
                    <XAxis dataKey="label" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion trend</CardTitle>
            <p className="text-sm text-[var(--muted)]">Weekly completion over time</p>
          </CardHeader>
          <CardContent>
            {completedPerWeek === undefined ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
                    <XAxis dataKey="label" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--avocado)"
                      strokeWidth={2}
                      dot={{ fill: "var(--avocado)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority distribution</CardTitle>
          <p className="text-sm text-[var(--muted)]">Current tasks by priority</p>
        </CardHeader>
        <CardContent>
          {priorityDist === undefined ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis type="category" dataKey="name" className="text-xs" width={70} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
