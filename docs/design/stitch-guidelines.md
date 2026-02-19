# Stitch Guidelines: Managing AI Design

> **Purpose**: This document governs how we use AI generation tools (like Stitch) in WeddingOS.
> **Philosophy**: AI is a junior designer. You are the Creative Director. It proposes; you decide.

## 1. Role of Stitch

Stitch is used for **Exploration**, not Definition.

- **Ideation**: "Show me 3 ways to layout a budget summary card."
- **Exploration**: "Visualize a mobile flow for adding a new guest."
- **Visual Validation**: "Check if this color combination feels calm enough for a dashboard."

Stitch helps us break through "blank canvas" paralysis, but it **does not** own the design system.

## 2. What Stitch Must NEVER Do

The following are strictly forbidden in AI-generated output:

1.  **Define Colors**: Stitch cannot invent new shades of teal. It must use the `tokens.md` hex codes.
2.  **Invent Components**: If a card exists in `components.md`, use it. Do not create a "SuperCard" just for one screen.
3.  **Override Tokens**: No arbitrary `margin: 17px`. Use the spacing scale.
4.  **Generate Final Production Code**: AI code is a prototype. It must be refactored to match our codebase standards (React, Tailwind, TypeScript) before merging.

## 3. Mandatory Prompt Rules

When prompting Stitch (or any AI), you must explicitly constrain it:

- **Always Reference Theme**: "Design this screen using the 'Calm' and 'Elegant' theme defined in `theme.md`."
- **Always Reference Tokens**: "Use only colors and spacing defined in `tokens.md`. Do not use arbitrary values."
- **Mobile-First**: "Design this for a 375px wide iPhone SE screen first."
- **No Filler**: "Use real wedding data for content, not 'Lorem Ipsum'."

## 4. Review Checklist

Before approving any AI-generated design:

- [ ] **Visual Consistency**: Are the buttons the right shade of Primary? are the corners 16px?
- [ ] **Emotional Tone**: Does this screen feel stressful? Is there too much red?
- [ ] **UX Clarity**: Is the primary action obvious? Is there only one?
- [ ] **Accessibility**: Is the text contrast sufficient?

## 5. Translating Stitch to Code

Stitch output is a **Design Artifact**, not a Code Artifact.

1.  **Extract the Layout**: Copy the Grid/Flex structure.
2.  **Apply Tokens**: Replace hardcoded values (`#2F6F6A`) with Token variables (`bg-primary`).
3.  **Componentize**: Identify parts that match existing components (e.g., "This list item is just a `Card`") and replace the AI code with the shared component.
4.  **Refine Copy**: Rewrite any "AI-speak" to match the "Human" tone in `ui-principles.md`.

---
**Verdict**: If the AI suggests a design that violates these guidelines, **discard it**. The Design System is law.
