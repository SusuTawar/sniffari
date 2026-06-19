"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import NavBar from "@/components/nav/NavBar";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

export default function ChatListPage() {
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

  const pet = userPets?.[0];
  const petId = pet?._id as Id<"pets"> | undefined;
  const matches = useQuery(
    api.matches.getMatchesWithDetails,
    petId ? { petId } : "skip",
  );

  return (
    <div className="flex min-h-dvh flex-col bg-neutral pb-16 sm:pb-0">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-lg font-bold text-primary">Chats</span>
        <NavBar />
      </header>

      <main className="flex-1 px-5">
        {!matches ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="h-12 w-12 animate-pulse rounded-full bg-surface" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-surface" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <span className="text-5xl">🔍</span>
            <h2 className="mt-4 text-xl font-bold text-ink">
              No matches yet
            </h2>
            <p className="mt-1 text-sm text-muted">
              Keep swiping to find playdates!
            </p>
            <Link
              href="/swipe"
              className="mt-6 rounded-2xl bg-primary px-8 py-4 font-bold text-white"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2 py-4">
            {matches.map((match) => (
              <Link
                key={match.matchId}
                href={`/chats/${match.matchId}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 transition-colors hover:bg-surface"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-xl">
                  🐾
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink capitalize">{match.petName}</p>
                  <p className="truncate text-sm text-muted">
                    {match.lastMessage ?? "Say hello!"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
