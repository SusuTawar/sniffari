"use client";

import { useState, useRef } from "react";
import { useRouter, redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import NavBar from "@/components/nav/NavBar";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

const SWIPE_THRESHOLD = 120;

const SPECIES_ACTION: Record<string, string> = {
  dog: "Play!",
  cat: "Prowl?",
  bird: "Chirp?",
  reptile: "Bask?",
};

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  reptile: "🦎",
};

function SwipeCard({
  pet,
  onSwipe,
  isTop,
}: {
  pet: {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    tags?: string[];
    imageStorageId?: string;
    distanceKm: number;
  };
  onSwipe: (id: string, direction: "liked" | "passed") => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const xOffset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(xOffset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
      const direction = xOffset > 0 ? "liked" : "passed";
      const targetX = direction === "liked" ? 500 : -500;

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => onSwipe(pet._id, direction),
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing ${isTop ? "z-10" : "z-0"}`}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative flex-1 bg-surface">
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl">{SPECIES_EMOJI[pet.species] ?? "🐾"}</span>
          </div>

          <motion.div
            className="absolute top-6 left-6 rounded-2xl border-4 border-green-500 bg-white/90 px-4 py-2"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-3xl font-extrabold text-green-500">LIKE</span>
          </motion.div>

          <motion.div
            className="absolute top-6 right-6 rounded-2xl border-4 border-error bg-white/90 px-4 py-2"
            style={{ opacity: passOpacity }}
          >
            <span className="text-3xl font-extrabold text-error">NOPE</span>
          </motion.div>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">{pet.name}</h2>
            <span className="text-sm font-medium text-muted">
              {pet.distanceKm}km
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {pet.breed} &middot; {pet.age} {pet.age === 1 ? "yr" : "yrs"}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {SPECIES_ACTION[pet.species] ?? "Meet?"}
            </span>
            {pet.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-3 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SwipePage() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const userRecord = useQuery(
    api.users.getUserByClerkId,
    isLoaded && userId ? { clerkId: userId } : "skip",
  );

  const ownerId = userRecord?._id as Id<"users"> | undefined;
  const userPets = useQuery(
    api.pets.listUserPets,
    ownerId ? { ownerId } : "skip",
  );

  const recordSwipe = useMutation(api.swipes.recordSwipe);

  const pet = userPets?.[0] as { _id: Id<"pets"> } | undefined;
  const candidates = useQuery(
    api.candidates.getCandidates,
    ownerId && pet
      ? { userId: ownerId, petId: pet._id, radiusKm: 25, limit: 50 }
      : "skip",
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchModal, setMatchModal] = useState<{
    petName: string;
    matchId: string;
  } | null>(null);

  const handleSwipe = async (petId: string, direction: "liked" | "passed") => {
    if (!pet) return;
    const targetPetId = petId as Id<"pets">;
    const matchId = await recordSwipe({
      actorPetId: pet._id,
      targetPetId,
      action: direction,
    });

    if (matchId) {
      const matchedPet = candidates?.find((c) => c._id === petId);
      setMatchModal({
        petName: matchedPet?.name ?? "a new friend",
        matchId,
      });
      return;
    }

    setCurrentIndex((i) => i + 1);
  };

  if (!userRecord) {
    redirect("/onboarding/location");
  }

  if (!userPets || userPets.length === 0) {
    redirect("/onboarding/pet");
  }

  const isLoading = !isLoaded || userRecord === undefined || (userRecord && userPets === undefined);
  const noCandidates = !isLoading && (!candidates || candidates.length === 0);
  const visibleCandidates = candidates?.slice(currentIndex) ?? [];

  return (
    <div className="flex min-h-dvh flex-col bg-neutral pb-16 sm:pb-0">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-lg font-bold text-primary">Sniffari</span>
        <NavBar />
      </header>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        </div>
      ) : noCandidates ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <span className="text-5xl">🔍</span>
          <h2 className="mt-4 text-xl font-bold text-ink">No pets nearby</h2>
          <p className="mt-1 text-sm text-muted">
            Try expanding your search radius or check back later. New pets join every day.
          </p>
          <button
            onClick={() => router.push("/settings")}
            className="mt-6 rounded-2xl bg-primary px-8 py-4 font-bold text-white"
          >
            Adjust Settings
          </button>
        </div>
      ) : (
        <main className="flex flex-1 flex-col items-center justify-center px-5 pb-6 sm:pb-6">
          <div className="relative h-[480px] w-full max-w-sm">
            {visibleCandidates.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-6 text-center">
                <span className="text-4xl">🌅</span>
                <h3 className="mt-3 text-lg font-bold text-ink">
                  All caught up!
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Come back later for new pets in your area
                </p>
              </div>
            ) : (
              visibleCandidates.map((c, i) => (
                <SwipeCard
                  key={c._id}
                  pet={c}
                  onSwipe={handleSwipe}
                  isTop={i === 0}
                />
              ))
            )}
          </div>
        </main>
      )}

      {matchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full max-w-sm rounded-3xl bg-white p-8 text-center"
          >
            <motion.span
              className="text-6xl"
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6 }}
            >
              🎉
            </motion.span>
            <h2 className="mt-4 text-2xl font-extrabold text-ink">
              It&apos;s a Match!
            </h2>
            <p className="mt-1 text-sm text-muted">
              You and <strong>{matchModal.petName}</strong> want to play!
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => router.push(`/chats/${matchModal.matchId}`)}
                className="rounded-2xl bg-primary px-6 py-4 font-bold text-white"
              >
                Send a Message
              </button>
              <button
                onClick={() => {
                  setMatchModal(null);
                  setCurrentIndex((i) => i + 1);
                }}
                className="rounded-2xl border border-muted/30 px-6 py-3 font-medium text-muted"
              >
                Keep Swiping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
