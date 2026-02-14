import { query } from "./_generated/server";
import { auth } from "./auth";

// Tasks completed per week (last 8 weeks) for charts
export const completedPerWeek = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const completed = tasks.filter((t) => t.completed);
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const result: { weekStart: number; count: number; label: string }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(start.getDate() - (i + 1) * 7);
      start.setHours(0, 0, 0, 0);
      const weekStart = start.getTime();
      const weekEnd = weekStart + weekMs;
      const count = completed.filter(
        (t) => t.createdAt >= weekStart && t.createdAt < weekEnd
      ).length;
      result.push({
        weekStart,
        count,
        label: `Week ${8 - i}`,
      });
    }
    return result;
  },
});

// Priority distribution for pie chart
export const priorityDistribution = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return { high: 0, medium: 0, low: 0 };
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const high = tasks.filter((t) => t.priority === "high").length;
    const medium = tasks.filter((t) => t.priority === "medium").length;
    const low = tasks.filter((t) => t.priority === "low").length;
    return { high, medium, low };
  },
});

// Productivity streak: consecutive days with at least one completed task
export const productivityStreak = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return 0;
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const completedByDay = new Set<number>();
    for (const t of tasks) {
      if (!t.completed) continue;
      const d = new Date(t.createdAt);
      d.setHours(0, 0, 0, 0);
      completedByDay.add(d.getTime());
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let day = today.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    let streak = 0;
    while (completedByDay.has(day)) {
      streak++;
      day -= oneDay;
    }
    return streak;
  },
});
