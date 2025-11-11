import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const upload = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const mediaId = await ctx.db.insert("media", {
      tenantId: user.tenantId,
      storageId: args.storageId,
      filename: args.filename,
      mimeType: args.mimeType,
      size: args.size,
      uploadedBy: userId,
      uploadedAt: Date.now(),
    });

    return mediaId;
  },
});

export const remove = mutation({
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

    await ctx.storage.delete(media.storageId);
    await ctx.db.delete(args.id);
  },
});

