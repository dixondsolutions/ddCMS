import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    templateId: v.id("templates"),
    customDomain: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const siteId = await ctx.db.insert("sites", {
      tenantId: user.tenantId,
      name: args.name,
      slug: args.slug,
      templateId: args.templateId,
      status: "draft",
      customDomain: args.customDomain,
      settings: {
        seo: undefined,
        analytics: undefined,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return siteId;
  },
});

export const update = mutation({
  args: {
    id: v.id("sites"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    customDomain: v.optional(v.string()),
    settings: v.optional(
      v.object({
        seo: v.optional(
          v.object({
            title: v.optional(v.string()),
            description: v.optional(v.string()),
            keywords: v.optional(v.array(v.string())),
          })
        ),
        analytics: v.optional(
          v.object({
            googleAnalyticsId: v.optional(v.string()),
            facebookPixelId: v.optional(v.string()),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const site = await ctx.db.get(args.id);
    if (!site || site.tenantId !== user.tenantId) {
      throw new Error("Site not found or access denied");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.slug !== undefined) updates.slug = args.slug;
    if (args.status !== undefined) updates.status = args.status;
    if (args.customDomain !== undefined)
      updates.customDomain = args.customDomain;
    if (args.settings !== undefined) updates.settings = args.settings;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
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

    // Delete all pages for this site
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_site", (q) => q.eq("siteId", args.id))
      .collect();

    for (const page of pages) {
      await ctx.db.delete(page._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const publish = mutation({
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

    await ctx.db.patch(args.id, {
      status: "published",
      updatedAt: Date.now(),
    });
  },
});

export const unpublish = mutation({
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

    await ctx.db.patch(args.id, {
      status: "draft",
      updatedAt: Date.now(),
    });
  },
});

