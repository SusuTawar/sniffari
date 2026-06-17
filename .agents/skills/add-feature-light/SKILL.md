---
description: LIGHT complexity feature addition — fast, lean updates to the
  single Integrated Spec.
name: Add Feature Light
---

# Add Feature Workflow (LIGHT)

This workflow is for adding features to a project started with **Project Kickoff (LIGHT)**. It maintains the "One-Pager" philosophy by updating the existing `spec.md` rather than creating fragmented documents.

## Step 1: Integrated Spec Update

1.  **Read**: Contextualize the existing structure by reading `docs/spec.md`.
2.  **Interview**: Identify the new feature requirements.
    *   *Goal*: Define high-level goals (PRD), specific logic rules (FSD), and data changes (ERD).
    *   *Question*: "What is the goal of this new feature, and what are the specific logic rules and data changes required?"
3.  **Update**: Edit `docs/spec.md` directly.
    *   **Action**: Insert the new feature's PRD, FSD, and ERD updates into the relevant sections of the existing spec.
    *   *Reference*: Use `skills/fsd-generator/SKILL.md` or `skills/erd-generator/SKILL.md` for guidance on how to structure the logic, but **write the output directly into `spec.md`**.
4.  **Approve**: Stop and wait for explicit user approval. Do NOT auto-proceed.

## Step 2: Task List Update

1.  **Read**: Load `skills/story-generator/SKILL.md` for task breakdown guidance.
2.  **Update**: Edit `docs/todo.md` directly.
    *   **Action**: Add the new feature's implementation tasks to the existing list.
    *   **Style**: Vertical slicing (e.g., "Feature X: Backend API", "Feature X: Frontend UI").
3.  **Completion**: Notify the user that the feature has been specced and planned.
