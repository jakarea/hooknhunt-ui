# Affiliate System Investigation Report

**Date:** 2025-06-13  
**Location:** `/Users/jakareaparvez/Sites/hooknhunt-ui/src/app/account/affiliate/page.tsx`

## Executive Summary

The affiliate system has a **fully functional backend API** with comprehensive endpoints, but the **customer-facing UI is completely static** with hardcoded mock data. The admin panel appears to be missing affiliate management functionality entirely.

---

## 1. Backend API Status ✅ **COMPLETE**

### Database Schema (Fully Implemented)

#### Core Tables
| Table | Purpose | Status |
|-------|---------|--------|
| `affiliates` | Affiliate accounts, referral codes, earnings tracking | ✅ Complete |
| `affiliate_earnings` | Commission earnings from orders | ✅ Complete |
| `affiliate_referrals` | Click tracking & conversions | ✅ Complete |
| `affiliate_payouts` | Payment requests & processing | ✅ Complete |
| `product_affiliate_commissions` | Product-specific commission rates | ✅ Complete |
| `category_affiliate_commissions` | Category-based commission rates | ✅ Complete |

#### Key Affiliate Fields
- `referral_code` (unique, auto-generated: 2 letters + 4 digits)
- `commission_rate` (decimal, default 5.00%)
- `total_earned` (lifetime earnings)
- `withdrawn_amount` (total paid out)
- `total_clicks` (referral link clicks)
- `total_conversions` (successful referrals)
- `is_approved` (admin approval status)

### API Endpoints

#### Storefront/Customer API (`/api/v2/store/affiliate/`)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/apply` | POST | Submit affiliate application | ✅ Ready |
| `/dashboard` | GET | Get affiliate dashboard data | ✅ Ready |
| `/payout-request` | POST | Request payout | ✅ Ready |
| `/check` | GET | Check if user is affiliate | ✅ Ready |

#### Admin API (`/api/v2/admin/`)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/affiliates` | GET | List all affiliates (paginated) | ✅ Ready |
| `/affiliates/{id}` | GET | Get affiliate details | ✅ Ready |
| `/affiliates/{id}/earnings` | GET | Get earnings history | ✅ Ready |
| `/affiliates/{id}/payouts` | GET | Get payout history | ✅ Ready |
| `/affiliates/{id}/referrals` | GET | Get referral tracking data | ✅ Ready |
| `/affiliates/{id}/approve` | POST | Approve affiliate | ✅ Ready |
| `/affiliates/{id}/reject` | POST | Reject affiliate | ✅ Ready |
| `/affiliates/create-from-user` | POST | Create affiliate from user | ✅ Ready |
| `/users/not-affiliates` | GET | Get users without affiliate accounts | ✅ Ready |
| `/affiliates/stats` | GET | Admin dashboard stats | ✅ Ready |
| `/affiliate-payouts` | CRUD | Manage payout requests | ✅ Ready |
| `/product-commissions` | CRUD | Product-specific rates | ✅ Ready |
| `/category-commissions` | CRUD | Category-based rates | ✅ Ready |

### Dashboard API Response Structure

The `/api/v2/store/affiliate/dashboard` endpoint returns:

```json
{
  "success": true,
  "data": {
    "affiliate": {
      "id": 1,
      "referral_code": "AB1234",
      "referral_link": "https://hookhunt.com/?ref=AB1234",
      "commission_rate": 5.0,
      "total_earned": 450.50,
      "withdrawn_amount": 200.0,
      "available_balance": 250.50,
      "total_clicks": 1247,
      "total_conversions": 106,
      "conversion_rate": 8.5,
      "is_approved": true
    },
    "recent_referrals": [...],
    "recent_earnings": [...],
    "product_commissions": [...],
    "category_commissions": [...]
  }
}
```

---

## 2. Customer Panel UI Status ❌ **STATIC MOCK DATA**

### Current File: `/src/app/account/affiliate/page.tsx`

**Status:** All data is **hardcoded mock data**

#### Static Elements Found

| Section | Current Implementation | Required |
|---------|----------------------|----------|
| **Stats Cards** | `[{ name: 'Total Earnings', value: '৳45,230', ... }]` | Fetch from API |
| **Period Filter** | `useState('30days')` - no effect | Add to API request |
| **Recent Referrals** | `[{ id: 'REF-001', name: 'John Smith', ... }]` | Use `recent_referrals` from API |
| **Referral Link** | `'https://hookhunt.com/ref/affiliate123'` | Use `affiliate.referral_link` from API |
| **Referral Code** | `'AFFILIATE123'` | Use `affiliate.referral_code` from API |
| **Commission Structure** | Hardcoded category rates | Use `category_commissions` from API |
| **Top Products** | `[{ name: 'Wireless Headphones', ... }]` | Use `product_commissions` from API |
| **Copy to Clipboard** | No feedback | Add toast notification |
| **Payout Request** | Button exists but no functionality | Implement modal/form |
| **Marketing Materials** | Static button | Connect to downloads |
| **Payment History** | Static button | Use `recent_earnings` data |
| **Support** | Static button | Link to support |

### Issues Identified

