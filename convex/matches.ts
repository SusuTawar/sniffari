import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const checkMatch = mutation({
  args: {
    actorPetId: v.id("pets"),
    targetPetId: v.id("pets"),
  },
  handler: async (ctx, { actorPetId, targetPetId }) => {
    const reciprocal = await ctx.db
      .query("swipes")
      .withIndex("by_actor_target", (q) =>
        q.eq("actorPetId", targetPetId).eq("targetPetId", actorPetId),
      )
      .first();

    if (reciprocal?.action === "liked") {
      const existing = await ctx.db
        .query("matches")
        .withIndex("by_petA", (q) => q.eq("petA_Id", actorPetId))
        .collect();

      const hasMatch = existing.some((m) => m.petB_Id === targetPetId);

      if (!hasMatch) {
        return await ctx.db.insert("matches", {
          petA_Id: actorPetId,
          petB_Id: targetPetId,
        });
      }
    }
    return null;
  },
});

export const getMatches = query({
  args: { petId: v.id("pets") },
  handler: async (ctx, { petId }) => {
    const matchesA = await ctx.db
      .query("matches")
      .withIndex("by_petA", (q) => q.eq("petA_Id", petId))
      .collect();

    const matchesB = await ctx.db
      .query("matches")
      .withIndex("by_petB", (q) => q.eq("petB_Id", petId))
      .collect();

    return [...matchesA, ...matchesB];
  },
});

export const getMatchesWithDetails = query({
  args: { petId: v.id("pets") },
  handler: async (ctx, { petId }) => {
    const [matchesA, matchesB] = await Promise.all([
      ctx.db
        .query("matches")
        .withIndex("by_petA", (q) => q.eq("petA_Id", petId))
        .collect(),
      ctx.db
        .query("matches")
        .withIndex("by_petB", (q) => q.eq("petB_Id", petId))
        .collect(),
    ]);

    const allMatches = [...matchesA, ...matchesB];

    return await Promise.all(
      allMatches.map(async (match) => {
        const otherPetId = match.petA_Id === petId ? match.petB_Id : match.petA_Id;
        const [otherPet, messages] = await Promise.all([
          ctx.db.get(otherPetId),
          ctx.db
            .query("messages")
            .withIndex("by_matchId", (q) => q.eq("matchId", match._id))
            .collect(),
        ]);

        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

        return {
          matchId: match._id,
          petName: otherPet?.name ?? "Unknown",
          species: otherPet?.species ?? "",
          lastMessage: lastMessage?.text ?? null,
        };
      }),
    );
  },
});
