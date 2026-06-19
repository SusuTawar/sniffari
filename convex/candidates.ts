import { v } from "convex/values";
import { query } from "./_generated/server";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const getCandidates = query({
  args: {
    userId: v.id("users"),
    petId: v.id("pets"),
    radiusKm: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, petId, radiusKm = 25, limit = 50 }) => {
    const user = await ctx.db.get(userId);
    if (!user) return [];

    const lat = user.lat;
    const lng = user.lng;
    const degLat = radiusKm / 111;
    const degLng = radiusKm / (111 * Math.cos(toRad(lat)));

    const minLat = lat - degLat;
    const maxLat = lat + degLat;
    const minLng = lng - degLng;
    const maxLng = lng + degLng;

    const swipedPetIds = new Set<string>();
    const swipes = await ctx.db
      .query("swipes")
      .withIndex("by_actor", (q) => q.eq("actorPetId", petId))
      .collect();

    for (const s of swipes) {
      swipedPetIds.add(s.targetPetId);
    }

    const userPets = await ctx.db
      .query("pets")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
      .collect();

    const userPetIds = new Set(userPets.map((p) => p._id));

    const ownerIds = await ctx.db
      .query("users")
      .withIndex("by_lat", (q) =>
        q.gte("lat", minLat).lte("lat", maxLat),
      )
      .collect();

    const candidates: Array<{
      _id: string;
      name: string;
      species: string;
      breed: string;
      age: number;
      tags?: string[];
      imageStorageId?: string;
      distanceKm: number;
      ownerId: string;
    }> = [];

    for (const owner of ownerIds) {
      if (owner._id === userId) continue;

      const ownerPetIds = await ctx.db
        .query("pets")
        .withIndex("by_ownerId", (q) => q.eq("ownerId", owner._id))
        .collect();

      for (const pet of ownerPetIds) {
        if (userPetIds.has(pet._id)) continue;
        if (swipedPetIds.has(pet._id)) continue;

        const species = pet.species;
        if (!user.lookingFor.includes("*") && !user.lookingFor.includes(species)) {
          continue;
        }

        const distance = haversine(lat, lng, owner.lat, owner.lng);
        if (distance > radiusKm) continue;

        candidates.push({
          _id: pet._id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          tags: pet.tags,
          imageStorageId: pet.imageStorageId,
          distanceKm: Math.round(distance * 10) / 10,
          ownerId: owner._id,
        });
      }
    }

    candidates.sort((a, b) => a.distanceKm - b.distanceKm);
    return candidates.slice(0, limit);
  },
});
