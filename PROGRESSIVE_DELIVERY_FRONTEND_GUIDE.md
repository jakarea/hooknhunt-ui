# Progressive Free Delivery - Frontend Integration Guide

## 🎯 How It Works

The Progressive Free Delivery System calculates delivery discounts based on how close the order amount is to the free delivery threshold.

### Example (Threshold: 3000 BDT, Base Charge: 60 BDT)
```
Order: ৳1500 (50% of threshold) → 50% discount → Pay ৳30 delivery
Order: ৳2400 (80% of threshold) → 80% discount → Pay ৳12 delivery
Order: ৳3000 (100% of threshold) → 100% discount → FREE delivery
```

---

## 📦 Integration Steps

### Step 1: Update Cart Page

Replace the hardcoded `shippingThreshold = 5000` with the progressive delivery system.

**Before:**
```typescript
const shippingThreshold = 5000; // ❌ Hardcoded
```

**After:**
```typescript
import { useDeliveryCalculation } from '@/hooks/useDeliveryCalculation';
import ProgressiveDeliveryBreakdown from '@/components/cart/ProgressiveDeliveryBreakdown';

// Add delivery calculation
const { deliveryCharge, breakdown, calculateDelivery, loading: deliveryLoading } = useDeliveryCalculation();

// Calculate total weight of selected items
const calculateTotalWeight = () => {
  return cartItems
    .filter(item => selectedItems.has(item.product.id))
    .reduce((sum, item) => sum + (item.product.weight || 0) * item.quantity, 0);
};

// Recalculate delivery when cart changes
useEffect(() => {
  const totalWeight = calculateTotalWeight();
  const orderAmount = subtotal;

  // You need division from address selection
  // For now, use 'dhaka' as default
  if (totalWeight > 0 && orderAmount > 0) {
    calculateDelivery(totalWeight, 'dhaka', orderAmount);
  }
}, [subtotal, selectedItems]);

// Update total calculation
const total = subtotal + (breakdown ? deliveryCharge : 0);
```

### Step 2: Add Progressive Delivery Display

Add the progress bar component to show customers their progress toward free delivery:

```tsx
{/* Progressive Delivery Progress Bar */}
{breakdown?.progressive_delivery?.enabled && (
  <div className="mb-4">
    <ProgressiveDeliveryBreakdown
      breakdown={breakdown}
      orderAmount={subtotal}
    />
  </div>
)}

{/* Or show simple progress */}
{breakdown?.progressive_delivery?.enabled && (
  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-violet-900">
        Progress toward free delivery
      </span>
      <span className="text-sm font-bold text-violet-600">
        {breakdown.progressive_delivery.discount_percentage?.toFixed(0)}%
      </span>
    </div>
    <div className="w-full bg-violet-200 rounded-full h-2">
      <div
        className="bg-violet-600 h-2 rounded-full transition-all"
        style={{
          width: `${Math.min(breakdown.progressive_delivery.discount_percentage || 0, 100)}%`
        }}
      />
    </div>
    {breakdown.progressive_delivery.amount_needed_for_free > 0 ? (
      <p className="text-sm text-violet-700 mt-2">
        Add ৳{breakdown.progressive_delivery.amount_needed_for_free.toFixed(0)} more for free delivery
      </p>
    ) : (
      <p className="text-sm font-bold text-green-600 mt-2">
        🎉 Free delivery applied!
      </p>
    )}
  </div>
)}
```

### Step 3: Update Checkout Page

The checkout page needs division/location from the address to calculate delivery accurately.

```typescript
import { useDeliveryCalculation } from '@/hooks/useDeliveryCalculation';

const [selectedDivision, setSelectedDivision] = useState('dhaka');

const { deliveryCharge, breakdown, calculateDelivery } = useDeliveryCalculation();

// When address changes, recalculate delivery
useEffect(() => {
  const totalWeight = calculateTotalWeight();
  const orderAmount = subtotal;

  if (totalWeight > 0 && orderAmount > 0 && selectedDivision) {
    calculateDelivery(totalWeight, selectedDivision, orderAmount);
  }
}, [selectedDivision, subtotal, cartItems]);

// Use the calculated delivery charge
const totalCharges = breakdown?.progressive_delivery?.is_free ? 0 : deliveryCharge;
```

