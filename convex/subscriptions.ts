import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return sub;
  },
});

// Future: Stripe webhook handler (e.g. in convex/http.ts or an action) should call
// this mutation when subscription.created/updated/deleted fires.
// For now, subscriptionStatus on users can be updated manually or via a future action.
export const createOrUpdate = mutation({
  args: {
    userId: v.id("users"),
    status: v.string(),
    plan: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthenticated");
    // Only allow updating own subscription (or use internal mutation for Stripe webhook)
    if (currentUserId !== args.userId) throw new Error("Forbidden");
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    const doc = {
      userId: args.userId,
      status: args.status,
      plan: args.plan,
      stripeSubscriptionId: args.stripeSubscriptionId,
      currentPeriodEnd: args.currentPeriodEnd,
      createdAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("subscriptions", doc);
  },
});
