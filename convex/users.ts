import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }
    return userId;
  },
});

// Ensure user profile has subscription status (Convex Auth creates user; we add app fields)
export const ensureProfile = mutation({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const existing = await ctx.db.get(userId);
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;
    if (args.image !== undefined) updates.image = args.image;
    if (existing?.subscriptionStatus === undefined)
      updates.subscriptionStatus = "free";
    if (existing?.createdAt === undefined) updates.createdAt = Date.now();
    if (Object.keys(updates).length > 0 && existing)
      await ctx.db.patch(userId, updates);
    return userId;
  },
});
