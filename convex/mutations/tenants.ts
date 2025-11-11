import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    branding: v.optional(
      v.object({
        logo: v.optional(v.id("_storage")),
        primaryColor: v.optional(v.string()),
        secondaryColor: v.optional(v.string()),
        accentColor: v.optional(v.string()),
        fontFamily: v.optional(v.string()),
        theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
        customCss: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const tenantId = await ctx.db.insert("tenants", {
      name: args.name,
      slug: args.slug,
      branding: args.branding || {
        primaryColor: undefined,
        secondaryColor: undefined,
        accentColor: undefined,
        fontFamily: undefined,
        theme: undefined,
        customCss: undefined,
      },
      subscriptionTier: "free",
      createdAt: Date.now(),
      ownerId: userId,
    });

    return tenantId;
  },
});

export const updateBranding = mutation({
  args: {
    tenantId: v.id("tenants"),
    branding: v.object({
      logo: v.optional(v.id("_storage")),
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      accentColor: v.optional(v.string()),
      fontFamily: v.optional(v.string()),
      theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
      customCss: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant || tenant.ownerId !== userId) {
      throw new Error("Tenant not found or access denied");
    }

    await ctx.db.patch(args.tenantId, {
      branding: args.branding,
    });
  },
});

export const updateCustomDomain = mutation({
  args: {
    tenantId: v.id("tenants"),
    customDomain: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant || tenant.ownerId !== userId) {
      throw new Error("Tenant not found or access denied");
    }

    await ctx.db.patch(args.tenantId, {
      customDomain: args.customDomain,
    });
  },
});

