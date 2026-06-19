import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPet = mutation({
  args: {
    ownerId: v.id("users"),
    name: v.string(),
    species: v.string(),
    breed: v.string(),
    age: v.number(),
    tags: v.optional(v.array(v.string())),
    imageStorageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pets", args);
  },
});

export const updatePet = mutation({
  args: {
    petId: v.id("pets"),
    name: v.optional(v.string()),
    species: v.optional(v.string()),
    breed: v.optional(v.string()),
    age: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    imageStorageId: v.optional(v.string()),
  },
  handler: async (ctx, { petId, ...fields }) => {
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([_, v]) => v !== undefined),
    );
    await ctx.db.patch(petId, patch);
  },
});

export const listUserPets = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, { ownerId }) => {
    return await ctx.db
      .query("pets")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", ownerId))
      .collect();
  },
});

export const getPet = query({
  args: { petId: v.id("pets") },
  handler: async (ctx, { petId }) => {
    return await ctx.db.get(petId);
  },
});
