"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { priorityChartColors } from "@/lib/utils";
import { ListTodo, Flame, Calendar } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const taskList = useQuery(api.tasks.list, {});
  const dueToday = useQuery(api.tasks.dueToday, {});
  const priorityDist = useQuery(api.analytics.priorityDistribution, {});
  const streak = useQuery(api.analytics.productivityStreak, {});

  const tasks = taskList?.page ?? [];
  const total = tasks.length;
  const completed = tasks.filter((t: { completed: boolean }) => t.completed).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  const pieData = priorityDist
    ? [
        { name: "High", value: priorityDist.high, color: priorityChartColors.high },
        { name: "Medium", value: priorityDist.medium, color: priorityChartColors.medium },
        { name: "Low", value: priorityDist.low, color: priorityChartColors.low },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--muted)]">Your productivity at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Task completion
              </CardTitle>
              <ListTodo className="size-4 text-[var(--muted)]" />
            </CardHeader>
            <CardContent>
              {taskList === undefined ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="relative size-20">
                    <svg className="size-20 -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="6"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="32"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                        animate={{
                          strokeDashoffset:
                            2 * Math.PI * 32 * (1 - progress / 100),
                        }}
                        transition={{ duration: 0.8 }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                      {progress}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {completed} of {total} tasks done
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Due today</CardTitle>
              <Calendar className="size-4 text-[var(--muted)]" />
            </CardHeader>
            <CardContent>
              {dueToday === undefined ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <p className="text-2xl font-bold">{dueToday.length}</p>
                  <Link
                    href="/tasks"
                    className="text-xs text-[var(--color-primary)] hover:underline"
                  >
                    View tasks
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="size-4 text-mango" />
            </CardHeader>
            <CardContent>
              {streak === undefined ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <p className="text-2xl font-bold">{streak} days</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Priority breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {priorityDist === undefined ? (
                <Skeleton className="h-24 w-full" />
              ) : pieData.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No tasks yet</p>
              ) : (
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={24}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {dueToday && dueToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks due today</CardTitle>
            <CardDescription>Finish these to keep your streak</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dueToday.map((t: { _id: string; title: string; priority: string }) => (
                <li
                  key={t._id}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2"
                >
                  <span className="font-medium">{t.title}</span>
                  <Badge variant={t.priority as "high" | "medium" | "low"}>
                    {t.priority}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
