import { v } from "convex/values";
import { action } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/workos";

export const generateUploadUrl = action(async (ctx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");

  return await ctx.storage.generateUploadUrl();
});

