import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const create = mutation({
  args: {
    siteId: v.id("sites"),
    title: v.string(),
    slug: v.string(),
    path: v.string(),
    templateData: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const site = await ctx.db.get(args.siteId);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Site not found or access denied");
    }

    const pageId = await ctx.db.insert("pages", {
      siteId: args.siteId,
      title: args.title,
      slug: args.slug,
      path: args.path,
      templateData: args.templateData,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return pageId;
  },
});

export const update = mutation({
  args: {
    id: v.id("pages"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    path: v.optional(v.string()),
    templateData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const page = await ctx.db.get(args.id);
    if (!page) throw new Error("Page not found");

    const site = await ctx.db.get(page.siteId);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Page not found or access denied");
    }

    const updates: any = {
      updatedAt: Date.now(),
      version: page.version + 1,
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.slug !== undefined) updates.slug = args.slug;
    if (args.path !== undefined) updates.path = args.path;
    if (args.templateData !== undefined) updates.templateData = args.templateData;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const page = await ctx.db.get(args.id);
    if (!page) throw new Error("Page not found");

    const site = await ctx.db.get(page.siteId);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Page not found or access denied");
    }

    await ctx.db.delete(args.id);
  },
});

export const publish = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const page = await ctx.db.get(args.id);
    if (!page) throw new Error("Page not found");

    const site = await ctx.db.get(page.siteId);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Page not found or access denied");
    }

    await ctx.db.patch(args.id, {
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const unpublish = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const page = await ctx.db.get(args.id);
    if (!page) throw new Error("Page not found");

    const site = await ctx.db.get(page.siteId);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Page not found or access denied");
    }

    await ctx.db.patch(args.id, {
      publishedAt: undefined,
      updatedAt: Date.now(),
    });
  },
});

