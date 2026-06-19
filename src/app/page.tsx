"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import NavBar from "@/components/nav/NavBar";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex min-h-dvh flex-col bg-neutral pb-16 sm:pb-0">
        <header className="flex items-center justify-between px-5 py-4">
          <span className="text-lg font-bold text-primary">Petinder</span>
          <NavBar />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <span className="text-6xl">🐾</span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Welcome back!</h1>
          <p className="mt-1 text-sm text-muted max-w-xs">
            Ready to find a playdate for your pet?
          </p>
          <Link
            href="/swipe"
            className="mt-6 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all active:scale-[0.98]"
          >
            Start Sniffari
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-dark p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <span className="mb-6 text-7xl">🐾</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Petinder
        </h1>
        <p className="mt-3 text-lg text-white/80">
          Find local playdates for your pets
        </p>
        <div className="mt-10 flex w-full flex-col gap-3">
          <Link
            href="/sign-in"
            className="w-full rounded-2xl bg-white px-6 py-4 text-center text-lg font-bold text-primary transition-all active:scale-[0.98]"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="w-full rounded-2xl border-2 border-white/30 px-6 py-4 text-center text-lg font-bold text-white transition-all active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
