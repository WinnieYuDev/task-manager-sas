"use client";

import { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskRowProps = {
  task: Doc<"tasks">;
  onToggle: (id: Id<"tasks">) => void;
  onEdit: (task: Doc<"tasks">) => void;
  onDelete: (id: Id<"tasks">) => void;
};

export function TaskRow({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 transition-colors",
        task.completed && "opacity-60"
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(task._id)}
        className="rounded-full border-2 border-[var(--border)] p-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? (
          <Check className="size-5 text-avocado" />
        ) : (
          <span className="block size-5 rounded-full" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium",
            task.completed && "line-through text-[var(--muted)]"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="truncate text-sm text-[var(--muted)]">
            {task.description}
          </p>
        )}
      </div>
      <Badge variant={task.priority}>{task.priority}</Badge>
      {task.dueDate && (
        <span className="text-xs text-[var(--muted)]">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
        >
          <Trash2 className="size-4 text-strawberry" />
        </Button>
      </div>
    </li>
  );
}
