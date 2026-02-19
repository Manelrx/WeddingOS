# Design Tokens

> **Purpose**: This document defines the IMMUTABLE design tokens for WeddingOS.
> Any deviation from these values must be approved by a formal redesign process.

## 1. Color Tokens

### Backgrounds & Surfaces
To maintain warmth and avoid clinical sterility.

- **Background**: `#FAFAF7`
    - *Role*: The global application background. A very warm off-white (eggshell).
- **Surface**: `#FFFFFF`
    - *Role*: Cards, modals, and elevated elements. Pure white to create contrast against the warm background.

### Brand & Action
- **Primary**: `#2F6F6A`
    - *Role*: The core brand color. A deep, elegant teal. Used for primary buttons, active states, and key brand elements.
    - *Mood*: Sophisticated, natural, calm.

### Text & Content
- **Text Primary**: `#1F2933`
    - *Role*: Headings, body text, and icons. A deep charcoal, never pure black (`#000000`).
- **Text Secondary**: `#6B7280`
    - *Role*: Metadata, captions, placeholders, and secondary icons.

### Semantic Status
- **Success**: `#4CAF50`
    - *Role*: Confirmation, completion, and positive states.
- **Warning**: `#EAB308`
    - *Role*: Attention required, non-blocking issues.
- **Danger**: `#DC2626`
    - *Role*: Destructive actions, errors, and critical alerts.

## 2. Typography Tokens

**Font Family**: `Inter`, sans-serif.

### Weights
- **Regular (400)**: Body text, secondary information.
- **Medium (500)**: Buttons, labels, subheadings.
- **SemiBold (600)**: Page titles, section headers, strong emphasis.

### Line Height Philosophy
- **Headings**: Tight (`1.2`). Headings should feel compact and sturdy.
- **Body**: Loose (`1.5` or `1.6`). To maximize readability and calmness, especially on mobile.

## 3. Spacing Tokens

Based on an **8px** scale.

- **xs**: `4px` (0.25rem) - Internal component spacing.
- **sm**: `8px` (0.5rem) - Tighter grouping.
- **md**: `16px` (1rem) - Standard gap between related elements.
- **lg**: `24px` (1.5rem) - Section separation.
- **xl**: `32px` (2rem) - Major layout divisions.

## 4. Border Radius Tokens

- **sm**: `4px`
    - *Usage*: Small interactive elements (checkboxes, tags, badges).
- **md**: `8px`
    - *Usage*: Buttons, inputs, small cards, tooltips.
- **lg**: `16px`
    - *Usage*: Standard content cards, modals, bottom sheets.
    - *Note*: Larger radius feels friendlier and more organic.

## 5. Iconography Rules

- **Style**: **Outline** only.
    - *Rationale*: Outline icons feel lighter and more elegant than filled icons.
- **Stroke Width**: `1.5px` or `2px`. Consistent stroke weight is critical.
- **No Filled Icons**: Except for specific UI states like a "toggled on" star or heart.
- **Color**: Icons should generally match `Text Primary` or `Text Secondary` unless they are interactive (Primary) or semantic (Success/Danger).
