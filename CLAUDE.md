# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Hook & Hunt Storefront** — a premium fishing accessories e-commerce frontend deployed on **Vercel**.

This is a **completely separate project** from the Laravel API + Admin Panel (`hooknhunt-api/`). They are deployed independently, use different tech stacks, and must never share code, UI libraries, or translation files.

| | Storefront (this repo) | Admin Panel (hooknhunt-api) |
|---|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 | React 18 + Vite |
| **UI** | Pure React + Tailwind CSS | Mantine UI + Tailwind CSS |
| **Deployment** | Vercel | Shared hosting (cPanel) |
| **Routing** | Next.js App Router (`<Link>`) | React Router v7 |
| **Translations** | `src/locales/` | `resources/js/locales/` |

**NEVER**: Use Mantine UI here. Use `window.location.href` for navigation. Share translation files with the admin panel.

## 📘 Global Instructions

**MANDATORY**: Before starting ANY task, read: [instruction/storefront-global.md](instruction/storefront-global.md)

This master reference (version 1.0.0) covers 15 comprehensive sections:
1. **Naming Conventions** - File/folder naming, variables, functions, components, types, enums
2. **Code Structure** - Feature-based architecture, module independence, barrel exports
3. **State Management** - Zustand patterns, immutability, persist middleware, selectors
4. **API Integration** - Axios service layer, feature-based APIs, response types
5. **Error Handling** - Error types, handlers, display components, patterns
6. **Performance** - Server Components, code splitting, memoization, debouncing
7. **Security** - Input validation, XSS prevention, CSRF, token management
8. **No-Reload Patterns** - Client-side navigation, SWR, form handling
9. **Testing** - Component tests, E2E checklist
10. **i18n** - Translation organization, usage patterns
11. **Backend API** - Response formats, endpoint naming, pagination
12. **Git Standards** - Commit message format, types
13. **Pre-commit Checklist** - Type safety, performance, UX, security, i18n
14. **Code Review Checklist** - Quality, performance, security, testing
15. **Quick Reference** - Common patterns, component/hook/store templates

**Workflow for every task**:
1. **Understand & Clarify** — Read requirements, ask questions, confirm API fields
2. **Questions & Clarifications** — Verify module boundaries, get approval
3. **Plan with Todo List** — Break into sub-tasks, estimate, identify dependencies
4. **Validate Plan** — Review with team, check edge cases, verify performance
5. **Execute Step-by-Step** — Follow todo list, test each sub-task, commit frequently
6. **Code Review** — Self-review, check requirements, verify no regressions

## Commands

```bash
npm run dev       # Dev server with Turbopack
npm run build     # Production build with Turbopack (must pass before deploying)
npm run start     # Start production server
npm run lint      # ESLint
```

No test framework is configured yet.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4 — NO component libraries, NO inline styles
- **State**: Zustand for stores + React Context for Auth/Cart/Language/Theme
- **i18n**: react-i18next — Bengali (default `lng: 'bn'`), English fallback
- **Notifications**: `react-hot-toast`
- **Path alias**: `@/*` → `./src/*`

**Note**: Zod is referenced in instruction files as mandatory but is NOT currently installed. Install it before using: `npm install zod`.

## Provider Tree

The app's provider hierarchy in `layout.tsx` and `providers.tsx` is:

```
ErrorBoundary
  └── LanguageProvider (src/contexts/LanguageContext.tsx — wraps Providers)
        └── I18nextProvider
              └── ThemeProvider (src/contexts/ThemeContext.tsx — forced light mode)
                    └── AuthProvider (src/context/AuthContext.tsx)
                          └── CartProvider (src/context/CartContext.tsx)
                                └── {children}
```

**Context files are split across two directories**: `src/contexts/` (Language, Theme) and `src/context/` (Auth, Cart). Both are in use — don't assume one is unused.

## Architecture

```
src/
├── app/                    # Next.js App Router (file-based routing)
│   ├── layout.tsx          # Root layout
│   ├── providers.tsx       # Client providers wrapper
│   ├── page.tsx            # Home page
│   ├── account/            # Protected user account pages (guarded by middleware)
│   ├── admin/              # Admin dashboard pages
│   ├── checkout/           # Checkout flow
│   ├── products/[slug]/    # Product detail (dynamic route)
│   ├── hot-deals/          # Hot deals listing
│   ├── contact/            # Contact page
│   └── track-order/        # Order tracking
├── components/
│   ├── layout/             # Header, Footer, TopBar
│   ├── cart/               # CartSidebar, cart items
│   ├── product/            # ProductCard, ProductGallery
│   ├── common/             # Reusable UI (Button variants, Input, ErrorBoundary)
│   └── admin/              # Admin-only components
├── contexts/               # ThemeContext, LanguageContext
├── context/                # AuthContext, CartContext (legacy path — still in use)
├── lib/
│   ├── api.ts              # ApiClient class — singleton, JWT management via localStorage + cookies
│   └── i18n.ts             # i18next config, imports JSON from src/locales/
├── locales/                # Translation files: en/, bn/ (JSON per module)
├── types/                  # TypeScript interfaces: index.ts (Product, User, Cart, etc.), api.ts
├── stores/                 # Zustand stores (profileStore.ts)
├── data/                   # Static data
├── utils/                  # Utility functions
└── middleware.ts           # Next.js middleware — route protection via auth_token cookie
```

### Key Patterns

