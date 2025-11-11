import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tenants: defineTable({
    name: v.string(),
    slug: v.string(),
    customDomain: v.optional(v.string()),
    branding: v.object({
      logo: v.optional(v.id("_storage")),
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      accentColor: v.optional(v.string()),
      fontFamily: v.optional(v.string()),
      theme: v.optional(v.union(v.literal("light"), v.literal("dark"))),
      customCss: v.optional(v.string()),
    }),
    subscriptionTier: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    createdAt: v.number(),
    ownerId: v.id("users"),
  })
    .index("by_slug", ["slug"])
    .index("by_domain", ["customDomain"]),

  users: defineTable({
    email: v.string(),
    tenantId: v.id("tenants"),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    authProvider: v.string(),
    authProviderId: v.string(),
    createdAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_auth_provider", ["authProvider", "authProviderId"]),

  sites: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    slug: v.string(),
    templateId: v.id("templates"),
    status: v.union(v.literal("draft"), v.literal("published")),
    customDomain: v.optional(v.string()),
    settings: v.object({
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
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_slug", ["slug"])
    .index("by_domain", ["customDomain"]),

  pages: defineTable({
    siteId: v.id("sites"),
    title: v.string(),
    slug: v.string(),
    path: v.string(),
    templateData: v.any(),
    publishedAt: v.optional(v.number()),
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_site", ["siteId"])
    .index("by_path", ["siteId", "path"]),

  templates: defineTable({
    name: v.string(),
    category: v.string(),
    previewImage: v.optional(v.id("_storage")),
    schema: v.any(),
    isPublic: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_public", ["isPublic"]),

  media: defineTable({
    tenantId: v.id("tenants"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  }).index("by_tenant", ["tenantId"]),
});

