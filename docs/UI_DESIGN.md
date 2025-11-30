# UI Design System - Kokonut UI Pro

> **MANDATORY:** All UI components MUST follow these guidelines. NO generic AI designs. NO gradient colors.

## Quick Reference

Before building ANY component:
1. Read this file
2. Invoke `Skill: kokonut-ui-pro`
3. Search kokonutui.pro for relevant components
4. Adapt their patterns exactly

---

## Core Principles

### What We DO
- Clean, minimal borders
- Subtle backgrounds
- Sharp typography with tight tracking
- Purposeful whitespace
- Refined hover states
- Professional, sophisticated aesthetic

### What We DON'T
- Gradient backgrounds
- Flashy colors or effects
- Generic Tailwind defaults
- AI-looking generic designs
- Over-decorated elements
- Excessive shadows or glows

---

## Color Tokens

### Text Colors
```tsx
// Primary text
className="text-black dark:text-white"

// Secondary/muted text
className="text-black/60 dark:text-white/60"

// Tertiary/subtle text
className="text-black/40 dark:text-white/40"
```

### Background Colors
```tsx
// Subtle backgrounds
className="bg-black/5 dark:bg-white/5"

// Slightly stronger backgrounds
className="bg-black/10 dark:bg-white/10"

// Page background (use sparingly)
className="bg-white dark:bg-black"
```

### Border Colors
```tsx
// Subtle borders
className="border-black/10 dark:border-white/10"

// Stronger borders (focus states)
className="border-black/20 dark:border-white/20"
```

---

## Typography

### Headings
```tsx
// Page title (H1)
className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight"

// Section title (H2)
className="font-semibold text-2xl sm:text-3xl tracking-tight"

// Subsection (H3)
className="font-medium text-lg sm:text-xl tracking-tight"

// Card title
className="font-medium text-base tracking-tight"
```

### Body Text
```tsx
// Regular body
className="text-base leading-relaxed"

// Small text
className="text-sm leading-relaxed"

// Caption/helper text
className="text-xs text-black/50 dark:text-white/50"
```

### Key Rule
Always use `tracking-tight` or `tracking-tighter` on headings.

---

## Spacing

### Section Padding
```tsx
className="py-16 sm:py-24"
```

### Container
```tsx
className="mx-auto max-w-7xl px-4 sm:px-6"
```

### Component Gaps
```tsx
// Between cards
className="gap-4 sm:gap-6"

// Between elements in a card
className="space-y-3"
```

---

## Components

### Cards
```tsx
<div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-6">
  <h3 className="font-medium text-base tracking-tight text-black dark:text-white">
    Card Title
  </h3>
  <p className="mt-2 text-sm text-black/60 dark:text-white/60">
    Card description
  </p>
</div>
```

### Buttons - Primary
```tsx
<button className="inline-flex items-center justify-center rounded-lg bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black transition-opacity hover:opacity-90">
  Button Text
</button>
```

### Buttons - Secondary/Outline
```tsx
<button className="inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5">
  Button Text
</button>
```

### Buttons - Ghost
```tsx
<button className="inline-flex items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-black/60 dark:text-white/60 transition-colors hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5">
  Button Text
</button>
```

### Input Fields
```tsx
<input
  type="text"
  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:border-black/20 dark:focus:border-white/20 focus:outline-none transition-colors"
  placeholder="Enter text..."
/>
```

### Tags/Chips
```tsx
<span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-medium text-black/70 dark:text-white/70">
  Tag Name
</span>
```

---

## Hover States

### Background Hover
```tsx
className="hover:bg-black/5 dark:hover:bg-white/5"
```

### Border Hover
```tsx
className="hover:border-black/20 dark:hover:border-white/20"
```

### Scale Hover (cards only)
```tsx
className="transition-transform hover:scale-[1.02]"
```

### Opacity Hover
```tsx
className="transition-opacity hover:opacity-90"
```

---

## Animations (Motion)

### Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

### Slide Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Stagger Children
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
    />
  ))}
</motion.div>
```

---

## Chat-Specific Components

### Message Bubble - User
```tsx
<div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-black dark:bg-white px-4 py-3">
  <p className="text-sm text-white dark:text-black">
    User message here
  </p>
</div>
```

### Message Bubble - Assistant
```tsx
<div className="mr-auto max-w-[80%] rounded-2xl rounded-bl-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3">
  <p className="text-sm text-black dark:text-white">
    Assistant message here
  </p>
</div>
```

### Chat Input Area
```tsx
<div className="flex items-center gap-3 border-t border-black/10 dark:border-white/10 bg-white dark:bg-black p-4">
  <input
    type="text"
    className="flex-1 rounded-full border border-black/10 dark:border-white/10 bg-transparent px-4 py-2 text-sm focus:outline-none focus:border-black/20 dark:focus:border-white/20"
    placeholder="Type a message..."
  />
  <button className="rounded-full bg-black dark:bg-white p-2 text-white dark:text-black">
    <SendIcon className="h-5 w-5" />
  </button>
</div>
```

---

## Story Card Component

```tsx
<div className="group rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-6 transition-all hover:border-black/20 dark:hover:border-white/20 hover:shadow-sm">
  {/* Tags */}
  <div className="flex flex-wrap gap-2 mb-4">
    {tags.map((tag) => (
      <span key={tag} className="rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-medium text-black/60 dark:text-white/60">
        {tag}
      </span>
    ))}
  </div>

  {/* Title */}
  <h3 className="font-medium text-lg tracking-tight text-black dark:text-white">
    {title}
  </h3>

  {/* Excerpt */}
  <p className="mt-2 text-sm text-black/60 dark:text-white/60 line-clamp-3">
    {excerpt}
  </p>

  {/* Meta */}
  <div className="mt-4 flex items-center justify-between text-xs text-black/40 dark:text-white/40">
    <span>{author}</span>
    <span>{readTime} min read</span>
  </div>
</div>
```

---

## Checklist Before Committing UI

- [ ] No gradient backgrounds
- [ ] No flashy/bright colors
- [ ] Using `tracking-tight` on headings
- [ ] Using opacity-based colors (`text-black/60` not `text-gray-600`)
- [ ] Borders are subtle (`border-black/10`)
- [ ] Hover states are refined, not dramatic
- [ ] Dark mode works correctly
- [ ] Mobile responsive
- [ ] Animations are subtle (0.2-0.3s duration)

---

## Resources

- **Kokonut UI Pro:** https://kokonutui.pro
- **Skill:** `kokonut-ui-pro` (invoke before building)
- **Icons:** Lucide React (clean, minimal)
- **Motion:** motion/react (subtle animations)
