import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    matchId: v.id("matches"),
    senderId: v.id("users"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", args);
  },
});

export const getMessages = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, { matchId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_matchId", (q) => q.eq("matchId", matchId))
      .order("asc")
      .collect();
  },
});
