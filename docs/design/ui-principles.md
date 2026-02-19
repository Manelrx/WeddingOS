# UI Principles: The WeddingOS UX Playbook

> **Purpose**: This document defines the cognitive and emotional rules of WeddingOS.
> It is a guide for how the system should *behave* and *communicate* with the couple.

## 1. UX Goals

### Reduce Anxiety
Every screen, transition, and interaction must be designed to lower the user's blood pressure.
- **Single Focus**: Do not clutter the screen with competing calls to action.
- **Clear Next Steps**: The user should never wonder "What do I do now?".
- **Save Automatically**: Fear of losing work is a major anxiety trigger. Autosave everything.

### Support Conversation
Wedding planning is a dialogue between two people. The UI is the moderator.
- **"Discuss" over "Decide"**: Prompt the couple to talk before they click.
- **Shared Context**: Ensure both partners see the same information in the same way.
- **Neutral Ground**: The system takes no sides; it presents facts.

### Avoid Cognitive Overload
Decision fatigue is the enemy.
- **Chunking**: Break complex tasks into small, digestible steps.
- **Progressive Disclosure**: Show only what is necessary for the current decision.

## 2. Information Hierarchy

### Summary First
Always present the high-level picture before diving into weeds.
- **Dashboard**: Shows status, budget health, and next big task.
- **Lists**: Show key differentiators (Price, Location, Capacity) first.

### Details on Demand
- **Expandable Cards**: Hidden details should be one tap away, but not visible by default.
- **Modals**: Use for deep dives into specific topics without losing context of the parent screen.

### Never Show Everything at Once
- **Maximum 3-5 items** in a comparison view.
- **Paginate or Lazily Load** long lists, but prefer strict curation/filtering over infinite scroll.

## 3. Decision Support Rules

### The "No-Go" Zone (Strict Prohibitions)
To maintain trust and neutrality:
1.  **Never Auto-Select**: The system never chooses a vendor or option for the user. Defaults are suggestions, not decisions.
2.  **Never Score Vendors**: We do not give vendors a "9/10" or "5 stars". Quality is subjective to the couple's taste.
3.  **Never Rank Proposals**: Do not order proposals by "Best Match". Order by price, name, or date only.

### Context over Conclusion
- **Always Show Reasoning**: If highlighting an item, explain *why* (e.g., "Fits your budget", "Has your preferred date").
- **Pros & Cons**: Present trade-offs clearly. "Cheaper, but further away" is better than just showing the price.

## 4. Status Semantics

How we communicate the state of an item matters deeply.

- **`included`**:
    - *Emotion*: Peace of Mind. "It's handled."
    - *Visual*: Green check, solid opacity.
- **`not_included`**:
    - *Emotion*: Clarity. "Be aware, you need to add this."
    - *Visual*: Neutral text, perhaps an info icon. **Never red or alarming.**
    - *Context*: It's okay if something isn't included, as long as the couple knows.
- **`not_informed`**:
    - *Emotion*: Curiosity. "We should ask about this."
    - *Visual*: Dashed line, question mark, or empty state. Invites the user to investigate.

## 5. Error vs. Warning

### Errors are Rare & Technical
- **Definition**: System failure (500), Network down, Data corruption.
- **Tone**: Apologetic. "We messed up."
- **Action**: Retry or Contact Support.

### Warnings are Common & Calm
- **Definition**: Budget exceeded, Date conflict, Missing critical info.
- **Tone**: Advisory. "Just so you know..."
- **Visual**: Amber/Orange. Never Red.
- **Philosophy**: A budget overrun is a choice, not an error. The user is allowed to break their budget. We just warn them.

## 6. Language Guidelines

### Human & Conversational
- Write as if you are a calm, experienced wedding planner talking to a friend.
- **Bad**: "Input validation failed."
- **Good**: "We need a valid date to check availability."

### Calm
- Avoid exclamation marks (!) unless celebrating a major milestone.
- Use simple sentence structures.

### Never Alarming
- Avoid words like "Critical", "Fatal", "Illegal", "Forbidden".
- Use "Review", "Check", "Update".

### No Technical Jargon
- The user is getting married, not deploying software.
- **No**: "Database", "Latency", "Auth Token".
- **Yes**: "Connection", "Speed", "Login".
