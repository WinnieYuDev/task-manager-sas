"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "low" | "medium" | "high";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>();
  const [filterPriority, setFilterPriority] = useState<Priority | undefined>();
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"tasks"> | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("medium");
  const [formDueDate, setFormDueDate] = useState("");

  const taskList = useQuery(api.tasks.list, {
    search: search || undefined,
    completed: filterCompleted,
    priority: filterPriority,
    sortBy,
    sortOrder,
    limit: 50,
  });
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);
  const toggleComplete = useMutation(api.tasks.toggleComplete);

  const tasks = taskList?.page ?? [];

  async function handleCreate() {
    if (!formTitle.trim()) return;
    try {
      await createTask({
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        completed: false,
        priority: formPriority,
        dueDate: formDueDate ? new Date(formDueDate).getTime() : undefined,
      });
      toast.success("Task created");
      setModalOpen(false);
      setFormTitle("");
      setFormDescription("");
      setFormPriority("medium");
      setFormDueDate("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create");
    }
  }

  async function handleUpdate() {
    if (!editingId || !formTitle.trim()) return;
    try {
      const task = tasks.find((t: { _id: Id<"tasks"> }) => t._id === editingId);
      if (!task) return;
      await updateTask({
        id: editingId,
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        completed: task.completed,
        priority: formPriority,
        dueDate: formDueDate ? new Date(formDueDate).getTime() : undefined,
      });
      toast.success("Task updated");
      setEditingId(null);
      setFormTitle("");
      setFormDescription("");
      setFormPriority("medium");
      setFormDueDate("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function handleDelete(id: Id<"tasks">) {
    try {
      await removeTask({ id });
      toast.success("Task deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  async function handleToggle(id: Id<"tasks">) {
    try {
      await toggleComplete({ id });
      toast.success("Task updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  }

  function openEdit(task: (typeof tasks)[0]) {
    setEditingId(task._id);
    setFormTitle(task.title);
    setFormDescription(task.description ?? "");
    setFormPriority(task.priority);
    setFormDueDate(
      task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 16)
        : ""
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" />
          New task
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={filterCompleted === undefined ? "all" : filterCompleted ? "done" : "todo"}
              onChange={(e) => {
                const v = e.target.value;
                setFilterCompleted(
                  v === "all" ? undefined : v === "done"
                );
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="todo">To do</option>
              <option value="done">Done</option>
            </select>
            <select
              value={filterPriority ?? "all"}
              onChange={(e) =>
                setFilterPriority(
                  e.target.value === "all"
                    ? undefined
                    : (e.target.value as Priority)
                )
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="all">Any priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "dueDate" | "priority" | "createdAt")
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="createdAt">Created</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
              }
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {taskList === undefined ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] py-12 text-center text-[var(--muted)]">
              <p className="font-medium">No tasks yet</p>
              <p className="text-sm">Create one to get started.</p>
              <Button
                className="mt-4"
                onClick={() => setModalOpen(true)}
              >
                <Plus className="size-4" />
                Add task
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 transition-colors",
                    task.completed && "opacity-60"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(task._id)}
                    className="rounded-full border-2 border-[var(--border)] p-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
                      onClick={() => openEdit(task)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(task._id)}
                    >
                      <Trash2 className="size-4 text-strawberry" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="New task"
        description="Add a task to your list"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Task title"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Optional"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              value={formPriority}
              onChange={(e) => setFormPriority(e.target.value as Priority)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Due date</label>
            <Input
              type="datetime-local"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editingId}
        onOpenChange={(open) => !open && setEditingId(null)}
        title="Edit task"
        description="Update your task"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Task title"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              value={formPriority}
              onChange={(e) => setFormPriority(e.target.value as Priority)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Due date</label>
            <Input
              type="datetime-local"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
