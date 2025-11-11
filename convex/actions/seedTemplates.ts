import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { defaultTemplates } from "../../shared/types/template";
import { Id } from "../../../convex/_generated/dataModel";

// Seed templates into the database
export async function seedTemplates(ctx: any) {
  const userId = await ctx.auth.getUserIdentity();
  if (!userId) return;

  // Check if templates already exist
  const existingTemplates = await ctx.db.query("templates").collect();
  if (existingTemplates.length > 0) return;

  // Create a user document if it doesn't exist (for template creator)
  let user = await ctx.db
    .query("users")
    .withIndex("by_auth_provider", (q) =>
      q.eq("authProvider", "workos").eq("authProviderId", userId.subject)
    )
    .first();

  if (!user) {
    // Create a temporary tenant and user for seeding
    // In production, this would be handled differently
    return;
  }

  // Insert default templates
  for (const template of defaultTemplates) {
    await ctx.db.insert("templates", {
      name: template.metadata?.name || "Template",
      category: template.metadata?.category || "General",
      schema: template,
      isPublic: true,
      createdBy: user._id,
      createdAt: Date.now(),
    });
  }
}

