import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const recordSwipe = mutation({
  args: {
    actorPetId: v.id("pets"),
    targetPetId: v.id("pets"),
    action: v.string(),
  },
  handler: async (ctx, { actorPetId, targetPetId, action }) => {
    await ctx.db.insert("swipes", {
      actorPetId,
      targetPetId,
      action: action as "liked" | "passed",
    });

    if (action !== "liked") return null;

    const reciprocal = await ctx.db
      .query("swipes")
      .withIndex("by_actor_target", (q) =>
        q.eq("actorPetId", targetPetId).eq("targetPetId", actorPetId),
      )
      .first();

    if (!reciprocal || reciprocal.action !== "liked") return null;

    const existing = await ctx.db
      .query("matches")
      .withIndex("by_petA", (q) => q.eq("petA_Id", actorPetId))
      .collect();

    const hasMatch = existing.some((m) => m.petB_Id === targetPetId);
    if (hasMatch) return null;

    return await ctx.db.insert("matches", {
      petA_Id: actorPetId,
      petB_Id: targetPetId,
    });
  },
});
