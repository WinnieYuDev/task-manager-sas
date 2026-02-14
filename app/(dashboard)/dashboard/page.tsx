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
import { ListTodo, Flame, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

function getMonthStartEnd(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  return { startMs: start.getTime(), endMs: end.getTime() };
}

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const totalCells = startPad + daysInMonth;
  const rows = Math.ceil(totalCells / 7);
  const cells: { day: number | null; date: Date | null }[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ day: null, date: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, date: new Date(year, month, d) });
  const remainder = rows * 7 - cells.length;
  for (let i = 0; i < remainder; i++) cells.push({ day: null, date: null });
  return cells;
}

function dayKey(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return `${y}-${m}-${d}`;
}

export default function DashboardPage() {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const taskList = useQuery(api.tasks.list, {});
  const dueToday = useQuery(api.tasks.dueToday, {});
  const dueSoon = useQuery(api.tasks.dueSoon, {});
  const user = useQuery(api.users.getCurrentUser, {});
  const priorityDist = useQuery(api.analytics.priorityDistribution, {});
  const streak = useQuery(api.analytics.productivityStreak, {});

  const { startMs, endMs } = useMemo(
    () => getMonthStartEnd(calendarMonth.year, calendarMonth.month),
    [calendarMonth.year, calendarMonth.month]
  );
  const monthTasks = useQuery(api.tasks.listByDueDateRange, { startMs, endMs });
  const tasksByDay = useMemo(() => {
    const map: Record<string, number> = {};
    if (!monthTasks) return map;
    for (const t of monthTasks) {
      if (t.dueDate == null) continue;
      const d = new Date(t.dueDate);
      const key = dayKey(d);
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [monthTasks]);

  const calendarCells = useMemo(
    () => getDaysInMonth(calendarMonth.year, calendarMonth.month),
    [calendarMonth.year, calendarMonth.month]
  );

  const todayStr = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

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

  const prevMonth = () => {
    setCalendarMonth((prev) =>
      prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 }
    );
  };
  const nextMonth = () => {
    setCalendarMonth((prev) =>
      prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 }
    );
  };

  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">{todayStr}</p>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name ?? user?.email ?? "there"}!
          </h1>
        </div>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Calendar</CardTitle>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded p-1 hover:bg-[var(--muted)]/20"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="min-w-[140px] text-center text-sm font-medium">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded p-1 hover:bg-[var(--muted)]/20"
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {monthTasks === undefined ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--muted)]">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, i) => {
                    if (cell.day === null)
                      return <div key={i} className="aspect-square rounded p-1" />;
                    const date = cell.date!;
                    const key = dayKey(date);
                    const count = tasksByDay[key] ?? 0;
                    const isToday =
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth() &&
                      date.getFullYear() === new Date().getFullYear();
                    const href = `/tasks?dueDate=${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                    return (
                      <Link
                        key={i}
                        href={href}
                        className={`flex aspect-square flex-col items-center justify-center rounded p-1 text-sm transition-colors hover:bg-[var(--muted)]/20 ${
                          isToday ? "bg-[var(--color-primary)]/20 font-semibold" : ""
                        }`}
                      >
                        {cell.day}
                        {count > 0 && (
                          <span className="mt-0.5 flex gap-0.5">
                            {count <= 3
                              ? Array.from({ length: count }).map((_, j) => (
                                  <span
                                    key={j}
                                    className="size-1 rounded-full bg-[var(--color-primary)]"
                                  />
                                ))
                              : (
                                  <span className="text-[10px] text-[var(--color-primary)]">
                                    {count}
                                  </span>
                                )}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Click a day to view tasks
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Due soon</CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {dueSoon === undefined ? (
              <Skeleton className="h-24 w-full" />
            ) : dueSoon.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No tasks due in the next 7 days</p>
            ) : (
              <ul className="space-y-2">
                {dueSoon.slice(0, 8).map(
                  (t: {
                    _id: string;
                    title: string;
                    priority: string;
                    dueDate?: number;
                  }) => (
                    <li
                      key={t._id}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">{t.title}</span>
                        {t.dueDate != null && (
                          <p className="text-xs text-[var(--muted)]">
                            {new Date(t.dueDate).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <Badge variant={t.priority as "high" | "medium" | "low"} className="ml-2 shrink-0">
                        {t.priority}
                      </Badge>
                    </li>
                  )
                )}
              </ul>
            )}
            {dueSoon && dueSoon.length > 0 && (
              <Link
                href="/tasks"
                className="mt-3 inline-block text-sm text-[var(--color-primary)] hover:underline"
              >
                View all tasks →
              </Link>
            )}
          </CardContent>
        </Card>
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
