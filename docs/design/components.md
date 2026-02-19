# Components: The Canonical UI Elements

> **Purpose**: This document defines the standard building blocks of WeddingOS.
> **Constraint**: Do not invent new components if one of these can solve the problem.
> **Philosophy**: Mobile-first, touch-friendly, and visually calm.

## 1. Card (The Primary Container)
**Purpose**: To group related content (e.g., a vendor proposal, a budget item) into a discrete, digestible unit.

### Visual Rules
- **Background**: `Surface` (White).
- **Border**: `1px` solid `neutral-200`.
- **Radius**: `lg` (16px). Friendly and soft.
- **Shadow**: `shadow` (Subtle lift).
- **Padding**: `p-4` (Mobile standard) or `p-6`.

### Behavioral Rules
- **Interactable**: Entire card is clickable if it leads to a detail view.
- **Hover**: Lifts slightly (`shadow-md`) on desktop hover. No effect on mobile.
- **Content**: Should typically include a Title, Status, and 1-3 key metadata points.

## 2. Section Header
**Purpose**: To delineate major areas of a page and set expectations for the content below.

### Visual Rules
- **Typography**: `Text Primary`, `SemiBold`, `text-lg`.
- **Alignment**: Left-aligned.
- **Spacing**: `mb-4` (margin bottom) to separate from content.
- **Optional Action**: A "See All" or "Edit" link (Text Secondary, text-sm) aligned to the right.

### Behavioral Rules
- **Sticky**: Does *not* stick by default (increases cognitive load on mobile).
- **Grouping**: Always followed by a grid or list of Cards.

## 3. Status Badge (Pill)
**Purpose**: To communicate the state of an item (e.g., Booked, Pending, Paid) without shouting.

### Visual Rules
- **Shape**: `rounded-full` (Pill shape).
- **Typography**: `text-xs`, `Medium`, uppercase or title case.
- **Padding**: `px-2.5`, `py-0.5`.
- **Colors**:
    - *Success*: `bg-green-100` + `text-green-800`
    - *Warning*: `bg-yellow-100` + `text-yellow-800`
    - *Neutral*: `bg-gray-100` + `text-gray-800`

### Behavioral Rules
- **Static**: Not clickable.
- **Position**: Typically top-right of a Card or inline with a list item title.

## 4. Primary Button
**Purpose**: The single most important action on the screen (e.g., "Save", "Confirm Date").

### Visual Rules
- **Background**: `Primary` (`#2F6F6A`).
- **Text**: `White`, `Medium`.
- **Radius**: `full` (Pill shape).
- **Width**: Full width on mobile (`w-full`), auto width on desktop.
- **Height**: `48px` (Touch target friendly).

### Behavioral Rules
- **Placement**: Sticky at bottom on mobile (thumb zone), inline on desktop.
- **State**: Shows a spinner when loading. Disabled (`opacity-50`) if form is invalid.

## 5. Secondary Button
**Purpose**: Alternative actions (e.g., "Cancel", "Back", "Edit") that are less critical.

### Visual Rules
- **Background**: Transparent or `Surface` (White).
- **Border**: `1px` solid `neutral-300`.
- **Text**: `Text Primary` (`#1F2933`).
- **Radius**: `full`.
- **Height**: `48px`.

### Behavioral Rules
- **Visual Weight**: Must clearly look less important than the Primary Button.

## 6. Alert Box (Warning-Focused)
**Purpose**: To communicate non-blocking issues or helpful context (e.g., "This venue is over budget").

### Visual Rules
- **Background**: `Warning` wash (`#FEFCE8`).
- **Border**: `1px` solid `Warning` (`#EAB308`).
- **Icon**: `Warning` icon (outlined) in `text-yellow-600`.
- **Text**: `text-yellow-800`, `text-sm`.
- **Radius**: `md` (8px).

### Behavioral Rules
- **Persistence**: Dismissible if it's a one-time notice. Persistent if the condition remains true (e.g., Over budget).
- **Placement**: Near the relevant data, not global.

## 7. Empty State
**Purpose**: To guide the user when no data exists, transforming a "blank page" into an invitation.

### Visual Rules
- **Icon**: Large, neutral, outlined illustration (e.g., an empty clipboard).
- **Title**: `Text Primary`, `SemiBold`, `text-lg`. "No venues yet".
- **Body**: `Text Secondary`, `text-sm`. "Add your first venue to start comparing."
- **Action**: Primary Button ("Add Venue").

### Behavioral Rules
- **Tone**: Encouraging, not technical. Never "0 items found".
- **Center**: Vertically and horizontally centered in the available space.