- **API Client** (`src/lib/api.ts`): Singleton `ApiClient` class. Base URL from `NEXT_PUBLIC_API_URL` env var (defaults to `http://192.168.0.166:8000/api/v2`). JWT token stored in both localStorage (`auth_token`) and a cookie (`auth_token`) — the cookie is needed by middleware. Auto-clears token on 401 responses. Token can come as either `access_token` or `token` from the API. All API endpoints are prefixed with `/store/` for customer-facing routes.
- **Auth flow**: Register → Send OTP → Verify OTP → JWT stored. Login → JWT stored. Password reset via OTP. Middleware reads `auth_token` cookie to protect `/account/*` routes (redirects to `/login?redirect=...`). Authenticated users visiting `/login` or `/register` get redirected to `/account`.
- **Cart**: Context-based with localStorage persistence. Variant-aware item merging. Immutable state updates. Stock-aware quantity limits.
- **Server Components**: Default for all pages. Only add `"use client"` when you need `useState`, `useEffect`, event handlers, or browser APIs.
- **Navigation**: Always use Next.js `<Link>` component. Never `window.location.href`.
- **i18n**: All user-facing text uses `t('key')` from `useTranslation()`. Translations are defined inline in `src/lib/i18n.ts` (hardcoded key-value pairs for common/auth/checkout/cart/footer/header/etc.) plus spread imports from JSON files in `src/locales/{en,bn}/` (inventory, sidebar, contact, trackOrder, hotDeals, productCard, product, products). When adding new translation keys, add to BOTH languages.

**Known i18n bug**: Line 4 of `src/lib/i18n.ts` imports `bnInventory` from `../locales/en/inventory.json` — should be `../locales/bn/inventory.json`. Bengali inventory translations are currently English.

## Middleware (`src/middleware.ts`)

- **Protected routes**: `/account/*` — requires `auth_token` cookie
- **Public routes**: `/login`, `/register`, `/forgot-password` — authenticated users redirected to `/account`
- Runs on all paths except `_next/static`, `_next/image`, `favicon.ico`, and static files (svg/png/jpg/etc.)
- Runs on Vercel Edge — avoid Node.js-specific APIs

## Types (`src/types/index.ts`)

Core interfaces: `User` (with optional `CustomerProfile`), `Address`, `Product` (extensive — display aliases + API fields), `ProductVariant`, `Category`, `CartItem`, `CartProduct`, `Order`. The `Product` type has many optional display fields (`name?`, `price?`, `image?`, `stock?`) that are aliases for API fields — these get populated when mapping API responses to UI components.

## Vercel Deployment Requirements

- **Build must pass**: `npm run build` must succeed with zero errors before pushing
- **Environment variables**: Set `NEXT_PUBLIC_API_URL` in Vercel dashboard pointing to production Laravel API
- **No hardcoded IPs**: The `192.168.0.166` IP is for local dev only — production uses env var
- **Image optimization**: Currently `unoptimized: true` for local dev. For Vercel production, consider enabling Next.js Image optimization and using proper image domains
- **Middleware**: Runs on Vercel Edge — avoid Node.js-specific APIs in `middleware.ts`
- **Server Components**: Preferred — they run on Vercel's edge/serverless infrastructure and reduce client JS
- **Static generation**: Prefer static pages where possible for best Vercel performance

## Coding Standards

These are mandatory. Follow them in every file you write or modify. Full details in `instruction/frontend.md` and `instruction/ux.md`.

### Type Safety (MANDATORY)
- **NO `any` types** — use proper TypeScript interfaces for all variables, parameters, and return types
- **Zod validation** for API response data — define schemas, infer types, parse at boundaries (must install zod first)
- **Immutable state updates** — always spread/create new objects, never mutate

### UX Engineering (MANDATORY)
1. **Optimistic UI updates**: Update UI instantly on user action, make API call in background, rollback on error. NO blocking spinners.
2. **Skeleton loading states**: Show shimmer/skeleton placeholders matching content structure. NO full-page loaders.
3. **Zero layout shift (CLS)**: Every image must have `aspect-ratio` or `min-height`. Never let content jump when images load.
4. **Micro-interactions**: Add subtle transitions (CSS transitions, scale on press, fade on mount). Premium feel.
5. **Error empathy**: Error messages must tell the user what to do. NEVER "An error occurred". Instead: "Your card has expired. Please use a different card."

### Mobile-First Design (MANDATORY)
- Mobile = baseline, desktop = enhancement
- Touch targets >= 44px minimum
- No hover-only states (mobile has no hover)
- Responsive data rendering: desktop = table view, mobile = card view (`hidden md:block` / `block md:hidden`)
- Typography scale: Body `text-sm md:text-base`, Section `text-base md:text-lg lg:text-xl`, Page title `text-lg md:text-xl lg:text-2xl`. Always pair with `leading-normal` or `leading-relaxed`

### Performance (MANDATORY)
- **Server Components by default** — only `"use client"` when interactivity is needed
- **Bundle budgets**: Initial JS < 200KB gzipped, route chunks < 100KB gzipped
- **Check bundlephobia.com** before adding any dependency
- **Lightweight alternatives**: `dayjs` (not `moment`), native methods (not `lodash`), `tailwindcss` JIT (not `bootstrap`)
- **Code splitting**: Use `dynamic()` imports for heavy client components

### i18n (MANDATORY)
- All user-facing text goes through `t('key')` from `react-i18next`
- Add translations to BOTH `src/locales/en/` and `src/locales/bn/`
- Bengali is the default language
- These translations are SEPARATE from the admin panel — never share them

### Code Quality
- Functions < 30 lines. If > 50 lines, break it down
- Components < 200 lines
- No `console.log` in production code
- Descriptive naming: `calculateTotalWithTax()` not `process()`, `userPermissions` not `data`
- Pure functions preferred: same input → same output, no side effects
- Boolean variables use `is/has/can/should` prefixes: `isLoading`, `hasError`
