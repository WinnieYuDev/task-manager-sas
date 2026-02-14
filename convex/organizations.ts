import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const now = Date.now();
    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      createdBy: userId,
      createdAt: now,
    });
    await ctx.db.insert("organizationMembers", {
      organizationId: orgId,
      userId,
      role: "owner",
      joinedAt: now,
    });
    return orgId;
  },
});

export const getMyOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const orgs = await Promise.all(
      memberships.map(async (m) => {
        const org = await ctx.db.get(m.organizationId);
        if (!org) return null;
        return { ...org, _id: org._id, role: m.role };
      })
    );
    return orgs.filter(Boolean) as (Awaited<ReturnType<typeof ctx.db.get>> & {
      role: "owner" | "admin" | "member";
    })[];
  },
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    if (memberships.length === 0) return null;
    const first = memberships[0];
    return await ctx.db.get(first.organizationId);
  },
});

export const update = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!member || (member.role !== "owner" && member.role !== "admin"))
      throw new Error("Forbidden");
    await ctx.db.patch(args.organizationId, { name: args.name });
    return args.organizationId;
  },
});

export const listMembers = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const isMember = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!isMember) return [];
    const members = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();
    const withUsers = await Promise.all(
      members.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return {
          ...m,
          name: user?.name ?? user?.email ?? "Unknown",
          email: user?.email,
        };
      })
    );
    return withUsers;
  },
});
