# Component Reference

## Layout Components

### Header (`components/Header/`)

Main site navigation with desktop/mobile support and theme toggle.

**Files:**
- `index.tsx` - Main Header component
- `DesktopNavigation.tsx` - Desktop nav with dropdowns
- `MobileNav.tsx` - Mobile hamburger menu
- `MobileMenuButton.tsx` - Hamburger toggle button
- `Logo.tsx` - Site logo component
- `HeaderActions.tsx` - Right-side actions (theme, CTAs)
- `NavigationItem.tsx` - Individual nav item
- `NavigationData.ts` - Navigation links configuration
- `DropdownTrigger.tsx` - Dropdown trigger element
- `DropdownContent.tsx` - Dropdown menu content
- `CTAButtons.tsx` - Call-to-action buttons
- `ScrollHandler.tsx` - Scroll behavior manager

**Usage:**
```tsx
import Header from "@/components/Header";

<Header />
```

### Footer (`components/footer.tsx`)

Site footer with navigation, crisis resources, and copyright.

**Usage:**
```tsx
import { Footer } from "@/components/footer";

<Footer />
```

---

## Section Components

### HeroSection (`components/HeroSection/`)

Landing page hero with headline, CTAs, and trust indicators.

**Files:**
- `index.tsx` - Main component
- `HeroContent.tsx` - Headline and description
- `HeroImage.tsx` - Hero visual/video
- `SignInOptions.tsx` - CTA buttons
- `TrustIndicators.tsx` - Social proof badges

**Usage:**
```tsx
import HeroSection from "@/components/HeroSection";

<HeroSection />
```

### Feature (`components/Feature/`)

Feature showcase section with cards and images.

**Files:**
- `index.tsx` - Main component
- `FeatureHeader.tsx` - Section heading
- `FeatureList.tsx` - Features grid
- `FeatureItem.tsx` - Individual feature card
- `FeatureImage.tsx` - Feature image/video
- `FeatureData.ts` - Features configuration

**Configuration (`FeatureData.ts`):**
```ts
export const features = [
  {
    title: "Feature Title",
    description: "Feature description",
    video: "/path-to-video.mp4",
    alt: "Alt text",
  },
];
```

**Usage:**
```tsx
import Feature from "@/components/Feature";

<Feature />
```

### FAQSection (`components/FAQSection/`)

FAQ accordion section.

**Files:**
- `index.tsx` - Main component
- `FAQHeader.tsx` - Section heading
- `FAQList.tsx` - FAQ list container
- `FAQItem.tsx` - Individual FAQ item
- `Accordion.tsx` - Accordion logic
- `FAQData.ts` - Questions and answers

**Configuration (`FAQData.ts`):**
```ts
export const faqs = [
  {
    question: "Question text?",
    answer: "Answer text.",
  },
];
```

**Usage:**
```tsx
import FAQSection from "@/components/FAQSection";

<FAQSection />
```

### PricingSection (`components/PricingSection/`)

Pricing tiers display.

**Files:**
- `index.tsx` - Main component
- `PricingHeader.tsx` - Section heading
- `PricingGrid.tsx` - Pricing cards layout
- `PricingCard.tsx` - Individual pricing card
- `PricingFooter.tsx` - Footer CTA
- `PricingData.ts` - Pricing tiers configuration

**Usage:**
```tsx
import PricingSection from "@/components/PricingSection";

<PricingSection />
```

---

## UI Components (`components/ui/`)

shadcn/ui-based reusable components.

### Button

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// With icon
<Button>
  <MessageCircle className="h-4 w-4" />
  Start talking
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</div>
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Navigation Menu

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Features</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/feature-1">Feature 1</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

## Icon Components (`components/icons/`)

SVG icon components for various uses.

### Logo

```tsx
import { Logo } from "@/components/icons/logo";

<Logo className="h-8 w-8" />
```

### AI Provider Icons

```tsx
import { AnthropicIcon } from "@/components/icons/anthropic";
import { AnthropicDarkIcon } from "@/components/icons/anthropic-dark";
import { OpenAIIcon } from "@/components/icons/open-ai";
import { GeminiIcon } from "@/components/icons/gemini";
import { MistralIcon } from "@/components/icons/mistral";
import { DeepSeekIcon } from "@/components/icons/deepseek";
import { GrokIcon } from "@/components/icons/grok";
import { ClaudeIcon } from "@/components/icons/claude";
```

### Utility Icons

```tsx
import { ArrowRightBroken } from "@/components/icons/arrow-right-broken";
import { CircleTheme } from "@/components/icons/circle-theme";
import { Compass } from "@/components/icons/compass";
import { Confetti } from "@/components/icons/conffeti";
import { Checkout } from "@/components/icons/checkout";
import { ScreenOutline } from "@/components/icons/screen-outline";
```

---

## Creating New Section Components

### Template

```tsx
// components/NewSection/index.tsx
"use client"; // Only if using hooks or interactivity

import { items } from "./NewSectionData";

export default function NewSection() {
  return (
    <section
      id="new-section"
      className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight text-black dark:text-white">
          Section Title
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-black/60 dark:text-white/60">
          Section description text goes here.
        </p>
      </div>

      {/* Section Content */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-black/10 p-6 dark:border-white/10"
          >
            <h3 className="font-medium text-lg tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2 text-black/60 dark:text-white/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

```ts
// components/NewSection/NewSectionData.ts
export interface Item {
  id: string;
  title: string;
  description: string;
}

export const items: Item[] = [
  {
    id: "1",
    title: "Item One",
    description: "Description for item one.",
  },
  {
    id: "2",
    title: "Item Two",
    description: "Description for item two.",
  },
];
```

---

## Animation Patterns

### Using Motion

```tsx
"use client";

import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

### Scroll-triggered Animation

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Animates when scrolled into view
</motion.div>
```

### Staggered Children

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.title}
    </motion.div>
  ))}
</motion.div>
```

---

## Styling Conventions

### Spacing

```tsx
// Section padding
className="py-16 sm:py-24"

// Container max-width
className="mx-auto max-w-7xl px-4 sm:px-6"

// Component gaps
className="gap-4 sm:gap-6"
```

### Typography

```tsx
// Large headings
className="font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight"

// Subheadings
className="font-medium text-lg tracking-tight"

// Body text
className="text-black/60 dark:text-white/60 leading-relaxed"
```

### Colors

```tsx
// Primary text
className="text-black dark:text-white"

// Muted text
className="text-black/60 dark:text-white/60"

// Borders
className="border-black/10 dark:border-white/10"

// Backgrounds
className="bg-black/5 dark:bg-white/5"
```

### Interactive States

```tsx
// Hover background
className="hover:bg-black/10 dark:hover:bg-white/10"

// Hover text
className="hover:text-black dark:hover:text-white"

// Transitions
className="transition-colors duration-200"
className="transition-all duration-300"
```
