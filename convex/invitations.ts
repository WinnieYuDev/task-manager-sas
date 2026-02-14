import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

function getBaseUrl(): string {
  const url = process.env.SITE_URL;
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const inviteByEmail = mutation({
  args: {
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(v.literal("member"), v.literal("admin")),
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
    const token = crypto.randomUUID();
    const now = Date.now();
    await ctx.db.insert("invitations", {
      organizationId: args.organizationId,
      email: args.email,
      role: args.role,
      invitedBy: userId,
      status: "pending",
      token,
      createdAt: now,
    });
    const link = `${getBaseUrl()}/join?token=${token}`;
    return { link, token };
  },
});

export const listPendingInvitations = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const member = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (!member || (member.role !== "owner" && member.role !== "admin"))
      return [];
    return await ctx.db
      .query("invitations")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const inv = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!inv || inv.status !== "pending") return null;
    const org = await ctx.db.get(inv.organizationId);
    return org ? { invitation: inv, organizationName: org.name } : null;
  },
});

export const acceptInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const inv = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!inv || inv.status !== "pending")
      throw new Error("Invalid or expired invitation");
    const existing = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", inv.organizationId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (existing) {
      await ctx.db.patch(inv._id, { status: "accepted" });
      return inv.organizationId;
    }
    await ctx.db.insert("organizationMembers", {
      organizationId: inv.organizationId,
      userId,
      role: inv.role,
      joinedAt: Date.now(),
    });
    await ctx.db.patch(inv._id, { status: "accepted" });
    return inv.organizationId;
  },
});
