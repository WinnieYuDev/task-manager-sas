import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

const DEFAULT_TASKS = [
  { title: "Review Q1 roadmap", priority: "high" as const, completed: true },
  { title: "Design onboarding flow", priority: "medium" as const, completed: false },
  { title: "Optimize database indexes", priority: "high" as const, completed: false },
  { title: "Launch beta campaign", priority: "medium" as const, completed: true },
  { title: "Team sprint planning", priority: "high" as const, completed: false },
  { title: "Write API documentation", priority: "low" as const, completed: false },
  { title: "Set up monitoring alerts", priority: "medium" as const, completed: false },
  { title: "User feedback review", priority: "low" as const, completed: true },
  { title: "Security audit prep", priority: "high" as const, completed: false },
  { title: "Update dependency versions", priority: "low" as const, completed: false },
];

// Idempotent: only seed if user has zero tasks. Call from frontend after first signup.
export const seedTasksForNewUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return { seeded: false, count: 0 };
    const now = Date.now();
    const dueOffset = (i: number) => now + (i + 1) * 24 * 60 * 60 * 1000;
    for (let i = 0; i < DEFAULT_TASKS.length; i++) {
      const t = DEFAULT_TASKS[i];
      await ctx.db.insert("tasks", {
        title: t.title,
        completed: t.completed,
        priority: t.priority,
        userId,
        createdAt: now,
        dueDate: i < 5 ? dueOffset(i) : undefined,
      });
    }
    return { seeded: true, count: DEFAULT_TASKS.length };
  },
});
