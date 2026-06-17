<!-- RAGI:BEGIN -->
Use ragi MCP tools to look up repo information before guessing.

When answering "what/where/how" questions about this repo:
- Prefer `rag_search` first (semantic).
- Use `rag_list_projects` if project path/allowlist is unclear.
- Use `rag_index` if results suggest the repo is not indexed yet.

Inputs: `projectPath` (absolute path), `query`, optional `limit`.
Fallback: if RAG is unavailable/unindexed, use normal file search.
<!-- RAGI:END -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Context: Pet Playdate App
**The App:** A mobile-first web app for arranging platonic local playdates for pets (dogs, cats, birds, reptiles). Strictly for pet socialization, NOT human dating.
**The Vibe:** Playful, energetic, casual, bouncy. Bright colors, rounded UI elements, and fun micro-interactions.
**Core Flow:** Register -> Add 1 pet -> Swipe on local pets (Right=Play, Left=Pass) -> Mutual match -> Real-time text chat.
**Tech Stack:**
* Frontend: Next.js (App Router), React, Tailwind CSS, Framer Motion
* Backend & DB: Convex (for real-time data sync)
* Auth: Clerk (Email/Password only)
**Strict Engineering Rules:**
1. **Zero-API Location:** Use native HTML5 `navigator.geolocation` or a static zip-code database. NO Google Maps, Mapbox, or paid APIs.
2. **Backend Geospatial Math:** All distance matching (Bounding Box + Haversine formula) must happen purely on the Convex server.
3. **Inclusive UI:** Dynamically adapt tags and UI copy based on the pet's species (e.g., no dog puns for cats).
4. **Scope Limits:** No human profile pictures, no chat read-receipts, and no social logins for the MVP.
> **Note to Agent:** If you need more detailed project requirements, database schema definitions, or architectural context before writing code, always refer to the `/docs` directory.

<!-- BEGIN:design-context -->
## Design Context
- **PRODUCT.md** — Strategic: register, users, brand personality, design principles, anti-references
- **DESIGN.md** — Visual: "The Golden Hour Playdate" palette, rounded playful sans, choreographed motion, Committed orange-pink color strategy
- **Register:** product (app UI)
- Always read both files before writing UI code.
<!-- END:design-context -->
