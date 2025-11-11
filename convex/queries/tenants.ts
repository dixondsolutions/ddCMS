import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenants")
      .withIndex("by_domain", (q) => q.eq("customDomain", args.domain))
      .first();
  },
});

export const getCurrentTenant = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    return await ctx.db.get(user.tenantId);
  },
});

