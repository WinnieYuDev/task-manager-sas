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
    defaultOrganizationId: v.optional(v.id("organizations")),
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

  organizations: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_createdBy", ["createdBy"]),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member")
    ),
    joinedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"]),

  invitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(v.literal("member"), v.literal("admin")),
    invitedBy: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted")),
    token: v.string(),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_token", ["token"]),
});
