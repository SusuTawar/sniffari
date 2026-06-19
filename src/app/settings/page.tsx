"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import NavBar from "@/components/nav/NavBar";
import { api } from "@/../convex/_generated/api";

const SPECIES_OPTIONS = ["dog", "cat", "bird", "reptile"];

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const userRecord = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });
  const updateLocation = useMutation(api.users.updateLocation);
  const updateLookingFor = useMutation(api.users.updateLookingFor);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  if (userRecord && !initialized) {
    setLookingFor(userRecord.lookingFor);
    setInitialized(true);
  }

  const handleGeolocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (userRecord) {
          await updateLocation({
            userId: userRecord._id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        }
        setLocLoading(false);
      },
      () => setLocLoading(false),
      { timeout: 10000 },
    );
  };

  const toggleSpecies = (s: string) => {
    setLookingFor((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const handleSave = async () => {
    if (userRecord) {
      await updateLookingFor({
        userId: userRecord._id,
        lookingFor,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-neutral pb-16 sm:pb-0">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="text-lg font-bold text-primary">Settings</span>
        <NavBar />
      </header>

      <main className="flex-1 px-5">
        <section className="py-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
            Location
          </h2>
          <div className="mt-3 rounded-2xl bg-white p-4">
            <p className="text-sm text-ink">
              {userRecord
                ? `Lat: ${userRecord.lat.toFixed(4)}, Lng: ${userRecord.lng.toFixed(4)}`
                : "Loading..."}
            </p>
            <button
              onClick={handleGeolocation}
              disabled={locLoading}
              className="mt-3 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {locLoading ? "Updating..." : "Update Location"}
            </button>
          </div>
        </section>

        <section className="py-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
            Looking For
          </h2>
          <p className="mt-1 text-xs text-muted">
            Which species are you open to meeting?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SPECIES_OPTIONS.map((s) => {
              const selected = lookingFor.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSpecies(s)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    selected
                      ? "bg-primary text-white"
                      : "bg-white text-muted border border-muted/30"
                  }`}
                >
                  {s}s
                </button>
              );
            })}
            {!lookingFor.includes("*") && (
              <button
                onClick={() => {
                  if (lookingFor.includes("*")) {
                    setLookingFor(lookingFor.filter((x) => x !== "*"));
                  } else {
                    setLookingFor([
                      ...lookingFor.filter((x) => x !== "*"),
                      "*",
                    ]);
                  }
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  lookingFor.includes("*")
                    ? "bg-primary text-white"
                    : "bg-white text-muted border border-muted/30"
                }`}
              >
                All Species
              </button>
            )}
          </div>
        </section>

        <button
          onClick={handleSave}
          className="mt-4 w-full rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-white transition-all active:scale-[0.98]"
        >
          {saved ? "Saved!" : "Save Preferences"}
        </button>

        <section className="py-8">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full rounded-2xl border border-error/30 px-6 py-4 text-center font-semibold text-error"
          >
            Sign Out
          </button>
        </section>
      </main>
    </div>
  );
}
