# Hook & Hunt — Project Status Overview

**Date**: 2025-06-02  
**Projects**: hooknhunt-ui (Storefront) + hooknhunt-api (Admin Panel)

---

## 🎯 Executive Summary

Both projects are in **healthy, buildable state** with recent active development. The storefront was recently redesigned and the admin panel has undergone a module system rearchitecture.

### Build Status
| Project | Build | Deploy | Git Status |
|---------|-------|--------|------------|
| **Storefront** (hooknhunt-ui) | ✅ Pass | Vercel | Clean (up to date) |
| **Admin Panel** (hooknhunt-api) | ✅ Pass | Shared Hosting | 2 commits ahead + uncommitted changes |

---

## 📦 Project 1: Storefront (hooknhunt-ui)

### Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 3.4 (no component libraries)
- **State**: Zustand stores + React Context (Auth/Cart/Language/Theme)
- **i18n**: react-i18next (Bengali default, English fallback)
- **Deploy**: Vercel (Turbopack enabled)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── providers.tsx       # Client providers wrapper
│   ├── account/            # Protected user account pages
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
│   └── common/             # Reusable UI components
├── contexts/               # ThemeContext, LanguageContext
├── context/                # AuthContext, CartContext (legacy path)
├── lib/
│   ├── api.ts              # ApiClient class (JWT + localStorage + cookies)
│   └── i18n.ts             # i18next config
├── locales/                # Translation files: en/, bn/
├── types/                  # TypeScript interfaces
├── stores/                 # Zustand stores
└── middleware.ts           # Next.js middleware (route protection)
```

### Recent Work
- Website redesign completed
- TypeScript errors fixed for production build
- New API endpoints integrated
- Local configuration updated

### Git Status
- Branch: `master`
- Status: Clean (up to date with origin)
- Latest: `49f458d4` - "new api added"

### Known Issues / TODOs
- ⚠️ **i18n bug**: Line 4 of `src/lib/i18n.ts` imports `bnInventory` from `../locales/en/inventory.json` — should be `../locales/bn/inventory.json`
- Note: Zod is referenced in instruction files but NOT installed

---

## 📦 Project 2: Admin Panel (hooknhunt-api)

### Tech Stack
- **Backend**: Laravel (PHP)
- **Frontend**: React 18 + Vite 7
- **UI Library**: Mantine UI 8 + Tailwind CSS 4
- **Routing**: React Router v7
- **State**: Zustand stores
- **Deploy**: Shared hosting (cPanel)

### Project Structure
```
resources/js/
├── app/
│   ├── admin/
│   │   ├── catalog/        # Products, coupons, categories
│   │   ├── crm/            # Customers, leads, wallet
│   │   ├── hrm/            # Staff, attendance, payroll, roles
│   │   ├── marketing/      # Affiliates, commissions, payouts
│   │   ├── procurement/    # Procurement orders
│   │   ├── settings/       # Payments, permissions, users
│   │   └── dashboard/      # Main dashboard
│   └── ...
├── components/             # Reusable components (Mantine-based)
├── modules/                # Module-based architecture
│   ├── catalog/
│   ├── cms/
│   ├── procurement/
│   └── website/
├── stores/                 # Zustand stores
├── utils/                  # Utility functions
└── main.tsx                # Entry point
```

### Recent Work
- **Module system rearchitecture** — moved to feature-based structure
- **Role permissions fix** — loading role.permissions in auth endpoints
- **Product edit updates** — improved editing functionality
- **EPS payment fixed**
- **Lazychat issue resolved**
- **Query optimization**

### Git Status
- Branch: `master`
- **2 commits ahead of origin** (needs push)
- **Uncommitted changes**:
  - Modified: `app/Http/Controllers/Api/V2/AuthController.php`
  - Modified: `resources/js/components/app-sidebar-mantine.tsx`
  - Deleted: `BACKEND_DEVELOPMENT_GLOBAL_STANDARDS.md`
  - Deleted: `modules_statuses.json`

### Pending Changes Details

#### AuthController.php
Added new endpoints:
- `profile()` — Get authenticated user with permissions
- `updateProfile()` — Update user profile
- `changePassword()` — Change user password

#### app-sidebar-mantine.tsx
Added debug logging and permission checking fixes:
- Console logs for troubleshooting permission issues
- Fixed permission checking for affiliates menu
- Improved URL matching for active state

### Build Status
- ✅ Build passes
- ⚠️ Chunk size warning: main bundle is 2.6MB (gzip: 566KB)
  - Recommendation: Use dynamic imports for code splitting
- ✅ PWA manifests generated

---

## 🚀 Deployment & Environment

### Storefront (Vercel)
- **API URL**: `https://hooknhunt-api.test/api/v2` (local env)
- **Production**: Set `NEXT_PUBLIC_API_URL` in Vercel dashboard
- **Middleware**: Runs on Vercel Edge

### Admin Panel (Shared Hosting)
- **URL**: `https://hooknhunt-api.test`
- **Environment**: Local
- **Database**: MySQL (localhost:3306)

---

## 📋 Parallel Work Items

Both projects are ready for parallel development. Consider these work streams:

### Storefront Priorities
1. Fix i18n bug (`bnInventory` import path)
2. Install Zod for API validation (referenced in docs but not installed)
3. Optimize bundle size if needed
4. Continue feature development

### Admin Panel Priorities
1. **Commit or rollback pending AuthController changes** — new endpoints ready?
2. **Remove debug logging from sidebar** before production
3. **Push 2 pending commits** to origin
4. **Optimize bundle size** — main bundle is 2.6MB
5. Consider code splitting with dynamic imports

### Integration Points
Both projects share:
- Same Laravel backend API (`/api/v2/*`)
- Translation structure (but separate files — never share)
- Same JWT authentication flow
- Same database

---

## 🛠️ Quick Commands

### Storefront
```bash
cd /Users/jakareaparvez/Sites/hooknhunt-ui
npm run dev       # Dev server with Turbopack
npm run build     # Production build
npm run lint      # ESLint
```

### Admin Panel
```bash
cd /Users/jakareaparvez/Sites/hooknhunt-api
npm run dev       # Vite dev server
npm run build     # Production build
git push          # Push 2 pending commits
```

---

## 📌 Notes

- **NEVER share code, UI libraries, or translations between projects**
- **Storefront uses pure React + Tailwind — NO Mantine**
- **Admin Panel uses Mantine UI + Tailwind**
- Both use Zustand for state management
- Both support Bengali (bn) and English (en) translations

---
