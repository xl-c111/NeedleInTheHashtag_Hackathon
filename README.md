# 🚀 Luma - Modern SaaS Landing Page Template

A stunning, production-ready Next.js 16 template for building modern SaaS landing pages. Features a clean, minimal design with smooth animations, dark mode support, and best-in-class developer experience.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎨 Design & UI

-   **Modern, minimalist design** with attention to detail
-   **Dark mode support** with seamless theme switching
-   **Fully responsive** - mobile-first approach
-   **Smooth animations** powered by Motion
-   **Accessible components** following WCAG guidelines
-   **Beautiful typography** using Geist font family

### 🧩 Pre-built Sections

-   **Hero Section** - Eye-catching hero with CTAs and social proof
-   **Feature Section** - Showcase your product features
-   **Pricing Section** - Flexible pricing tiers display
-   **FAQ Section** - Common questions and answers
-   **Blog Page** - Ready-to-use blog layout
-   **Login Page** - Authentication page template

### 🛠️ Developer Experience

-   **TypeScript** - Full type safety throughout
-   **Biome** - Lightning-fast linting and formatting (replaces ESLint + Prettier)
-   **Ultracite** - Enforces strict code quality and accessibility standards
-   **Turbopack** - Ultra-fast development with Next.js 15
-   **Component Library** - Shadcn/ui-inspired components with Radix UI
-   **Icon System** - Lucide React icons + custom AI provider icons

### 🚄 Performance

-   **Next.js 15** with App Router
-   **React 19** with latest optimizations
-   **Optimized fonts** with next/font
-   **Modern build system** for fast loading times

## 📋 Tech Stack

| Category        | Technology                   |
| --------------- | ---------------------------- |
| Framework       | Next.js 15                   |
| Language        | TypeScript 5                 |
| Styling         | Tailwind CSS v4              |
| UI Components   | Radix UI, Shadcn/ui patterns |
| Icons           | Lucide React                 |
| Animations      | Motion 12                    |
| Theme           | next-themes                  |
| Charts          | Recharts                     |
| Linting         | Biome + Ultracite            |
| Package Manager | npm/yarn/bun                 |

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+ or Bun
-   npm, yarn, or bun

### Installation

1. **Unzip the template**

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
bun install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Linting & Code Quality

```bash
# Run Next.js linter
npm run lint

# Format and fix with Biome (recommended)
npx ultracite fix

# Check for issues without fixing
npx ultracite check
```

## 📁 Project Structure

```
template-luma/
├── app/                          # Next.js 15 App Router
│   ├── blog/                     # Blog page
│   ├── login/                    # Login page
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page
│   ├── not-found.tsx            # 404 page
│   ├── globals.css              # Global styles & Tailwind config
│   └── robots.txt               # SEO configuration
├── components/                   # React components
│   ├── Header.tsx               # Navigation header
│   ├── HeroSection.tsx          # Hero section
│   ├── Feature.tsx              # Features section
│   ├── PricingSection.tsx       # Pricing section
│   ├── FAQSection.tsx           # FAQ section
│   ├── footer.tsx               # Footer component
│   ├── icons/                   # Custom icon components
│   │   ├── anthropic.tsx
│   │   ├── open-ai.tsx
│   │   └── ...
│   └── ui/                      # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── config/                       # Configuration files
│   └── site.ts                  # Site metadata & SEO
├── lib/                         # Utilities
│   ├── theme-toggle.tsx         # Theme switcher component
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
├── biome.jsonc                  # Biome configuration
├── tailwind.config.ts           # Tailwind v4 configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🎨 Customization Guide

### 1. Update Site Configuration

Edit `config/site.ts` to customize your site metadata:

```typescript
export const siteConfig = {
    name: "Your SaaS Name",
    url: "https://yourdomain.com",
    ogImage: "https://yourdomain.com/og.jpg",
    description: "Your product description",
    links: {
        twitter: "https://twitter.com/yourhandle",
    },
};
```

### 2. Customize Theme Colors

Edit the CSS variables in `app/globals.css`:

```css
@theme {
    --color-primary: /* your color */ ;
    --radius-lg: /* your radius */ ;
    /* ... other variables */
}
```

### 3. Modify Sections

Each section is a standalone component in the `components/` directory:

-   **Hero Section**: Edit `components/HeroSection.tsx`
-   **Features**: Edit `components/Feature.tsx`
-   **Pricing**: Edit `components/PricingSection.tsx`
-   **FAQ**: Edit `components/FAQSection.tsx`

### 4. Add New Pages

Create new pages in the `app/` directory following Next.js App Router conventions:

```typescript
// app/about/page.tsx
export default function AboutPage() {
    return <div>About Us</div>;
}
```

### 5. Customize Components

All UI components are in `components/ui/` and follow the Shadcn/ui pattern. Modify them directly or add new variants using `class-variance-authority`.

## 🎯 Tailwind CSS v4 Guidelines

This template uses **Tailwind CSS v4** (not v3). Key differences:

### Opacity Syntax

```tsx
// ✅ v4 (correct)
<div className="bg-black/15" />

// ❌ v3 (incorrect)
<div className="bg-black bg-opacity-15" />
```

### Configuration

-   Uses `@theme` directive in CSS instead of `tailwind.config.js`
-   Import with `@import 'tailwindcss'` (not `@tailwind` directives)
-   Custom variants with `@custom-variant`

### Dark Mode

```tsx
// Always include dark mode variants
<div className="text-black dark:text-white" />
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Other Platforms

-   **Netlify**: Works out of the box
-   **Railway**: Full Next.js support
-   **Docker**: Standard Next.js Dockerfile

```bash
# Build for production
npm run build

# The build output is in .next/
```

## 🔧 Environment Variables

Create a `.env.local` file for environment variables:

```env
# Example variables
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📝 Code Quality

This template enforces strict code quality standards using:

-   **Biome**: Fast linting and formatting
-   **Ultracite**: Type safety and accessibility rules
-   **TypeScript**: Strict mode enabled
-   **Pre-configured rules**: See `biome.jsonc` and workspace rules

### Running Checks

```bash
# Format and fix all issues
npx ultracite fix

# Check without fixing
npx ultracite check

# Type checking
npx tsc --noEmit
```

## 🎓 Learning Resources

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Tailwind CSS v4 Beta](https://tailwindcss.com/docs/v4-beta)
-   [Motion Documentation](https://motion.dev/)
-   [Radix UI](https://www.radix-ui.com/)
-   [Biome Documentation](https://biomejs.dev/)

## 📄 License

This template is available under the MIT License. Feel free to use it for personal and commercial projects.

## 🙏 Support

-   **Website**: [kokonutui.pro](https://kokonutui.pro)
-   **Email**: hi@kokonutui.pro
-   **Issues**: Report bugs via GitHub Issues

## 🌟 Credits

Built with ❤️ by the KokoPro team.

---

**Happy coding!** If you find this template useful, please consider giving it a ⭐️
