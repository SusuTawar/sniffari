"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const SPECIES_HINTS: Record<string, { action: string; tagSuggestions: string[] }> = {
  dog: {
    action: "Play?",
    tagSuggestions: ["friendly", "energetic", "gentle", "fetch", "cuddly"],
  },
  cat: {
    action: "Prowl?",
    tagSuggestions: ["curious", "gentle", "playful", "cuddly", "chill"],
  },
  bird: {
    action: "Chirp?",
    tagSuggestions: ["vocal", "friendly", "curious", "playful", "tame"],
  },
  reptile: {
    action: "Bask?",
    tagSuggestions: ["docile", "curious", "handling-friendly", "calm", "display"],
  },
};

export default function PetProfilePage() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const userRecord = useQuery(
    api.users.getUserByClerkId,
    isLoaded && userId ? { clerkId: userId } : "skip",
  );
  const userPets = useQuery(
    api.pets.listUserPets,
    userRecord ? { ownerId: userRecord._id } : "skip",
  );
  const createPet = useMutation(api.pets.createPet);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (userRecord === undefined) return;
    if (userRecord && userPets === undefined) return;

    if (userRecord && userPets && userPets.length > 0) {
      router.replace("/swipe");
    }
    if (!userRecord) {
      router.replace("/onboarding/location");
    }
  }, [isLoaded, userRecord, userPets, router]);

  if (!isLoaded || (userId && (userRecord === undefined || (userRecord && userPets === undefined)))) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (!userRecord) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (userPets && userPets.length > 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  const speciesHints = SPECIES_HINTS[species] ?? null;

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t && tags.length < 5 && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !species || !breed.trim() || !age || !userRecord) return;
    setSubmitting(true);

    try {
      await createPet({
        ownerId: userRecord._id,
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: parseInt(age, 10),
        tags: tags.length > 0 ? tags : undefined,
        imageStorageId: undefined,
      });
      router.push("/swipe");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-ink">Meet your pet</h1>
        <p className="mt-1 text-sm text-muted">
          Tell us about your furry, feathery, or scaly friend
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-surface">
            <span className="text-4xl">🐾</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Pet name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="e.g. Luna"
            className="w-full rounded-xl border border-muted/30 bg-white px-4 py-3 text-ink placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Species
          </label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full rounded-xl border border-muted/30 bg-white px-4 py-3 text-ink focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          >
            <option value="">Select species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="reptile">Reptile</option>
          </select>
        </div>

        {speciesHints && (
          <p className="-mt-3 text-xs text-muted">
            Your pet&apos;s action: <strong>{speciesHints.action}</strong>
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Breed
          </label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            maxLength={50}
            placeholder="e.g. Golden Retriever"
            className="w-full rounded-xl border border-muted/30 bg-white px-4 py-3 text-ink placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min={0}
            max={50}
            placeholder="Years"
            className="w-full rounded-xl border border-muted/30 bg-white px-4 py-3 text-ink placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Tags (up to 5)
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {tag} ✕
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              maxLength={30}
              placeholder="Add a tag"
              className="flex-1 rounded-xl border border-muted/30 bg-white px-4 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              disabled={!tagInput.trim() || tags.length >= 5}
              className="rounded-xl bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>
          {speciesHints && tags.length < 5 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {speciesHints.tagSuggestions
                .filter((s) => !tags.includes(s))
                .slice(0, 5 - tags.length)
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addTag(s)}
                    className="rounded-full bg-surface px-2 py-1 text-xs text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={
            submitting || !name.trim() || !species || !breed.trim() || !age
          }
          className="mt-2 w-full rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Start Sniffari"}
        </button>
      </form>
    </div>
  );
}
