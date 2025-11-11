import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const listForTenant = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    return await ctx.db
      .query("media")
      .withIndex("by_tenant", (q) => q.eq("tenantId", user.tenantId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const media = await ctx.db.get(args.id);
    if (!media || media.tenantId !== user.tenantId) {
      throw new Error("Media not found or access denied");
    }

    return media;
  },
});

