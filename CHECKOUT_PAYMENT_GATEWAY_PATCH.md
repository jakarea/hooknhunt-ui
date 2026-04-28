# PATCH: Dynamic Payment Gateway Integration for Checkout
# This patch modifies the checkout page to dynamically show only the active payment gateway
# File: /Users/jakareaparvez/Sites/hooknhunt-ui/src/app/checkout/page.tsx

## SUMMARY OF CHANGES:
# 1. Wrap SSLCommerz payment option with conditional rendering based on activeGateway
# 2. Wrap EPS payment option with conditional rendering based on activeGateway  
# 3. Change gateway labels from specific names to generic "Payment Gateway"
# 4. Update EMI options to work with active gateway (SSLCommerz or EPS)
# 5. Update redirect messages to be generic

============================================================================
PART 1: MODIFY SSLCOMMERZ PAYMENT OPTION (Around line 911)
============================================================================

REPLACE THIS BLOCK (lines ~911-944):
```tsx
                {/* SSLCommerz Payment Gateway */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'sslcommerz'
                      ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="sslcommerz"
                    checked={paymentMethod === 'sslcommerz'}
                    onChange={() => setPaymentMethod('sslcommerz')}
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">{t('checkout.sslcommerzTitle')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('checkout.sslcommerzDesc')}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Visa</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Mastercard</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">bKash</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Nagad</span>
                      </div>
                    </div>
                  </div>
                </label>
```

WITH THIS:
```tsx
                {/* Payment Gateway - SSLCommerz (Only shown when active) */}
                {activeGateway === 'sslcommerz' && (
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'sslcommerz'
                        ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="sslcommerz"
                      checked={paymentMethod === 'sslcommerz'}
                      onChange={() => setPaymentMethod('sslcommerz')}
                      className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{t('checkout.paymentGateway')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('checkout.paymentGatewayDesc')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Visa</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Mastercard</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">bKash</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Nagad</span>
                        </div>
                      </div>
                    </div>
                  </label>
                )}
```

============================================================================
PART 2: MODIFY EPS PAYMENT OPTION (Around line 946-985)
============================================================================

REPLACE THIS BLOCK:
```tsx
                {/* EPS Payment Gateway */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'eps'
                      ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="eps"
                    checked={paymentMethod === 'eps'}
                    onChange={() => setPaymentMethod('eps')}
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">EPS Payment</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Internet Banking, Mobile Banking, Cards</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">Internet Banking</span>
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">Mobile Banking</span>
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">Cards</span>
                      </div>
                    </div>
                  </div>
                </label>
```

WITH THIS:
```tsx
                {/* Payment Gateway - EPS (Only shown when active) */}
                {activeGateway === 'eps' && (
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'eps'
                        ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="eps"
                      checked={paymentMethod === 'eps'}
                      onChange={() => setPaymentMethod('eps')}
                      className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 003-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{t('checkout.paymentGateway')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('checkout.paymentGatewayDesc')}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">Internet Banking</span>
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">Mobile Banking</span>
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">Cards</span>
                        </div>
                      </div>
                    </div>
                  </label>
                )}
```

============================================================================
PART 3: UPDATE EMI OPTIONS SECTION (Around line 870-910)
============================================================================

FIND THIS BLOCK (EMI Options for SSLCommerz):
```tsx
              {/* EMI Options - SSLCommerz Only */}
              {paymentMethod === 'sslcommerz' && (
```

REPLACE WITH:
```tsx
              {/* EMI Options - Available for active gateway */}
              {(paymentMethod === 'sslcommerz' || paymentMethod === 'eps') && (
```

============================================================================
PART 4: UPDATE REDIRECT MESSAGE (Around line 1525)
============================================================================

FIND THIS:
```tsx
                  {paymentMethod === 'sslcommerz' ? t('checkout.redirectingToSsl') : 'Redirecting to EPS Payment Gateway...'}
```

REPLACE WITH:
```tsx
                  {t('checkout.redirectingToGateway')}
```

============================================================================
PART 5: UPDATE EMI BUTTON HANDLER (Around line 410-430)
============================================================================

FIND THIS:
```tsx
        // Handle SSL Commerz payment - ONLY for sslcommerz payment method
        if (paymentMethod === 'sslcommerz') {
```

REPLACE WITH:
```tsx
        // Handle SSL Commerz & EPS payment - for active gateway payment methods
        if (paymentMethod === 'sslcommerz' || paymentMethod === 'eps') {
```

============================================================================
ADDITIONAL TRANSLATION KEYS NEEDED (Already added to i18n.ts):
============================================================================

English (src/lib/i18n.ts around line 280):
```typescript
'checkout.paymentGateway': 'Payment Gateway',
'checkout.paymentGatewayDesc': 'Pay securely using your preferred payment method',
'checkout.redirectingToGateway': 'You will be redirected to payment gateway shortly.',
```

Bengali (src/lib/i18n.ts around line 740):
```typescript
'checkout.paymentGateway': 'পেমেন্ট গেটওয়ে',
'checkout.paymentGatewayDesc': 'আপনার পছন্দের পেমেন্ট পদ্ধতি ব্যাবহার করে নিরাপদে পেমেন্ট করুন',
'checkout.redirectingToGateway': 'আপনি শীঘ্রই পেমেন্ট গেটওয়েতে পুনঃনির্দেশিত হবেন।',
```

============================================================================
TESTING CHECKLIST:
============================================================================

After applying the patch, verify:

1. ✅ API function exists: `/src/lib/api.ts` - `getActivePaymentGateway()`
2. ✅ State variables added: `activeGateway`, `gatewayConfig`
3. ✅ useEffect added to fetch active gateway on page load
4. ✅ Translation keys added in both English and Bengali
5. ✅ SSLCommerz only shows when `activeGateway === 'sslcommerz'`
6. ✅ EPS only shows when `activeGateway === 'eps'`
7. ✅ COD always shows
8. ✅ Generic "Payment Gateway" label is used
9. ✅ EMI options work for both gateways
10. ✅ Redirect message is generic

============================================================================
END OF PATCH FILE
============================================================================

# HOW TO APPLY THIS PATCH:

1. Open `/Users/jakareaparvez/Sites/hooknhunt-ui/src/app/checkout/page.tsx`
2. Find each section mentioned above
3. Replace the code as shown
4. Save the file
5. Test the checkout page

# VERIFICATION:

To test, switch between gateways in admin panel:
- Admin → Settings → Payments → Switch to SSLCommerz → Checkout should show "Payment Gateway"
- Admin → Settings → Payments → Switch to EPS → Checkout should show "Payment Gateway"
- If no gateway is active → Only COD should show
