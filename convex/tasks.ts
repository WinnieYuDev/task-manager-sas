import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

const taskValidator = {
  title: v.string(),
  description: v.optional(v.string()),
  completed: v.boolean(),
  priority: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high")
  ),
  dueDate: v.optional(v.number()),
};

const taskDocValidator = v.object({
  _id: v.id("tasks"),
  _creationTime: v.number(),
  title: v.string(),
  description: v.optional(v.string()),
  completed: v.boolean(),
  priority: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high")
  ),
  dueDate: v.optional(v.number()),
  userId: v.id("users"),
  createdAt: v.number(),
});

const listResultValidator = v.object({
  page: v.array(taskDocValidator),
  isDone: v.boolean(),
  continueCursor: v.union(v.string(), v.null()),
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    search: v.optional(v.string()),
    sortBy: v.optional(
      v.union(
        v.literal("dueDate"),
        v.literal("priority"),
        v.literal("createdAt")
      )
    ),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  returns: listResultValidator,
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: null };
    let q = ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId));
    const tasks = await q.collect();
    let filtered = tasks;
    if (args.completed !== undefined)
      filtered = filtered.filter((t) => t.completed === args.completed);
    if (args.priority) filtered = filtered.filter((t) => t.priority === args.priority);
    if (args.search) {
      const s = args.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(s) ||
          (t.description && t.description.toLowerCase().includes(s))
      );
    }
    const sortBy = args.sortBy ?? "createdAt";
    const order = args.sortOrder ?? "desc";
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "dueDate") {
        const da = a.dueDate ?? 0;
        const db = b.dueDate ?? 0;
        cmp = da - db;
      } else if (sortBy === "priority") {
        const p = { high: 3, medium: 2, low: 1 };
        cmp = p[a.priority] - p[b.priority];
      } else {
        cmp = a.createdAt - b.createdAt;
      }
      return order === "asc" ? cmp : -cmp;
    });
    const limit = args.limit ?? 50;
    const page = filtered.slice(0, limit);
    const isDone = filtered.length <= limit;
    const continueCursor = isDone ? null : String(limit);
    return { page, isDone, continueCursor };
  },
});

export const create = mutation({
  args: taskValidator,
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return await ctx.db.insert("tasks", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    ...taskValidator,
  },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) throw new Error("Not found");
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const toggleComplete = mutation({
  args: { id: v.id("tasks") },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const task = await ctx.db.get(args.id);
    if (!task || task.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { completed: !task.completed });
    return args.id;
  },
});

// For dashboard: tasks due today
export const dueToday = query({
  args: {},
  returns: v.array(taskDocValidator),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const start = todayStart.getTime();
    const end = todayEnd.getTime();
    return tasks.filter(
      (t) => t.dueDate != null && t.dueDate >= start && t.dueDate < end && !t.completed
    );
  },
});
