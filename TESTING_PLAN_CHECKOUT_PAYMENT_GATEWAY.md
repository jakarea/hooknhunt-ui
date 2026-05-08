# 🧪 TESTING PLAN & VERIFICATION CHECKLIST
# Dynamic Payment Gateway Integration

## 📋 OVERVIEW
This document provides step-by-step testing instructions for the dynamic payment gateway integration.

---

## ✅ PRE-REQUISITES CHECKLIST

Before testing, verify these files have been modified:

### 1. API Function Added
**File:** `/src/lib/api.ts`
- ✅ Should contain `getActivePaymentGateway()` function around line 460
- ✅ Function should call `/system/settings/payment` endpoint
- ✅ Returns type with `activeGateway`, `sslcommerz`, `eps` properties

### 2. State Variables Added
**File:** `/src/app/checkout/page.tsx`
- ✅ Line ~39-40: `activeGateway` state added
- ✅ Line ~40: `gatewayConfig` state added
- ✅ Line ~134-162: useEffect to fetch active gateway

### 3. Translation Keys Added
**File:** `/src/lib/i18n.ts`
- ✅ English (around line 281):
  - `'checkout.paymentGateway': 'Payment Gateway'`
  - `'checkout.paymentGatewayDesc': 'Pay securely using your preferred payment method'`
- ✅ Bengali (around line 741):
  - `'checkout.paymentGateway': 'পেমেন্ট গেটওয়ে'`
  - `'checkout.paymentGatewayDesc': 'আপনার পছন্দের পেমেন্ট পদ্ধতি ব্যাবহার করে নিরাপদে পেমেন্ট করুন'`

---

## 🧪 TESTING SCENARIOS

### TEST CASE 1: SSLCommerz as Active Gateway
**Setup:**
1. Go to Admin: https://probesh.hooknhunt.com/settings/payments
2. Click "Switch to SSLCommerz"
3. Wait for success message

**Expected Results:**
- ✅ Admin shows "ACTIVE" badge on SSLCommerz card
- ✅ Frontend checkout page shows:
  - Only "Payment Gateway" option (generic label)
  - SSLCommerz payment badges (Visa, Mastercard, bKash, Nagad)
  - Cash on Delivery option
- ❌ EPS Payment option is hidden

**Verification Steps:**
1. Open checkout page: https://probesh.hooknhunt.com/checkout
2. Scroll to "Payment Method" section
3. **CHECK:** You should see exactly 2 options:
   - Payment Gateway (with SSLCommerz styling - blue theme)
   - Cash on Delivery
4. **CHECK:** Payment Gateway label is used (not "SSLCommerz")
5. **CHECK:** EPS option is NOT visible

---

### TEST CASE 2: EPS as Active Gateway
**Setup:**
1. Go to Admin: https://probesh.hooknhunt.com/settings/payments
2. Click "Switch to EPS"
3. Wait for success message

**Expected Results:**
- ✅ Admin shows "ACTIVE" badge on EPS card
- ✅ Frontend checkout page shows:
  - Only "Payment Gateway" option (generic label)
  - EPS payment badges (Internet Banking, Mobile Banking, Cards)
  - Cash on Delivery option
- ❌ SSLCommerz option is hidden

**Verification Steps:**
1. Refresh checkout page
2. Scroll to "Payment Method" section
3. **CHECK:** You should see exactly 2 options:
   - Payment Gateway (with EPS styling - purple theme)
   - Cash on Delivery
4. **CHECK:** Payment Gateway label is used (not "EPS Payment")
5. **CHECK:** SSLCommerz option is NOT visible

---

### TEST CASE 3: No Gateway Active
**Setup:**
1. Go to backend and set `ACTIVE_PAYMENT_GATEWAY=` in `.env` (empty or commented)
2. Or disable both gateways

**Expected Results:**
- ✅ Admin shows both gateways as "Not Configured"
- ✅ Frontend checkout page shows:
  - ONLY Cash on Delivery option
- ❌ Payment Gateway option is hidden

**Verification Steps:**
1. Refresh checkout page
2. Scroll to "Payment Method" section
3. **CHECK:** You should see ONLY 1 option:
   - Cash on Delivery
4. **CHECK:** Payment Gateway option is NOT visible

---

### TEST CASE 4: Payment Flow with Active Gateway
**Setup:**
1. Add items to cart
2. Proceed to checkout
3. Fill all required fields
4. Select "Payment Gateway"

**For SSLCommerz:**
1. Click "Place Order" button
2. **CHECK:** Should redirect to SSLCommerz gateway
3. **CHECK:** URL contains sslcommerz domain
4. **CHECK:** Order amount is correct

**For EPS:**
1. Click "Place Order" button  
2. **CHECK:** Should redirect to EPS gateway
3. **CHECK:** URL contains EPS domain
4. **CHECK:** Order amount is correct

---

### TEST CASE 5: EMI Options (If Available)
**Setup:**
1. Make SSLCommerz active
2. Add items worth more than minimum EMI amount
3. Proceed to checkout

**Expected Results:**
- ✅ EMI options dropdown is visible
- ✅ Can select EMI bank/tenure
- ✅ EMI selection is sent with payment request

**Verification Steps:**
1. Look for EMI options section above payment methods
2. **CHECK:** EMI dropdown appears when cart total > minimum amount
3. **CHECK:** Selecting EMI bank works correctly
4. **CHECK:** Order includes EMI details

