"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Priority = "high" | "medium" | "low";

const MOCK_TASKS: { id: string; title: string; priority: Priority }[] = [
  { id: "1", title: "Review Q1 roadmap", priority: "high" },
  { id: "2", title: "Send design feedback", priority: "medium" },
  { id: "3", title: "Update documentation", priority: "low" },
  { id: "4", title: "Schedule team sync", priority: "medium" },
];

export function InteractiveTaskListMock() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="flex h-full w-full min-h-0 flex-col rounded-xl overflow-hidden bg-[var(--background)] border border-[var(--border)]">
      <Card className="flex flex-1 min-h-0 flex-col rounded-xl border-0 border-b border-[var(--border)] shadow-none">
        <CardHeader className="p-3 pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">Tasks</CardTitle>
            <Button size="sm" className="h-7 text-xs">
              <Plus className="size-3.5" />
              New task
            </Button>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1.5">
            <Search className="size-3.5 text-[var(--muted)]" />
            <span className="text-xs text-[var(--muted)]">Search…</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-auto p-2 pt-0">
          <ul className="space-y-1.5">
            <AnimatePresence initial={false}>
              {MOCK_TASKS.map((task, i) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 transition-colors",
                    completed[task.id] && "opacity-75"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(task.id)}
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-[var(--border)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1"
                    style={
                      completed[task.id]
                        ? { backgroundColor: "var(--color-primary)", borderColor: "var(--color-primary)" }
                        : undefined
                    }
                    aria-label={completed[task.id] ? "Mark incomplete" : "Mark complete"}
                  >
                    {completed[task.id] && (
                      <svg className="size-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <motion.span
                    layout
                    className={cn(
                      "flex-1 truncate text-sm",
                      completed[task.id] && "text-[var(--muted)] line-through"
                    )}
                    initial={false}
                    animate={{
                      opacity: completed[task.id] ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {task.title}
                  </motion.span>
                  <Badge variant={task.priority} className="shrink-0 text-[10px] px-1.5 py-0">
                    {task.priority}
                  </Badge>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
