import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    lat: v.number(),
    lng: v.number(),
    lookingFor: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

export const updateLocation = mutation({
  args: {
    userId: v.id("users"),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, { userId, lat, lng }) => {
    await ctx.db.patch(userId, { lat, lng });
  },
});

export const updateLookingFor = mutation({
  args: {
    userId: v.id("users"),
    lookingFor: v.array(v.string()),
  },
  handler: async (ctx, { userId, lookingFor }) => {
    await ctx.db.patch(userId, { lookingFor });
  },
});
