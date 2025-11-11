import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const listForSite = query({
  args: { siteId: v.id("sites") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Site not found or access denied");
    }

    return await ctx.db
      .query("pages")
      .withIndex("by_site", (q) => q.eq("siteId", args.siteId))
      .collect();
  },
});

export const getByPath = query({
  args: { siteId: v.id("sites"), path: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      // Public access - check if site is published
      const site = await ctx.db.get(args.siteId);
      if (!site || site.status !== "published") {
        return null;
      }
    } else {
      const user = await ctx.db.get(userId);
      if (user) {
        const site = await ctx.db.get(args.siteId);
        if (!site || site.tenantId !== user.tenantId) {
          return null;
        }
      }
    }

    return await ctx.db
      .query("pages")
      .withIndex("by_path", (q) =>
        q.eq("siteId", args.siteId).eq("path", args.path)
      )
      .first();
  },
});

export const getById = query({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const page = await ctx.db.get(args.id);
    if (!page) return null;

    const site = await ctx.db.get(page.siteId);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Page not found or access denied");
    }

    return page;
  },
});

