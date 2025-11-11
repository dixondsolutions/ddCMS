import { v } from "convex/values";
import { query } from "../_generated/server";

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("templates")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("templates").collect();
  },
});

export const getById = query({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

