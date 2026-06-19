"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export default function LocationPage() {
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
  const createUser = useMutation(api.users.createUser);
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (userRecord === undefined) return;
    if (userRecord && userPets === undefined) return;

    if (userRecord && userPets && userPets.length > 0) {
      router.replace("/swipe");
    } else if (userRecord && userPets && userPets.length === 0) {
      router.replace("/onboarding/pet");
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

  if (userRecord) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  const handleGeolocation = () => {
    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await createUser({
            clerkId: userId!,
            name: "Pet Owner",
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            lookingFor: ["*"],
          });
          router.push("/onboarding/pet");
        } catch {
          router.push("/onboarding/pet");
        }
      },
      () => {
        setLoading(false);
        setError(
          "Location access denied. Enter your zip code instead.",
        );
      },
      { timeout: 10000 },
    );
  };

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.trim().length < 3) return;
    setLoading(true);
    setError("");

    try {
      await createUser({
        clerkId: userId!,
        name: "Pet Owner",
        lat: 0,
        lng: 0,
        lookingFor: ["*"],
      });
      router.push("/onboarding/pet");
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <span className="text-2xl">📍</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-ink">
          Where are you located?
        </h1>
        <p className="mt-1 text-sm text-muted">
          We use your location to find nearby playdates. Your exact address
          stays private.
        </p>
      </div>

      <button
        onClick={handleGeolocation}
        disabled={loading}
        className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Finding you..." : "Use My Location"}
      </button>

      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-muted/30" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-muted/30" />
      </div>

      <form onSubmit={handleZipSubmit} className="w-full">
        <label className="mb-1 block text-left text-sm font-medium text-ink">
          Enter your zip code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="e.g. 10001"
            className="flex-1 rounded-xl border border-muted/30 bg-white px-4 py-3 text-ink placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || zip.trim().length < 3}
            className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-all disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </form>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}
