import { v } from "convex/values";
import { mutation } from "./_generated/server";

const USER_NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah",
  "Ian", "Julia", "Kevin", "Luna", "Marcus", "Nina", "Oscar", "Penny",
  "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xander",
  "Yara", "Zane", "Amber", "Blake", "Cora", "Derek", "Elena", "Finn",
  "Grace", "Henry", "Ivy", "Jake", "Kara", "Leo", "Maya", "Noah",
  "Olive", "Paul", "Rhea", "Seth", "Tessa", "Ulysses", "Vera", "Wade",
  "Xena", "Yusuf", "Zara", "Aiden", "Bella", "Cole", "Daisy", "Elijah",
  "Freya", "Gavin", "Holly", "Isaac", "Jade", "Kai", "Lila", "Milo",
  "Nora", "Owen", "Piper", "Remy", "Sage", "Theo", "Una", "Vince",
  "Willa", "Xavi", "Yuki", "Zoe", "Asher", "Briar", "Caspian", "Delia",
];

const SPECIES_LIST = ["dog", "cat", "bird", "reptile"];

const BREEDS: Record<string, string[]> = {
  dog: [
    "Golden Retriever", "Labrador", "Poodle", "Beagle", "Corgi", "Husky",
    "Pug", "Shih Tzu", "Border Collie", "Australian Shepherd", "Dachshund",
    "Great Dane", "Pomeranian", "Chihuahua", "Samoyed",
  ],
  cat: [
    "Persian", "Siamese", "Maine Coon", "Bengal", "Sphynx", "Ragdoll",
    "British Shorthair", "Scottish Fold", "Abyssinian", "Birman",
  ],
  bird: [
    "Cockatiel", "Budgie", "African Grey", "Lovebird", "Canary",
    "Conure", "Cockatoo", "Finch", "Macaw", "Parrotlet",
  ],
  reptile: [
    "Bearded Dragon", "Leopard Gecko", "Ball Python", "Crested Gecko",
    "Corn Snake", "Tortoise", "Iguana", "Blue Tongue Skink",
    "Chameleon", "Red-Eared Slider",
  ],
};

const PET_NAMES: Record<string, string[]> = {
  dog: [
    "Buddy", "Max", "Charlie", "Rocky", "Cooper", "Luna", "Bella", "Daisy",
    "Molly", "Bailey", "Sadie", "Coco", "Ruby", "Zoe", "Stella", "Winston",
    "Bruno", "Ollie", "Milo", "Bear",
  ],
  cat: [
    "Luna", "Simba", "Oliver", "Milo", "Leo", "Chloe", "Sophie", "Lily",
    "Cleo", "Nala", "Oreo", "Salem", "Mochi", "Tofu", "Whiskers", "Mittens",
    "Shadow", "Tiger", "Smokey", "Felix",
  ],
  bird: [
    "Sunny", "Kiwi", "Mango", "Sky", "Blue", "Rio", "Chirpy", "Pepper",
    "Coco", "Pikachu", "Zazu", "Tweety", "Lucky", "Angel", "Baby",
  ],
  reptile: [
    "Spike", "Draco", "Reptar", "Shellby", "Squirtle", "Godzilla", "Yoshi",
    "Rango", "Kaa", "Sir Hiss", "Crush", "Bowser", "Zilla", "Gecko", "Groot",
  ],
};

const TAG_OPTIONS: Record<string, string[]> = {
  dog: [
    "friendly", "energetic", "loves fetch", "good with kids", "cuddly",
    "trained", "playful", "calm", "adventurous", "water lover",
    "ball obsessed", "sniff enthusiast", "treat motivated", "belly rub fan",
  ],
  cat: [
    "independent", "cuddly", "playful", "lap cat", "curious",
    "treat motivated", "window watcher", "feisty", "gentle", "talkative",
    "laser chaser", "sunbeam seeker", "box lover", "purr machine",
  ],
  bird: [
    "talkative", "whistler", "friendly", "curious", "mimic",
    "shoulder perch", "treat motivated", "gentle", "active", "tame",
    "head scratch fan", "dancing", "freedom flyer", "finger trained",
  ],
  reptile: [
    "hand tame", "curious", "calm", "great eater", "shed well",
    "active", "gentle", "display animal", "handleable", "basking lover",
    "digger", "climber", "hunter", "docile",
  ],
};

const CITIES = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { name: "Semarang", lat: -6.9932, lng: 110.4203 },
  { name: "Malang", lat: -7.9797, lng: 112.6304 },
  { name: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
];

type City = (typeof CITIES)[number];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomAge(): number {
  return pick([1, 2, 3, 4, 5, 6, 7, 8]);
}

function randomLookingFor(): string[] {
  const all = [...SPECIES_LIST];
  const count = Math.random() < 0.4 ? all.length : Math.floor(Math.random() * 3) + 1;
  return pickN(all, count);
}

function pickCity(): City {
  return pick(CITIES);
}

function pickSpecies(): string {
  return pick(SPECIES_LIST);
}

function pickPetName(species: string): string {
  return pick(PET_NAMES[species]);
}

function pickBreed(species: string): string {
  return pick(BREEDS[species]);
}

function pickTags(species: string): string[] {
  const n = Math.floor(Math.random() * 3) + 1;
  return pickN(TAG_OPTIONS[species], n);
}

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // const existing = await ctx.db.query("users").first();
    // if (existing) {
    //   throw new Error("Database already has data. Run clearSeed first to reset.");
    // }

    let petCount = 0;
    const targetPetCount = 100;

    for (let i = 0; i < USER_NAMES.length && petCount < targetPetCount; i++) {
      const city = pickCity();
      const lookingFor = randomLookingFor();

      const userId = await ctx.db.insert("users", {
        clerkId: `seed_user_${i}_${Date.now()}`,
        name: USER_NAMES[i],
        lat: city.lat + (Math.random() - 0.5) * 0.1,
        lng: city.lng + (Math.random() - 0.5) * 0.1,
        lookingFor,
      });

      const species = pickSpecies();
      await ctx.db.insert("pets", {
        ownerId: userId,
        name: pickPetName(species),
        species,
        breed: pickBreed(species),
        age: randomAge(),
        tags: pickTags(species),
      });
      petCount++;

      if (Math.random() < 0.25 && petCount < targetPetCount) {
        const species2 = pickSpecies();
        await ctx.db.insert("pets", {
          ownerId: userId,
          name: pickPetName(species2),
          species: species2,
          breed: pickBreed(species2),
          age: randomAge(),
          tags: pickTags(species2),
        });
        petCount++;
      }
    }

    return { usersCreated: USER_NAMES.length, petsCreated: petCount };
  },
});

export const clearSeed = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const u of users) {
      if (u.clerkId.startsWith("seed_user_")) {
        const pets = await ctx.db
          .query("pets")
          .withIndex("by_ownerId", (q) => q.eq("ownerId", u._id))
          .collect();
        for (const p of pets) {
          await ctx.db.delete(p._id);
        }
        await ctx.db.delete(u._id);
      }
    }
  },
});
