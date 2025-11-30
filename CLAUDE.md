# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 template for a landing page showcasing AI-powered eyewear. It's built with modern technologies including React 19, TypeScript, and Tailwind CSS v4.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (uses Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Development server runs at http://localhost:3000

## Architecture

### Page Structure

The application follows a simple single-page layout pattern:
- **app/page.tsx**: Main entry point that composes the landing page from section components
- **app/layout.tsx**: Root layout with metadata, fonts (Geist), and ThemeProvider configuration

### Component Organization

Landing page sections (in render order):
1. `Header` - Fixed navigation with centered menu items, theme toggle, auth buttons
2. `HeroSection` - Centered hero with headline, CTA buttons, and AI provider icons
3. `Feature` - Feature showcase section
4. `PricingSection` - Pricing tiers and plans
5. `FAQSection` - Frequently asked questions
6. `Footer` - Site footer

**UI Components** (`components/ui/`):
- shadcn/ui-based components (Button, Card, Chart)
- Follow Radix UI patterns with class-variance-authority for variants

**Icons** (`components/icons/`):
- AI provider icons (Anthropic, OpenAI, DeepSeek, Gemini, Mistral)
- Available in light/dark variants

### Theme System

Uses `next-themes` for dark mode support:
- Theme provider in `app/layout.tsx`
- Custom dark variant in `app/globals.css`: `@custom-variant dark (&:is(.dark *))`
- Theme toggle in Header component
- Color scheme follows HSL-based design tokens (see globals.css)

### Configuration

**Site Config** (`config/site.ts`):
- Site metadata (name, URL, description)
- Used in layout.tsx for SEO metadata
- Contains social links and OG image configuration

## Tailwind CSS v4 Specific Guidelines

This project uses **Tailwind CSS v4** (not v3). Key differences:

### Configuration
- CSS-first configuration using `@theme` directive in `app/globals.css`
- Import syntax: `@import 'tailwindcss'` (not `@tailwind` directives)
- PostCSS plugin: `@tailwindcss/postcss`
- Custom variants use `@custom-variant` (see dark mode variant)

### Breaking Changes from v3
- **Opacity syntax**: Use `bg-black/15` (not `bg-opacity-15`)
- **Shadow sizes**: `shadow-xs` (was `shadow-sm`), `shadow-sm` (was `shadow`)
- **Border color**: Default is `currentColor` (compatibility layer added in globals.css)
- **Tracking**: Use `tracking-[-0.04em]` for custom letter-spacing

### Design System
- Custom color tokens defined via CSS variables in `:root` and `.dark`
- Radius system: `--radius-lg`, `--radius-md`, `--radius-sm`
- Chart colors: `--chart-1` through `--chart-5`

## Styling Conventions

- **Tight tracking**: Components use `tracking-tighter` or `tracking-[-0.04em]` for condensed text
- **Hover states**: Use `hover:bg-black/15 dark:hover:bg-white/15` pattern for subtle hover effects
- **Rounded corners**: Consistently use `rounded-lg` for buttons and interactive elements
- **Theme-aware colors**: Always provide dark mode variants (e.g., `text-black dark:text-white`)

## Component Patterns

### Header Navigation
- Centered navigation using absolute positioning: `absolute left-1/2 transform -translate-x-1/2`
- Rectangle backgrounds on hover (not color changes)
- Consistent hover pattern across nav items and buttons

### Buttons
- Primary: `bg-black dark:bg-white` with inverse text colors
- Ghost: `variant="ghost"` with `hover:bg-black/15 dark:hover:bg-white/15`
- Icons use Lucide React (`lucide-react` package)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg (standard Tailwind)
- Mobile menu toggle in Header for navigation

## Technology Stack

- **Framework**: Next.js 15.2.1 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.0.7
- **Animations**: Motion (12.0.5), tailwindcss-animate
- **UI Library**: Radix UI (via shadcn/ui patterns)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Fonts**: Geist (Google Fonts)