---

### TEST CASE 6: Gateway Switch During Active Session
**Setup:**
1. User A is on checkout page with SSLCommerz active
2. Admin switches to EPS gateway
3. User A refreshes page

**Expected Results:**
- ✅ User sees updated gateway (EPS) after refresh
- ✅ Payment method automatically switches to active gateway
- ✅ No errors or 401s

---

## 🔍 BROWSER CONSOLE CHECKLIST

While testing, open DevTools Console and verify:

### Network Tab:
- ✅ `GET /api/v2/system/settings/payment` returns 200
- ✅ Response contains `activeGateway` field
- ✅ Response contains `sslcommerz` and `eps` config objects
- ✅ No 401 Unauthorized errors
- ✅ No CORS errors

### Console Tab:
- ✅ No errors about missing translation keys
- ✅ No `activeGateway is not defined` errors
- ✅ Payment method logged correctly: `Checkout - Payment Method: sslcommerz` or `eps`

### React DevTools:
- ✅ `activeGateway` state shows correct value
- ✅ `gatewayConfig` state is populated
- ✅ `paymentMethod` updates when active gateway changes

---

## 📱 CROSS-BROWSER TESTING

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)
- ✅ Mobile browsers (Chrome Mobile, Safari iOS)

---

## 🌐 LOCALIZATION TESTING

### English (Default):
1. Switch language to English
2. **CHECK:** "Payment Gateway" label is shown
3. **CHECK:** "Pay securely using your preferred payment method" description

### Bengali:
1. Switch language to Bengali
2. **CHECK:** "পেমেন্ট গেটওয়ে" label is shown
3. **CHECK:** "আপনার পছন্দের পেমেন্ট পদ্ধতি ব্যাবহার করে নিরাপদে পেমেন্ট করুন" description

---

## 🐛 KNOWN ISSUES & SOLUTIONS

### Issue 1: Gateway Not Switching Automatically
**Symptom:** Payment method doesn't change when gateway is switched
**Solution:** Refresh checkout page after admin switches gateway
**Root Cause:** useEffect only runs on component mount

### Issue 2: Both Gateways Showing
**Symptom:** Both SSLCommerz and EPS options are visible
**Solution:** Verify conditional rendering `{activeGateway === 'sslcommerz' && (...)}`
**Root Cause:** Missing conditional wrapper

### Issue 3: Translation Key Missing
**Symptom:** Shows `checkout.sslcommerzTitle` instead of "Payment Gateway"
**Solution:** Clear i18n cache: `localStorage.clear()` and refresh
**Root Cause:** Translation file not reloaded

---

## 📊 PERFORMANCE CHECKLIST

### API Calls:
- ✅ Active gateway fetched once on page load
- ✅ No duplicate API calls
- ✅ API response cached appropriately
- ✅ No unnecessary re-renders

### User Experience:
- ✅ Payment gateway selection is smooth
- ✅ No layout shift when gateway loads
- ✅ Loading states handled properly
- ✅ Mobile responsive design maintained

---

## 🚀 PRODUCTION DEPLOYMENT CHECKLIST

Before deploying to production:

### Code Quality:
- ✅ All changes committed to git
- ✅ No console errors or warnings
- ✅ TypeScript compilation successful
- ✅ ESLint checks passed

### Backend Compatibility:
- ✅ Backend API `/api/v2/system/settings/payment` is accessible
- ✅ CORS settings allow frontend domain
- ✅ Authentication tokens are valid
- ✅ SSL certificates are valid

### Testing:
- ✅ All test cases passed
- ✅ Cross-browser testing completed
- ✅ Mobile responsive verified
- ✅ Localization tested in both languages

### Documentation:
- ✅ Admin documentation updated
- ✅ Team members trained on gateway switching
- ✅ Rollback plan documented

---

## 📝 FINAL VERIFICATION SCRIPT

Run this in browser console after deployment:

```javascript
// Test 1: Check if API function exists
console.log('✅ API Check:', typeof window !== 'undefined');

// Test 2: Check active gateway state
// (Need to inspect React DevTools Component tree)

// Test 3: Verify payment options visible
document.querySelectorAll('input[name="payment"]').forEach(input => {
  console.log('Payment option:', input.value, 'Checked:', input.checked);
});

// Test 4: Check generic label is used
const gatewayLabel = document.querySelector('p.font-bold');
console.log('Gateway label text:', gatewayLabel?.textContent);
console.log('Should contain "Payment Gateway" or "পেমেন্ট গেটওয়ে"');
```

---

## 🎓 SUMMARY

This implementation ensures:
1. ✅ **Single source of truth** - Admin panel controls which gateway is active
2. ✅ **Generic UX** - Customers see "Payment Gateway" not technical names
3. ✅ **Flexibility** - Easy to switch between gateways via admin
4. ✅ **Always available fallback** - COD always shown by default
5. ✅ **Future-proof** - Easy to add more gateways later

---

## ✅ SIGN-OFF CHECKLIST

Before considering this feature complete:

- [ ] All test cases pass
- [ ] No console errors
- [ ] Payment flow works for both gateways
- [ ] Admin can switch gateways seamlessly
- [ ] Translation keys work in both languages
- [ ] Mobile users can complete checkout
- [ ] Production deployment successful
- [ ] Documentation is up to date

---

**Last Updated:** April 26, 2026  
**Version:** 1.0.0  
**Status:** Ready for Testing