### Step 4: Handle Address Selection

Add division selection in the address form:

```tsx
<Select
  label="Division"
  value={selectedDivision}
  onChange={(value) => setSelectedDivision(value)}
  data={[
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'rajshahi', label: 'Rajshahi' },
    // ... more divisions
  ]}
/>
```

---

## 🎨 UI Components

### Progress Bar Color Coding

The progress bar changes color based on percentage:

```typescript
const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return 'green';      // Free!
  if (percentage >= 80) return 'violet';      // Almost there
  if (percentage >= 50) return 'yellow';      // Halfway
  return 'gray';                              // Just started
};
```

### Message Examples

| Percentage | Message |
|------------|---------|
| 0-49% | "Add ৳X more for free delivery" |
| 50-79% | "Keep going! Add ৳X more for free delivery" |
| 80-99% | "Almost there! Add ৳X more for free delivery" |
| 100%+ | "🎉 Free delivery applied!" |

---

## 📡 API Integration

### API Endpoint

```
POST /api/v2/store/calculate-delivery

Request:
{
  "weight": 2.5,
  "division": "dhaka",
  "order_amount": 2400
}

Response:
{
  "success": true,
  "data": {
    "charge": 12,
    "breakdown": {
      "total_weight": 2.5,
      "zone": "inside_dhaka",
      "base_charge": 60,
      "total_charge": 12,
      "progressive_delivery": {
        "enabled": true,
        "order_amount": 2400,
        "min_amount": 3000,
        "discount_percentage": 80,
        "discount_amount": 48,
        "amount_needed_for_free": 600,
        "is_free": false
      }
    }
  }
}
```

---

## 🔄 Complete Cart Page Example

Here's a complete example showing the integration:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useDeliveryCalculation } from '@/hooks/useDeliveryCalculation';
import ProgressiveDeliveryBreakdown from '@/components/cart/ProgressiveDeliveryBreakdown';

export default function CartPage() {
  const { cartItems, getCartTotal } = useCart();
  const [selectedDivision, setSelectedDivision] = useState('dhaka');

  // Delivery calculation
  const {
    deliveryCharge,
    breakdown,
    calculateDelivery,
    loading: deliveryLoading
  } = useDeliveryCalculation();

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) =>
    sum + (item.product.price || 0) * item.quantity, 0
  );

  // Calculate total weight
  const totalWeight = cartItems.reduce((sum, item) =>
    sum + (item.product.weight || 0) * item.quantity, 0
  );

  // Recalculate delivery when dependencies change
  useEffect(() => {
    if (totalWeight > 0 && subtotal > 0 && selectedDivision) {
      calculateDelivery(totalWeight, selectedDivision, subtotal);
    }
  }, [totalWeight, subtotal, selectedDivision]);

  // Total including delivery
  const total = subtotal + (breakdown ? deliveryCharge : 0);

  return (
    <div>
      {/* Cart items */}

      {/* Progressive Delivery Display */}
      {breakdown?.progressive_delivery?.enabled && (
        <ProgressiveDeliveryBreakdown
          breakdown={breakdown}
          orderAmount={subtotal}
        />
      )}

      {/* Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>৳{subtotal}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery:</span>
          <span>
            {breakdown?.progressive_delivery?.is_free
              ? 'FREE'
              : `৳${deliveryCharge}`}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>৳{total}</span>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Testing Checklist

- [ ] Cart page shows progressive delivery info
- [ ] Progress bar updates when cart total changes
- [ ] Delivery charge recalculates when items added/removed
- [ ] Free delivery message shows at 100%
- [ ] Checkout page uses division for accurate calculation
- [ ] Address selection triggers delivery recalculation

---

## 🎯 Key Benefits

1. **Customer Incentive**: Visual progress encourages larger orders
2. **Transparent**: Customers see exactly how much to save
3. **Dynamic**: Updates in real-time as cart changes
4. **Flexible**: Configurable threshold from admin panel
5. **Professional**: Smooth animations and clear messaging

---

## 📝 Notes

- Progressive delivery is **disabled by default** - enable via admin panel
- Falls back to standard delivery calculation when disabled
- Works with existing coupon and discount systems
- No breaking changes to existing functionality

---

*Last Updated: 2026-05-01*
*Status: Components created, integration pending*
