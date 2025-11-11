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
      .query("sites")
      .withIndex("by_tenant", (q) => q.eq("tenantId", user.tenantId))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    return await ctx.db
      .query("sites")
      .withIndex("by_tenant", (q) => q.eq("tenantId", user.tenantId))
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("sites") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const site = await ctx.db.get(args.id);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Site not found or access denied");
    }

    return site;
  },
});

