import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// App schema: auth tables + extended users + tasks + subscriptions (Stripe-ready)
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // TaskBloom app fields
    subscriptionStatus: v.optional(
      v.union(v.literal("free"), v.literal("pro"), v.literal("team"))
    ),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("email", ["email"]),

  tasks: defineTable({
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
  })
    .index("by_user", ["userId"])
    .index("by_user_dueDate", ["userId", "dueDate"])
    .index("by_user_completed", ["userId", "completed"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    status: v.string(),
    plan: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  invitations: defineTable({
    token: v.string(),
    email: v.optional(v.string()),
    inviterId: v.optional(v.id("users")),
    createdAt: v.number(),
  }).index("by_token", ["token"]),
});
