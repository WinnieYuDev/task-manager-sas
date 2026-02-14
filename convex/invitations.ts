import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get an invitation by its token (e.g. for join/accept-invite pages).
 */
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const inv = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    return inv;
  },
});
