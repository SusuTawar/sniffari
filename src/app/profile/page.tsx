"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import NavBar from "@/components/nav/NavBar";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const userRecord = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  const ownerId = userRecord?._id as Id<"users"> | undefined;
  const userPets = useQuery(
    api.pets.listUserPets,
    ownerId ? { ownerId } : "skip",
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-neutral pb-16 sm:pb-0">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-lg font-bold text-primary">My Pets</span>
        <div className="flex items-center gap-2">
          <NavBar />
          <button
            onClick={() => setAddMode(true)}
            className="rounded-full bg-primary p-2 text-white"
          >
            <span className="text-lg">+</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 py-4">
        {!userPets ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-surface"
              />
            ))}
          </div>
        ) : userPets.length === 0 && !addMode ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <span className="text-5xl">🐾</span>
            <h2 className="mt-4 text-xl font-bold text-ink">No pets yet</h2>
            <p className="mt-1 text-sm text-muted">
              Add your first pet to start sniffing!
            </p>
            <button
              onClick={() => setAddMode(true)}
              className="mt-6 rounded-2xl bg-primary px-8 py-4 font-bold text-white"
            >
              Add a Pet
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {userPets.map((p) => (
              <PetCard
                key={p._id}
                pet={p}
                isEditing={editingId === p._id}
                onToggleEdit={() =>
                  setEditingId(editingId === p._id ? null : p._id)
                }
              />
            ))}
            {addMode && (
              <AddPetForm
                ownerId={userRecord!._id}
                onDone={() => setAddMode(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function PetCard({
  pet,
  isEditing,
  onToggleEdit,
}: {
  pet: { _id: string; name: string; species: string; breed: string; age: number; tags?: string[] };
  isEditing: boolean;
  onToggleEdit: () => void;
}) {
  const updatePet = useMutation(api.pets.updatePet);
  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed);
  const [age, setAge] = useState(String(pet.age));

  const handleSave = async () => {
    await updatePet({
      petId: pet._id as Id<"pets">,
      name: name.trim(),
      breed: breed.trim(),
      age: parseInt(age, 10),
      tags: pet.tags,
    });
    onToggleEdit();
  };

  if (isEditing) {
    return (
      <div className="rounded-2xl bg-white p-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-muted/30 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
        />
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="mt-2 w-full rounded-xl border border-muted/30 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min={0}
          max={50}
          className="mt-2 w-full rounded-xl border border-muted/30 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-white"
          >
            Save
          </button>
          <button
            onClick={onToggleEdit}
            className="flex-1 rounded-xl border border-muted/30 py-2 text-sm font-medium text-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onToggleEdit}
      className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left transition-colors hover:bg-surface"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-xl">
        🐾
      </div>
      <div className="flex-1">
        <p className="font-semibold text-ink capitalize">{pet.name}</p>
        <p className="text-sm text-muted">
          {pet.breed} · {pet.age} {pet.age === 1 ? "yr" : "yrs"} · {pet.species}
        </p>
        {pet.tags && pet.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {pet.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="text-muted">✎</span>
    </button>
  );
}

function AddPetForm({
  ownerId,
  onDone,
}: {
  ownerId: Id<"users">;
  onDone: () => void;
}) {
  const createPet = useMutation(api.pets.createPet);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !species || !breed.trim() || !age) return;
    setSubmitting(true);
      await createPet({
      ownerId,
      name: name.trim(),
      species,
      breed: breed.trim(),
      age: parseInt(age, 10),
    });
    setSubmitting(false);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-ink">Add a new pet</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full rounded-xl border border-muted/30 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
      />
      <select
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        className="mt-2 w-full rounded-xl border border-muted/30 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
      >
        <option value="">Species</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="bird">Bird</option>
        <option value="reptile">Reptile</option>
      </select>
      <input
        type="text"
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
        placeholder="Breed"
        className="mt-2 w-full rounded-xl border border-muted/30 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        min={0}
        max={50}
        className="mt-2 w-full rounded-xl border border-muted/30 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={submitting || !name || !species || !breed || !age}
          className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {submitting ? "Adding..." : "Add Pet"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded-xl border border-muted/30 py-2 text-sm font-medium text-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
