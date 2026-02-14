"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, ListTodo, BarChart3, Calendar, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Tasks", icon: ListTodo },
  { label: "Analytics", icon: BarChart3 },
];

export function DashboardPreviewMock() {
  const progress = 72;
  const circumference = 2 * Math.PI * 20;

  return (
    <div className="flex h-full w-full min-h-0 rounded-xl overflow-hidden bg-[var(--background)] border border-[var(--border)]">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex shrink-0 w-[28%] min-w-0 flex-col border-r border-[var(--border)] bg-[var(--card)]"
      >
        <div className="flex h-8 shrink-0 items-center border-b border-[var(--border)] px-2">
          <span className="font-semibold text-[10px] sm:text-xs text-[var(--color-accent)]">
            TaskBloom
          </span>
        </div>
        <nav className="flex-1 space-y-0.5 p-1.5">
          {nav.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--muted)]"
            >
              <item.icon className="size-3.5 shrink-0" />
              <span className="truncate text-[10px] sm:text-xs font-medium">{item.label}</span>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Main */}
      <div className="flex flex-1 min-w-0 items-center justify-center p-2 sm:p-3">
        <div className="grid w-full max-w-full grid-cols-3 gap-1.5 sm:gap-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-[var(--border)] shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between p-2 pb-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium">Task completion</CardTitle>
                <ListTodo className="size-3 text-[var(--muted)]" />
              </CardHeader>
              <CardContent className="p-2 pt-1">
                <div className="relative size-12">
                  <svg className="size-12 -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{
                        strokeDashoffset: circumference * (1 - progress / 100),
                      }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {progress}%
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-[var(--muted)]">7 of 10 done</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.28 }}
          >
            <Card className="overflow-hidden border-[var(--border)] shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between p-2 pb-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium">Due today</CardTitle>
                <Calendar className="size-3 text-[var(--muted)]" />
              </CardHeader>
              <CardContent className="p-2 pt-1">
                <p className="text-lg font-bold">3</p>
                <p className="text-[10px] text-[var(--muted)]">tasks</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.36 }}
          >
            <Card className="overflow-hidden border-[var(--border)] shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between p-2 pb-0">
                <CardTitle className="text-[10px] sm:text-xs font-medium">Streak</CardTitle>
                <Flame className="size-3 text-[var(--muted)]" />
              </CardHeader>
              <CardContent className="p-2 pt-1">
                <p className="text-lg font-bold">5</p>
                <p className="text-[10px] text-[var(--muted)]">days</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
