---
description: LIGHT complexity project kickoff — speed and velocity focused.
name: Project Kickoff Light
---

# Project Kickoff Workflow (LIGHT)

This workflow is for **prototypes, MVPs, hackathons, or solo/small team projects** where speed is critical. The goal is to get from "Idea" to "Code" as fast as possible without losing the plot.

## When to Use LIGHT

Use this workflow if ANY of the following apply:
- Solo developer or small team (< 3 people)
- Prototype or MVP phase
- Speed is the primary constraint
- "Living document" approach (minimal governance)

---

# Phase 1: The Integrated Spec (PRD + FSD + Tech + ERD)

## Step 1: Integrated Spec Interview & Generation

> **Philosophy**: "If it doesn't help me write code in the next 10 minutes, skip it."

1.  **Read**: Load `skills/prd-generator/SKILL.md` and `skills/fsd-generator/SKILL.md` for combined guidance.
2.  **Interview**: Conduct a single "Double-Threat" interview session.
    *   **Goal**: Gather high-level goals (PRD) AND specific logic rules (FSD) in one go.
    *   *Question*: "What is the goal of this feature, and what are the specific logic rules for the main user flow?"
    *   *Tech Stack*: Assume standard defaults (e.g., Next.js, Tailwind, Supabase/Postgres) unless specific requirements exist.
    *   *Theme*: Ask for primary color and light/dark preference.
3.  **Generate**: Create a single "Integrated Spec" at `docs/spec.md`.
    *   **Content**:
        *   **Section A (PRD)**: Product Brief (Problem, Solution, Audience), User Stories, Success Metrics.
        *   **Section B (FSD)**: Detailed Functional Flows (e.g., "When user clicks X, Y happens, then Z is updated") & Business Rules.

## Step 2: Technical Blueprint

1.  **Read**: Load `skills/erd-generator/SKILL.md` and `skills/tech-stack/SKILL.md`.
2.  **Action**: Generate the Mermaid ERD and Brief Tech Stack summary.
3.  **Output**: Append directly to the bottom of `docs/spec.md`.
4.  **Approve**: Stop and wait for explicit user approval. Do NOT auto-proceed.
    *   *Action*: Review the `docs/spec.md`. Edit directly if needed.

---

# Phase 2: Execution Plan

## Step 3: Traceable Task List

1.  **Read**: Load `skills/story-generator/SKILL.md`.
2.  **Context**: Read `docs/spec.md`.
3.  **Generate**: Create a Task List at `docs/todo.md`.
    *   **Source**: Derive tasks directly from `docs/spec.md`.
    *   **Format**: A single markdown file with a checklist of tasks.
    *   **Style**: Vertical slicing (e.g., "Implement User Auth", "Build Dashboard Layout").
    *   **Definition of Done**: Include a brief "Definition of Done" for the project.
    *   **No Granular Stories**: Do NOT create individual `.md` files.
4.  **Completion**: Notify the user that the kickoff is complete.
    *   *Reminder*: "Edit `docs/spec.md` directly as the project evolves."
