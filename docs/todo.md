# Sniffari — MVP Task List

**Definition of Done:** All tasks below are complete, app deployed on Vercel + Convex, auth → location → pet profile → swipe → match → chat flow works end-to-end.

---

## L1: Data & Backend Foundation

- [ ] **T-01: Project Scaffold**
  - Install deps: `convex`, `clerk`, `framer-motion`, `@clerk/nextjs`
  - Init Convex (`npx convex dev`), add `ClerkProvider` to root layout
  - Set up `.env.local` with Clerk + Convex keys
  - Configure Tailwind v4 with sunset orange-pink theme tokens (`colors.primary`, `colors.accent`)

- [ ] **T-02: Convex Schema**
  - Define `schema.ts` with tables: `users`, `pets`, `swipes`, `matches`, `messages`
  - Add indexes: `users.lat`, `pets.ownerId`, `pets.species`, `swipes.(actorPetId,targetPetId)`, `messages.matchId`
  - Seed static zip-to-lat/lng lookup table

- [ ] **T-03: Convex Queries & Mutations**
  - `createUser`, `updateLocation`, `updateLookingFor`
  - `createPet`, `updatePet`, `listUserPets`
  - `getCandidates` (Bounding Box → Haversine filter), `recordSwipe`, `checkMatch`
  - `getMatches`, `getMessages`, `sendMessage`

## L2: UI Foundation & Auth

- [ ] **T-04: Auth Pages & Middleware**
  - `middleware.ts` protecting `/swipe`, `/chats`, `/profile`, `/settings`
  - Sign In (`/sign-in`) and Sign Up (`/sign-up`) pages via Clerk components
  - Root layout with `ClerkProvider`, `SignedIn`/`SignedOut` branching
  - Redirect logic: unauthenticated → `/sign-in`, no pet → `/onboarding`, else → `/swipe`

## L3: Onboarding Flow

- [ ] **T-05: Location Capture Page**
  - `/onboarding/location` page: `navigator.geolocation` button + manual zip input fallback
  - On success, call `updateLocation` mutation → redirect to `/onboarding/pet`

- [ ] **T-06: Pet Profile Creation**
  - `/onboarding/pet` page: form (name, species dropdown, breed, age, tags, photo upload)
  - Species dropdown determines dynamic copy hints
  - Convex File Storage for photo
  - On submit → `createPet` mutation → redirect to `/swipe`

## L4: Feature UI — Swipe, Match, Chat, Profile

- [ ] **T-07: Swipe Deck**
  - `/swipe` page: fetch candidates via `getCandidates` query
  - Framer Motion draggable card (horizontal drag → snap right/left, throw detection)
  - Card UI: pet photo, name, breed, age, species-badged tags
  - Species-adaptive action label ("Play?" / "Chirp?" / "Prowl?" / "Bask?")
  - On swipe complete → `recordSwipe` mutation → next card
  - Empty state + exhausted deck state

- [ ] **T-08: Match Detection & Celebration**
  - After each `recordSwipe("liked")`, run `checkMatch` on Convex
  - On match: "It's a Match!" modal with Framer Motion confetti/stars animation
  - Two CTAs: "Send a Message" → `/chats/[matchId]`, "Keep Swiping" → dismiss

- [ ] **T-09: Real-time Chat**
  - `/chats` page: list of matches with last message preview, pet avatar + name
  - `/chats/[matchId]` page: Convex subscription on `getMessages`
  - Message bubble UI (sent right-aligned, received left-aligned)
  - Species-adaptive empty states ("No matches yet — keep swiping!")
  - Input bar with send button

- [ ] **T-10: Profile & Settings**
  - `/profile` page: list user's pets, view/edit each, add new pet
  - `/settings` page: re-capture location, update "looking for" species, logout

## L5: Polish & Deploy

- [ ] **T-11: Polish**
  - Loading skeletons for swipe deck, chat list, chat thread
  - Error boundaries + retry buttons on all data-fetching screens
  - Mobile-responsive QA (320px–768px)
  - Build + lint pass (`npm run build`, `npm run lint`)

- [ ] **T-12: Deploy**
  - Push Convex schema to production (`npx convex deploy`)
  - Deploy frontend to Vercel
  - Verify end-to-end flow on production URL
