import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    lat: v.number(),
    lng: v.number(),
    lookingFor: v.array(v.string()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_lat", ["lat"]),

  pets: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    species: v.string(),
    breed: v.string(),
    age: v.number(),
    tags: v.optional(v.array(v.string())),
    imageStorageId: v.optional(v.string()),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_species", ["species"]),

  swipes: defineTable({
    actorPetId: v.id("pets"),
    targetPetId: v.id("pets"),
    action: v.string(),
  })
    .index("by_actor", ["actorPetId"])
    .index("by_target", ["targetPetId"])
    .index("by_actor_target", ["actorPetId", "targetPetId"]),

  matches: defineTable({
    petA_Id: v.id("pets"),
    petB_Id: v.id("pets"),
  })
    .index("by_petA", ["petA_Id"])
    .index("by_petB", ["petB_Id"]),

  messages: defineTable({
    matchId: v.id("matches"),
    senderId: v.id("users"),
    text: v.string(),
  })
    .index("by_matchId", ["matchId"]),

  zipCodes: defineTable({
    zip: v.string(),
    lat: v.number(),
    lng: v.number(),
  })
    .index("by_zip", ["zip"]),
});