1. ❌ No API integration - completely static
2. ❌ No authentication/affiliate status check
3. ❌ No loading states
4. ❌ No error handling
5. ❌ No empty states (what if user isn't affiliate?)
6. ❌ Period filter doesn't work
7. ❌ Copy to clipboard has no feedback
8. ❌ Payout request is not connected to API
9. ❌ No approval state handling (pending vs approved)

---

## 3. Admin Panel Status ❓ **NOT FOUND**

### Investigation Results

Searched for admin affiliate UI in:
- `/src/app/admin/` - Only has `catalog/` and `settings/`
- No dedicated affiliate management UI found

**Status:** Admin panel appears to **lack affiliate management UI entirely**

---

## 4. What's Missing for Customer UI

### Critical Components Needed

#### 1. API Client/Service
```typescript
// src/lib/api/affiliate.ts (NEW FILE NEEDED)
export async function getAffiliateDashboard() {
  // GET /api/v2/store/affiliate/dashboard
}

export async function requestPayout(data) {
  // POST /api/v2/store/affiliate/payout-request
}

export async function applyForAffiliate(data) {
  // POST /api/v2/store/affiliate/apply
}

export async function checkAffiliateStatus() {
  // GET /api/v2/affiliate/check
}
```

#### 2. Application Flow (NEW PAGE NEEDED)
```typescript
// src/app/account/affiliate/apply/page.tsx (NEW)
// - Form to apply for affiliate program
// - Shows pending state if not approved
// - Redirects to dashboard if approved
```

#### 3. Dashboard Enhancements

**Period Filtering:**
```typescript
// Add to API request:
const periodMap = {
  '7days': 'last_7_days',
  '30days': 'last_30_days', 
  '90days': 'last_90_days',
  '1year': 'last_year'
}
```

**Loading States:**
```typescript
// Add:
if (loading) return <AffiliateSkeleton />
if (error) return <ErrorState />
if (!isAffiliate) return <NotAffiliateState />
if (!isApproved) return <PendingApprovalState />
```

**Payout Modal:**
```typescript
// NEW COMPONENT: PayoutRequestModal
// - Form with amount, payment method, payment details
// - Validation: min ৳100, sufficient balance
// - Success/error handling
```

**Commission Structure:**
```typescript
// Replace static data with API data:
// - Use category_commissions from dashboard API
// - Show affiliate's custom rates if set
```

**Top Products:**
```typescript
// Replace static data with:
// - Use product_commissions from dashboard API  
// - Calculate actual referral counts from recent_referrals
```

#### 4. Notification System
```typescript
// Add toast notifications for:
// - Copy to clipboard success
// - Payout request submitted
// - Application errors
```

---

## 5. Implementation Priority

### Phase 1: Core Dashboard (HIGH PRIORITY)
- [ ] Create `src/lib/api/affiliate.ts` API client
- [ ] Implement `useAffiliateDashboard` hook
- [ ] Replace all mock data with API calls
- [ ] Add loading & error states
- [ ] Handle non-affiliate & pending approval states

### Phase 2: Interactive Features (MEDIUM PRIORITY)
- [ ] Implement period filtering
- [ ] Add copy-to-clipboard with toast feedback
- [ ] Create payout request modal
- [ ] Connect payout API

### Phase 3: Enhanced Features (LOW PRIORITY)
- [ ] Marketing materials download
- [ ] Payment history view
- [ ] Support chat integration
- [ ] Performance charts/graphs

---

## 6. Recommended File Structure

```
src/
├── lib/
│   └── api/
│       └── affiliate.ts          # NEW: API client
├── hooks/
│   └── useAffiliateDashboard.ts # NEW: Custom hook
├── components/
│   └── affiliate/
│       ├── AffiliateStats.tsx    # NEW: Stats cards
│       ├── ReferralLink.tsx     # NEW: Link display & copy
│       ├── CommissionTable.tsx  # NEW: Commission structure
│       ├── ReferralsTable.tsx   # NEW: Recent referrals
│       ├── PayoutModal.tsx      # NEW: Payout form
│       └── MarketingAssets.tsx  # NEW: Download section
└── app/
    └── account/
        └── affiliate/
            ├── page.tsx          # MODIFY: Use real data
            └── apply/
                └── page.tsx      # NEW: Application form
```

---

## 7. Database Models Available

The backend provides these relationships that can be utilized:

```php
// Affiliate model relationships
$affiliate->user              // User account
$affiliate->earnings()        // Commission history
$affiliate->referrals()       // Click/conversion tracking
$affiliate->payouts()         // Payment requests
$affiliate->productCommissions()  // Custom product rates
$affiliate->categoryCommissions() // Custom category rates
```

**Calculated Properties:**
- `available_balance` = total_earned - withdrawn - pending_payouts
- `total_clicks` = count of referrals
- `total_conversions` = count of converted referrals
- `conversion_rate` = (conversions / clicks) * 100

---

## 8. API Authentication

All endpoints require:
```typescript
// In API calls:
headers: {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

The auth context should already be available via `useAuth()`.

---

## Summary

| Component | Backend | Customer UI | Admin UI |
|-----------|---------|-------------|----------|
| Database Schema | ✅ 100% | N/A | N/A |
| API Endpoints | ✅ 100% | N/A | N/A |
| Dashboard Display | N/A | ❌ 0% (static) | ❓ Not found |
| Application Flow | ✅ Complete | ❌ Missing | ❌ Not found |
| Payout System | ✅ Complete | ❌ Not connected | ❓ Not found |
| Referral Tracking | ✅ Complete | ❌ Static data | ❓ Not found |

**Bottom Line:** The backend is production-ready. The customer UI needs complete replacement of mock data with API integration. The admin panel appears to have no affiliate management UI despite having comprehensive admin APIs.
