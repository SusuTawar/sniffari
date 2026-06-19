"use client";

import { useMemo } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

function ConvexLayer({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convex = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  if (!convex) return <>{children}</>;

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexLayer>{children}</ConvexLayer>
    </ClerkProvider>
  );
}
