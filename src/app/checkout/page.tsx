'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCouponStore } from '@/stores/couponStore';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { usePayment } from '@/hooks/usePayment';
import { useServiceCharge } from '@/hooks/useServiceCharge';
import { useAffiliateTracking } from '@/contexts/AffiliateTrackingContext';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import ProgressiveDeliveryBreakdown from '@/components/cart/ProgressiveDeliveryBreakdown';
import DeliveryInfo from '@/components/checkout/DeliveryInfo';
import { Address } from '@/types';
import { bangladeshDivisions } from '@/data/bangladesh-divisions';
import { bangladeshDivisionsBn } from '@/data/bangladesh-divisions-bn';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedName } from '@/stores/productStore';
import {
  getEnglishDivisionName,
  getEnglishDistrictName,
  getEnglishThanaName as getThanaNameFromMapping
} from '@/utils/bengaliToEnglishMapping';

type PaymentMethod = 'cod' | 'sslcommerz' | 'eps';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, removeFromCart, updateQuantity, addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const couponStore = useCouponStore();
  const { initiateAndPay, loading: paymentLoading } = usePayment();
  const { referralCode, referralId } = useAffiliateTracking();

  // Select divisions data based on current language
  const divisions = i18n.language === 'bn' ? bangladeshDivisionsBn : bangladeshDivisions;

  // Helper functions to convert Bengali to English (only when language is English)
  const shouldConvertToEnglish = () => i18n.language !== 'bn';

  const convertDivisionName = (bengaliOrEnglishName: string): string => {
    if (!shouldConvertToEnglish()) {
      // Language is Bengali, check if name exists in Bengali dropdowns
      if (bangladeshDivisionsBn.some(d => d.name === bengaliOrEnglishName)) {
        return bengaliOrEnglishName;
      }
    }
    // Language is English or name not in Bengali list - convert to English
    return getEnglishDivisionName(bengaliOrEnglishName);
  };

  const convertDistrictName = (bengaliOrEnglishName: string): string => {
    if (!shouldConvertToEnglish()) {
      // Language is Bengali, check if name exists in Bengali dropdowns
      for (const division of bangladeshDivisionsBn) {
        if (division.districts.some(d => d.name === bengaliOrEnglishName)) {
          return bengaliOrEnglishName;
        }
      }
    }
    // Language is English or name not in Bengali list - convert to English
    return getEnglishDistrictName(bengaliOrEnglishName);
  };

  const convertThanaName = (bengaliOrEnglishName: string): string => {
    if (!shouldConvertToEnglish()) {
      // Language is Bengali, thana field is just text so return as-is
      return bengaliOrEnglishName;
    }
    // Language is English - convert thana
    return getThanaNameFromMapping(bengaliOrEnglishName);
  };

  // Helper to get localized product name
  const getLocalizedNameForProduct = useMemo(() => (product: any) => {
    return getLocalizedName(product, language);
  }, [language]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [activeGateway, setActiveGateway] = useState<'sslcommerz' | 'eps' | null>(null);
  const [activeGatewayLoading, setActiveGatewayLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState<{ message: string; type: 'eps' | 'sslcommerz' | 'general' } | null>(null);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  // EMI option state
  const [selectedEmiBank, setSelectedEmiBank] = useState<number>(0);

  // Coupon input (local state only for the text field)
  const [couponCode, setCouponCode] = useState('');

  // Phone validation state
  const [phoneError, setPhoneError] = useState('');

  // Existing customer detection
  const [existingCustomer, setExistingCustomer] = useState<{ id: number; name: string; phone: string; email: string } | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Customer info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    thana: '',
    division: '',
    notes: '',
  });

  // Get all districts with their division info
  const getAllDistricts = () => {
    const districts: { name: string; division: string }[] = [];
    divisions.forEach(division => {
      division.districts.forEach(district => {
        districts.push({
          name: district.name,
          division: division.name
        });
      });
    });
    return districts.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Get thanas for a selected district
  const getThanasForDistrict = (districtName: string) => {
    for (const division of divisions) {
      const district = division.districts.find(d => d.name === districtName);
      if (district) {
        return district.thanas;
      }
    }
    return [];
  };

  // Get division for a selected district
  const getDivisionForDistrict = (districtName: string) => {
    const district = getAllDistricts().find(d => d.name === districtName);
    return district?.division || '';
  };

  // Bengali to English division mapping (for saved addresses from API)
  const bengaliToEnglishDivision: Record<string, string> = {
    'খুলনা': 'Khulna',
    'চট্টগ্রাম': 'Chattogram',
    'ঢাকা': 'Dhaka',
    'বরিশাল': 'Barishal',
    'ময়মনসিংহ': 'Mymensingh',
    'রংপুর': 'Rangpur',
    'রাজশাহী': 'Rajshahi',
    'সিলেট': 'Sylhet',
  };

  // Bengali to English district mapping (for saved addresses from API)
  const bengaliToEnglishDistrict: Record<string, string> = {
    'কক্সবাজার': "Cox's Bazar",
    'কিশোরগঞ্জ': 'Kishoreganj',
    'কুড়িগ্রাম': 'Kurigram',
    'কুমিল্লা': 'Cumilla',
    'কুষ্টিয়া': 'Kushtia',
    'খাগড়াছড়ি': 'Khagrachhari',
    'খুলনা': 'Khulna',
    'গাইবান্ধা': 'Gaibandha',
    'গাজীপুর': 'Gazipur',
    'গোপালগঞ্জ': 'Gopalganj',
    'চট্টগ্রাম': 'Chattogram',
    'চাঁদপুর': 'Chandpur',
    'চাঁপাইনবাবগঞ্জ': 'Chapainawabganj',
    'চুয়াডাঙ্গা': 'Chuadanga',
    'জয়পুরহাট': 'Joypurhat',
    'জামালপুর': 'Jamalpur',
    'ঝালকাঠি': 'Jhalokati',
    'ঝিনাইদহ': 'Jhenaidah',
    'টাঙ্গাইল': 'Tangail',
    'ঠাকুরগাঁও': 'Thakurgaon',
    'ঢাকা': 'Dhaka',
    'দিনাজপুর': 'Dinajpur',
    'নওগাঁ': 'Naogaon',
    'নড়াইল': 'Narail',
    'নরসিংদী': 'Narsingdi',
    'নাটোর': 'Natore',
    'নারায়ণগঞ্জ': 'Narayanganj',
    'নীলফামারী': 'Nilphamari',
    'নেত্রকোণা': 'Netrokona',
    'নোয়াখালী': 'Noakhali',
    'পঞ্চগড়': 'Panchagarh',
    'পটুয়াখালী': 'Patuakhali',
    'পাবনা': 'Pabna',
    'পিরোজপুর': 'Pirojpur',
    'ফরিদপুর': 'Faridpur',
    'ফেনী': 'Feni',
    'বগুড়া': 'Bogura',
    'বরগুনা': 'Barguna',
    'বরিশাল': 'Barishal',
    'বাগেরহাট': 'Bagerhat',
    'বান্দরবান': 'Bandarban',
    'ব্রাহ্মণবাড়িয়া': 'Brahmanbaria',
    'ভোলা': 'Bhola',
    'ময়মনসিংহ': 'Mymensingh',
    'মাগুরা': 'Magura',
    'মাদারীপুর': 'Madaripur',
    'মানিকগঞ্জ': 'Manikganj',
    'মুন্সীগঞ্জ': 'Munshiganj',
    'মেহেরপুর': 'Meherpur',
    'মৌলভীবাজার': 'Moulvibazar',
    'যশোর': 'Jashore',
    'রংপুর': 'Rangpur',
    'রাঙ্গামাটি': 'Rangamati',
    'রাজবাড়ী': 'Rajbari',
    'রাজশাহী': 'Rajshahi',
    'লক্ষ্মীপুর': 'Lakshmipur',
    'লালমনিরহাট': 'Lalmonirhat',
    'শরীয়তপুর': 'Shariatpur',
    'শেরপুর': 'Sherpur',
    'সাতক্ষীরা': 'Satkhira',
    'সিরাজগঞ্জ': 'Sirajganj',
    'সিলেট': 'Sylhet',
    'সুনামগঞ্জ': 'Sunamganj',
    'হবিগঞ্জ': 'Habiganj',
  };

  // Bengali to English thana mapping (built dynamically from district data)
  // This will be populated on demand as we encounter Bengali thana names
  const getEnglishThanaName = (bengaliThana: string, districtName: string): string => {
    // First, get the English district name
    const englishDistrict = getEnglishDistrictName(districtName);

    // Find the district in divisions data
    for (const division of divisions) {
      const district = division.districts.find(d => d.name === englishDistrict);
      if (district) {
        // Try to find exact match in thana list (might already be English)
        const exactMatch = district.thanas.find(t => t.name === bengaliThana);
        if (exactMatch) {
          return bengaliThana; // Already English
        }

        // Try to find by position (assuming Bengali and English files have same order)
        // This is a fallback - we'll need to build a complete mapping
        console.warn('[Checkout] Thana not found in', englishDistrict, ':', bengaliThana);
        return bengaliThana;
      }
    }

    console.warn('[Checkout] District not found:', englishDistrict);
    return bengaliThana;
  };

  // Normalize BD phone number (handle +88, 88 prefixes)
  const normalizePhone = (phone: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // If 13 digits starting with 880, convert to 0 + 11 digits
    if (cleaned.length === 13 && cleaned.startsWith('880')) {
      return '0' + cleaned.substring(3);
    }

    // If 12 digits starting with 88, convert to 0 + 10 digits
    if (cleaned.length === 12 && cleaned.startsWith('88')) {
      return '0' + cleaned.substring(2);
    }

    // If 11 digits starting with 01, return as is
    if (cleaned.length === 11 && cleaned.startsWith('01')) {
      return cleaned;
    }

    return phone; // Return original if can't normalize
  };

  // Check if phone number is complete (11 or 12-13 digits with country code)
  const isPhoneComplete = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 12 || cleaned.length === 13;
  };

  // Search for existing customer by phone
  const searchCustomerByPhone = async (phone: string) => {
    const normalizedPhone = normalizePhone(phone);

    // Only search if normalized phone matches BD format
    if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
      return;
    }

    setIsSearchingCustomer(true);

    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.getCustomerByPhone(normalizedPhone);

      const data = (response as { data?: { found: boolean; customer?: { id: number; name: string; phone: string; email: string }; addresses?: Address[] } }).data;

      if (data?.found && data.customer && data.addresses) {
        setExistingCustomer(data.customer);
        setSavedAddresses(data.addresses);

        // Auto-fill customer data
        const name = data.customer?.name || '';
        const email = data.customer?.email || '';

        // Auto-fill default address (first address or marked as default)
        const defaultAddr = data.addresses.find((addr: Address) => addr.is_default || addr.isDefault) || data.addresses[0];

        const updatedFormData: typeof formData = {
          ...formData,
          name: name,
          email: email,
        };

        if (defaultAddr) {
          const addr = defaultAddr as unknown as {
            address?: string;
            addressLine1?: string;
            thana?: string;
            city?: string;
            district?: string;
            division?: string;
          };

          // Log raw values from API
          const rawDistrict = addr.district || '';
          const rawDivision = addr.division || '';
          const rawThana = addr.thana || addr.city || '';

          // Convert Bengali to English only if language is English
          const district = convertDistrictName(rawDistrict);
          const division = convertDivisionName(rawDivision);
          const thana = convertThanaName(rawThana);

          updatedFormData.address = addr.address || addr.addressLine1 || '';
          updatedFormData.thana = thana;
          updatedFormData.district = district;
          updatedFormData.division = division;

          setSelectedAddressId(defaultAddr.id);
        }

        setFormData(updatedFormData);

        toast.success(`Welcome back, ${name || 'Customer'}!`, {
          duration: 3000,
          icon: '👋',
        });
      }
    } catch (error) {
      // Customer not found or other error - silently continue as guest
      setExistingCustomer(null);
      setSavedAddresses([]);
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  // Handle selecting a saved address
  const handleSelectSavedAddress = (addressId: number) => {
    const selected = savedAddresses.find(addr => addr.id === addressId) as unknown as {
      address?: string;
      addressLine1?: string;
      thana?: string;
      city?: string;
      district?: string;
      division?: string;
    };

    if (selected) {
      setSelectedAddressId(addressId);

      // Map API response fields to form fields
      const address = selected.address || selected.addressLine1 || '';
      const rawThana = selected.thana || selected.city || '';

      // Convert Bengali to English only if language is English
      const rawDistrict = selected.district || '';
      const rawDivision = selected.division || '';
      const district = convertDistrictName(rawDistrict);
      const division = convertDivisionName(rawDivision);
      const thana = convertThanaName(rawThana);

      setFormData(prev => ({
        ...prev,
        address: address,
        thana: thana,
        district: district,
        division: division,
      }));
      setShowNewAddressForm(false);
    }
  };

  // Handle entering a new address
  const handleEnterNewAddress = () => {
    setSelectedAddressId(null);
    setShowNewAddressForm(true);
    // Clear address fields to let user enter new data
    setFormData(prev => ({
      ...prev,
      address: '',
      thana: '',
      district: '',
      division: '',
    }));
  };

  // OTP verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingOrder, setPendingOrder] = useState<{
    id: number;
    order_number: string;
    phone_number: string;
    total_amount: number;
    customer_name: string;
  } | null>(null);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Ref to prevent empty-cart redirect while order is being placed
  const orderPlacedRef = useRef(false);

  // Delivery store - single source of truth for delivery state
  const deliveryStore = useDeliveryStore();

  // Service charge settings
  const { settings: serviceChargeSettings } = useServiceCharge();

  useEffect(() => {
    // Don't redirect if order is being placed, OTP modal is open, or we're navigating away
    if (cartItems.length === 0 && !showOtpModal && !orderPlacedRef.current && !isNavigatingAway) {
      router.push('/cart');
    }
  }, [cartItems, router, showOtpModal, isNavigatingAway]);

  // Fetch active payment gateway on page load (non-blocking)
  useEffect(() => {
    const fetchActiveGateway = async () => {
      try {
        const api = (await import('@/lib/api')).default;
        const response = await api.getActivePaymentGateway();

        if (response.data && response.data.activeGateway) {
          const { activeGateway } = response.data;
          setActiveGateway(activeGateway);

          // Automatically set payment method to active gateway
          if (activeGateway === 'sslcommerz') {
            setPaymentMethod('sslcommerz');
          } else if (activeGateway === 'eps') {
            setPaymentMethod('eps');
          }
        }
        // If activeGateway is null or response fails, keep 'cod' as default
      } catch (error) {
        // On error, default to COD
        setPaymentMethod('cod');
        setActiveGateway(null);
      } finally {
        // Always clear loading state, even on error
        setActiveGatewayLoading(false);
      }
    };

    fetchActiveGateway();

    // Fetch delivery settings on page load (cached in store)
    deliveryStore.fetchSettings();
  }, []);

  // Restore cart from sessionStorage if user returns after payment fail/cancel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const backup = sessionStorage.getItem('checkout_cart_backup');
    if (backup && cartItems.length === 0) {
      try {
        const restoredItems = JSON.parse(backup) as typeof cartItems;
        if (Array.isArray(restoredItems) && restoredItems.length > 0) {
          // Restore each item back to cart
          restoredItems.forEach(item => {
            addToCart(item.product, item.quantity, [], false);
          });
        }
        // Clear backup after restoration
        sessionStorage.removeItem('checkout_cart_backup');
      } catch (error) {
        console.error('Failed to restore cart from sessionStorage:', error);
      }
    }
  }, [addToCart]);

  // Pre-fill user data and fetch addresses when user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Get phone number from user object - support both camelCase (API) and snake_case (legacy)
      const userPhone = user.phoneNumber || user.phone_number || user.phone || '';

      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: userPhone || prev.phone,
        email: user.email || prev.email,
        // Use user's default address fields if available
        address: user.address || prev.address,
        thana: user.thana || prev.thana,
        district: user.district || prev.district,
      }));

      // Fetch user addresses
      fetchUserAddresses();
    }
  }, [isAuthenticated, user]);

  // Fetch user addresses from API
  const fetchUserAddresses = async () => {
    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.getAddresses();
      if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);
        // Set default address if available
        const defaultAddress = response.data.find((addr: Address) => addr.is_default || addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
          setUseDifferentAddress(false);
          // Pre-fill form with default address
          const addr = defaultAddress as unknown as Record<string, unknown>;
          const district = (addr.district || '') as string;
          // Use division directly from address if available, otherwise find from district
          let division = (addr.division || '') as string;
          if (!division && district) {
            division = getDivisionForDistrict(district);
          }
          const addressLine1 = (addr.addressLine1 || addr.address_line1 || '') as string;
          const addressLine2 = (addr.addressLine2 || addr.address_line2 || '') as string;
          // Combine both address lines if both exist
          const fullAddress = addressLine2 ? `${addressLine1}, ${addressLine2}` : addressLine1;

          setFormData(prev => ({
            ...prev,
            address: fullAddress,
            thana: (addr.city || addr.thana || prev.thana) as string,
            district: district,
            division: division,
          }));
        }
      }
    } catch (error) {
      // Silent fail
    }
  };

  // Handle address selection
  const handleAddressSelect = (addressId: number) => {
    setSelectedAddress(addressId);
    const selected = addresses.find(addr => addr.id === addressId);
    if (selected) {
      // Support both camelCase (API) and snake_case (legacy) property names
      const addr = selected as unknown as Record<string, unknown>;
      const district = (addr.district || '') as string;
      // Use division directly from address if available, otherwise find from district
      let division = (addr.division || '') as string;
      if (!division && district) {
        division = getDivisionForDistrict(district);
      }

      const addressLine1 = (addr.addressLine1 || addr.address_line1 || '') as string;
      const addressLine2 = (addr.addressLine2 || addr.address_line2 || '') as string;

      // Combine both address lines if both exist
      const fullAddress = addressLine2 ? `${addressLine1}, ${addressLine2}` : addressLine1;

      setFormData(prev => ({
        ...prev,
        address: fullAddress,
        thana: (addr.city || addr.thana || prev.thana) as string,
        district: district,
        division: division,
      }));
      setUseDifferentAddress(false);
      // Recalculate delivery charge for the selected address
      calculateDeliveryCharge();
    }
  };

  // Auto-fill division when district changes
  useEffect(() => {
    if (formData.district) {
      const division = getDivisionForDistrict(formData.district);
      if (division) {
        setFormData(prev => ({ ...prev, division }));
      }
    }
  }, [formData.district]);

  // Calculate total weight of cart items
  const calculateTotalWeight = () => {
    return cartItems.reduce((total: number, item) => {
      // Try to get weight from variant data, otherwise use default
      const itemWeight = (typeof item.variant?.weight === 'number' ? item.variant.weight : 0.5); // kg
      return total + (itemWeight * item.quantity);
    }, 0);
  };

  // Calculate delivery charge using delivery store
  const calculateDeliveryCharge = () => {
    const totalWeight = calculateTotalWeight();
    const division = formData.division;
    const currentSubtotal = getCartTotal();

    if (!division) {
      return; // Don't calculate without division
    }

    // Use delivery store for calculation (with debouncing and caching)
    deliveryStore.calculateCharge({
      weight: totalWeight,
      division: division,
      order_amount: currentSubtotal,
    });
  };

  // Extract product IDs from cart for coupon validation
  const getCartProductIds = (): number[] => {
    return cartItems.map(item => item.product.id);
  };

  // Extract category IDs from cart for coupon validation
  const getCartCategoryIds = (): number[] => {
    const categoryIds = new Set<number>();
    cartItems.forEach(item => {
      if (item.product.category_id) {
        categoryIds.add(item.product.category_id);
      }
    });
    return Array.from(categoryIds);
  };

  // Calculate delivery charge when division or cart changes
  useEffect(() => {
    if (formData.division) {
      calculateDeliveryCharge();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.division, cartItems]);

  // Calculations
  const subtotal = getCartTotal();

  // Read coupon values from Zustand store (backend is source of truth)
  const appliedCoupon = couponStore.appliedCoupon;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const freeShipping = appliedCoupon?.type === 'shipping';

  const subtotalAfterCoupon = subtotal - couponDiscount;

  // Get delivery charge from store
  const { charge: deliveryCharge, isFreeDelivery, isProgressiveDelivery } = deliveryStore;
  const isFreeFromStore = isFreeDelivery();
  const isFreeFromCoupon = freeShipping;

  // Calculate service charge
  const serviceCharge = serviceChargeSettings?.enabled ? (serviceChargeSettings?.amount || 0) : 0;

  const totalCharges = (isFreeFromCoupon || isFreeFromStore ? 0 : deliveryCharge) + serviceCharge;
  const total = subtotalAfterCoupon + totalCharges;
  const payableTotal = total;

  // Calculate how much more to spend for free delivery (only for progressive delivery)
  const { breakdown } = deliveryStore;
  const amountNeededForFreeDelivery = isProgressiveDelivery() && breakdown?.progressive_delivery?.enabled
    ? (breakdown.progressive_delivery.amount_needed_for_free || 0)
    : 0;

  // Calculate original total (without discount)
  const originalSubtotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const totalSavings = (originalSubtotal - subtotal) + couponDiscount +
    (freeShipping ? deliveryStore.charge : 0) +
    (deliveryStore.breakdown?.progressive_delivery?.discount_amount || 0);

  // Fetch auto-apply coupons on mount and when cart changes
  useEffect(() => {
    if (subtotal > 0) {
      const productIds = getCartProductIds();
      const categoryIds = getCartCategoryIds();
      couponStore.fetchAutoApplyCoupons(subtotal, productIds, categoryIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  // Re-validate coupon when cart total or products change
  useEffect(() => {
    if (couponStore.appliedCoupon && subtotal > 0) {
      const productIds = getCartProductIds();
      const categoryIds = getCartCategoryIds();
      couponStore.validateAndApply(couponStore.appliedCoupon.code, subtotal, productIds, categoryIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, cartItems]);

  // Apply coupon via store
  const handleApplyCoupon = async () => {
    const trimmedCode = couponCode.trim().toUpperCase();
    if (!trimmedCode) return;
    const productIds = getCartProductIds();
    const categoryIds = getCartCategoryIds();
    const success = await couponStore.validateAndApply(trimmedCode, subtotal, productIds, categoryIds);
    if (success) {
      setCouponCode('');
    }
  };

  // Remove coupon via store
  const handleRemoveCoupon = () => {
    couponStore.removeCoupon();
    setCouponCode('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Real-time phone validation for BD format
    if (name === 'phone') {
      // Allow empty or validate BD phone format
      if (value && !/^01[3-9]?\d{0,8}$/.test(value)) {
        setPhoneError('Invalid BD phone format. Use 01XXXXXXXXX');
      } else {
        setPhoneError('');
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Auto-search for existing customer when phone is complete
  useEffect(() => {
    if (!formData.phone) return;

    // Check if phone is complete (11 or 12-13 digits with country code)
    if (!isPhoneComplete(formData.phone)) return;

    // Normalize and search
    const normalizedPhone = normalizePhone(formData.phone);

    // Only search if normalized phone matches BD format
    if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) return;

    // Debounce search
    const timer = setTimeout(() => {
      searchCustomerByPhone(formData.phone);
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.phone]);

  const handleCheckout = async () => {
    // Clear any previous payment errors when trying to checkout again
    setPaymentError(null);

    // Validate form
    const missingFields: string[] = [];
    if (!formData.name) missingFields.push(t('checkout.fullName'));
    if (!formData.phone) missingFields.push(t('checkout.phoneNumber'));
    if (!formData.address) missingFields.push(t('checkout.address'));
    if (!formData.thana) missingFields.push(t('checkout.thana'));
    if (!formData.division) missingFields.push('Division');

    // BD phone validation: 01[3-9]XXXXXXXX (11 digits, starts with 01, third digit 3-9)
    if (formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone)) {
      toast.error('Please enter a valid Bangladesh phone number (01XXXXXXXXX)', {
        duration: 4000,
        style: { background: '#ef4444', color: '#fff' },
      });
      return;
    }

    // District is optional - some saved addresses might not have it populated
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    // Use different loading states for COD vs payment gateways
    if (paymentMethod === 'cod') {
      setIsPlacingOrder(true);
    } else {
      setIsProcessingPayment(true);
    }
    orderPlacedRef.current = true; // Mark that we're processing an order

    try {
      const api = (await import('@/lib/api')).default;

      // Prepare order items
      const orderItems = cartItems.map(item => ({
        product_id: item.product.id,
        variant_id: item.variant?.id || item.product.variant_id || null,
        product_name: getLocalizedNameForProduct(item.product),
        product_sku: item.variant?.sku || null,
        product_image: item.product.variant_image || item.product.image_url || '/placeholder-product.png',
        unit_price: item.price || 0,
        quantity: item.quantity,
        total_price: (item.price || 0) * item.quantity,
        product_attributes: null,
      }));

      // Prepare payment details
      const paymentDetails = paymentMethod === 'sslcommerz'
        ? `Payment via SSLCommerz${selectedEmiBank > 0 ? ` (EMI - Bank ${selectedEmiBank})` : ''}`
        : paymentMethod === 'eps'
        ? 'Payment via EPS (Internet Banking, Mobile Banking, Cards)'
        : 'Cash on delivery';

      // Order data
      const orderData: Record<string, unknown> = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        shipping_address: formData.address,
        shipping_district: formData.district,
        shipping_thana: formData.thana,
        shipping_division: formData.division,
        payment_method: paymentMethod, // Send sslcommerz, backend will handle pending state
        payment_details: paymentDetails,
        notes: formData.notes || null,
        items: orderItems,
        subtotal: subtotal,
        delivery_charge: deliveryStore.charge,
        coupon_discount: couponDiscount,
        coupon_code: appliedCoupon?.code ?? null,
        total_amount: subtotal,
        payable_amount: payableTotal,
        // Affiliate tracking
        affiliate_referral_code: referralCode || null,
        affiliate_referral_id: referralId || null,
      };

      // Add customer_id and shipping_address_id if existing customer
      if (existingCustomer) {
        orderData.customer_id = existingCustomer.id;
        if (selectedAddressId) {
          orderData.shipping_address_id = selectedAddressId;
        }
      }

      // Place the order via API
      const response = await api.post('/store/orders', orderData) as Record<string, unknown>;

      // The API returns { status, message, data: { id, invoiceNo, ... } }
      const orderData_result = (response?.data || response) as Record<string, unknown>;

      if (response && orderData_result?.id) {
        const orderId = orderData_result.id as number;
        // Support both field names: invoiceNo (API) and orderNumber (legacy)
        const invoiceNo = (orderData_result.invoiceNo || orderData_result.orderNumber) as string;

        // Handle SSL Commerz payment - ONLY for sslcommerz payment method
        if (paymentMethod === 'sslcommerz') {
          // Save order items to sessionStorage before payment (for retry on fail/cancel)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('checkout_order_items', JSON.stringify({
              items: orderItems,
              orderId: orderId,
              invoiceNo: invoiceNo,
              timestamp: Date.now(),
            }));
          }

          try {
            // Initiate SSL Commerz payment
            await initiateAndPay({
              sales_order_id: orderId,
              customer_name: formData.name,
              customer_email: formData.email || undefined,
              customer_phone: formData.phone,
              customer_address: {
                address_line1: formData.address,
                address_line2: formData.thana || undefined,
                city: formData.thana || '',
                district: formData.district,
                country: 'Bangladesh',
                postal_code: undefined,
              },
              payment_method: 'sslcommerz',
              emi_option: selectedEmiBank,
            });
            // Payment initiated successfully - gateway will open in new tab
            return;
          } catch (paymentErr: unknown) {
            // Handle different error structures
            let errorMsg = 'Payment initiation failed. Please try again.';
            let isGatewayUnavailable = false;

            // Check if it's a PaymentError with message
            if (paymentErr && typeof paymentErr === 'object' && 'message' in paymentErr) {
              errorMsg = (paymentErr as { message: string }).message;
            }

            // Check for API response errors - handle multiple possible structures
            const apiErr = paymentErr as {
              response?: {
                data?: {
                  errors?: Record<string, string[]> | string;
                  message?: string;
                  error?: string;
                  gateway_unavailable?: boolean;
                  status?: boolean;
                };
                error?: string;
                message?: string;
                status?: boolean;
              };
              message?: string;
            };

            // Extract error message from different possible locations
            // Structure 1: response.data.error (nested)
            if (apiErr.response?.data?.error) {
              errorMsg = apiErr.response.data.error;
            }
            // Structure 2: response.data.message (nested)
            else if (apiErr.response?.data?.message) {
              errorMsg = apiErr.response.data.message;
            }
            // Structure 3: response.error (direct on response)
            else if (apiErr.response?.error) {
              errorMsg = apiErr.response.error;
            }
            // Structure 4: response.message (direct on response)
            else if (apiErr.response?.message) {
              errorMsg = apiErr.response.message;
            }
            // Structure 5: error property directly on thrown object
            else if (apiErr.message) {
              errorMsg = apiErr.message;
            }

            // Check if gateway is unavailable
            isGatewayUnavailable = apiErr.response?.data?.gateway_unavailable !== undefined
              ? apiErr.response.data.gateway_unavailable
              : (apiErr.response?.status === false ||
                errorMsg.toLowerCase().includes('unavailable') ||
                errorMsg.toLowerCase().includes('currently unavailable'));

            // Set payment error state instead of redirecting
            // The callback URLs should only be used when returning from the payment gateway
            setPaymentError({
              message: errorMsg,
              type: 'sslcommerz'
            });
            return;
          }
        }

        // Handle EPS payment - initiate directly and redirect to gateway
        if (paymentMethod === 'eps') {
          // Save cart items to sessionStorage before clearing cart (for retry on fail/cancel)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('checkout_cart_backup', JSON.stringify(cartItems));
          }

          try {
            // Initiate EPS payment to get gateway URL
            const paymentResponse = await api.initiateEpsPayment({
              sales_order_id: orderId,
              customer_name: formData.name,
              customer_email: formData.email || '',
              customer_phone: formData.phone,
              customer_address: {
                address_line1: formData.address,
                address_line2: formData.thana || '',
                city: formData.district || '',
                postal_code: '',
                country: 'Bangladesh',
              },
            });

            const gatewayUrl = (paymentResponse.data as any)?.gateway_url as string | undefined;

            if (gatewayUrl) {
              // Clear cart after redirect to avoid triggering the empty cart redirect useEffect
              setTimeout(() => clearCart(), 100);

              // Redirect directly to EPS gateway
              window.location.href = gatewayUrl;
              return;
            } else {
              throw new Error('Payment gateway URL not received');
            }
          } catch (paymentErr: unknown) {
            // Handle different error structures
            let errorMsg = 'Payment initiation failed. Please try again.';

            // Check if it's a PaymentError with message
            if (paymentErr && typeof paymentErr === 'object' && 'message' in paymentErr) {
              errorMsg = (paymentErr as { message: string }).message;
            }

            // Check for API response errors
            const apiErr = paymentErr as {
              response?: {
                data?: {
                  errors?: Record<string, string[]> | string;
                  message?: string;
                  error?: string;
                  gateway_unavailable?: boolean;
                  status?: boolean;
                };
                error?: string;
                message?: string;
                status?: boolean;
              };
              message?: string;
            };

            // Extract error message from different possible locations
            if (apiErr.response?.data?.error) {
              errorMsg = apiErr.response.data.error;
            } else if (apiErr.response?.data?.message) {
              errorMsg = apiErr.response.data.message;
            } else if (apiErr.response?.error) {
              errorMsg = apiErr.response.error;
            } else if (apiErr.response?.message) {
              errorMsg = apiErr.response.message;
            } else if (apiErr.message) {
              errorMsg = apiErr.message;
            }

            // Set payment error state
            setPaymentError({
              message: errorMsg,
              type: 'eps'
            });
            return;
          }
        }

        if (paymentMethod === 'cod') {
          // COD payment - Skipping payment gateways, proceeding with COD flow
        }

        // Check if API provided a redirect URL (for guest checkout or other flows)
        if (response.redirect_url || orderData_result.redirect_url) {
          const apiRedirectUrl = (response.redirect_url || orderData_result.redirect_url) as string;

          // Clear cart after redirect to avoid triggering the empty cart redirect useEffect
          setTimeout(() => clearCart(), 100);

          // Use the API-provided redirect URL
          window.location.href = apiRedirectUrl;
          return;
        }

        // Check if OTP verification is required for COD
        if (response.verification_required) {
          // Show OTP verification modal
          const phoneNumber = (orderData_result.phone_number as string) || formData.phone;
          setPendingOrder({
            id: orderId,
            order_number: invoiceNo,
            phone_number: phoneNumber,
            total_amount: orderData_result.totalAmount as number,
            customer_name: ((orderData_result.customer as Record<string, string>)?.name) || formData.name,
          });

          setShowOtpModal(true);

          // Show toast notification to alert user
          toast.success(`OTP sent to ${phoneNumber}`, {
            duration: 5000,
            icon: '📱',
          });
        } else {
          // No verification required, proceed normally
          const totalAmount = orderData_result.dueAmount as number || orderData_result.totalAmount as number;

          // Check if credentials were generated (guest checkout)
          const credentials = (orderData_result.credentials || response.credentials) as { phone?: string; password?: string } | undefined;
          const passwordParam = credentials?.password ? `&password=${encodeURIComponent(credentials.password)}` : '';

          const redirectUrl = `/order-success?invoice=${invoiceNo}&total=${totalAmount}&name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}${passwordParam}`;

          // Mark that we're navigating away to prevent cart redirect
          setIsNavigatingAway(true);

          // Clear cart after a short delay to allow navigation to start
          setTimeout(() => {
            clearCart();
            // Reset the navigation flag after a longer delay
            setTimeout(() => setIsNavigatingAway(false), 2000);
          }, 100);

          try {
            router.push(redirectUrl);
          } catch {
            // Fallback: use window.location
            setIsNavigatingAway(true); // Still mark as navigating
            window.location.href = redirectUrl;
          }
        }
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error: any) {
      console.error('[Checkout] Order placement failed:', error);

      // Reset navigation flag on error since we're not going anywhere
      setIsNavigatingAway(false);

      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        toast.error(`Validation Error: ${errorMessages.join(', ')}`, {
          duration: 5000,
          style: { background: '#ef4444', color: '#fff' },
        });
      } else if (error.response?.status === 500) {
        // Server error - show detailed error if available
        const errorMessage = error.response?.data?.message || error.response?.data?.errors?.error || 'Server error. Please contact support.';
        toast.error(errorMessage, {
          duration: 6000,
          style: { background: '#ef4444', color: '#fff' },
        });
      } else if (error.response?.status === 409) {
        // Conflict errors (duplicate phone/email)
        toast.error(error.response?.data?.message || 'This phone number or email is already registered.', {
          duration: 5000,
        });
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`, {
          duration: 5000,
        });
      } else {
        toast.error('Order placement failed. Please try again or contact support.', {
          duration: 5000,
        });
      }
    } finally {
      setIsProcessingPayment(false);
      setIsPlacingOrder(false);
      // DON'T reset orderPlacedRef here - it will be reset after navigation completes
      // The flag prevents the cart redirect useEffect from firing
    }
  };

  // Helper function to change payment method and clear errors
  const changePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaymentError(null);
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!otpCode || otpCode.length !== 5) {
      setOtpError('Please enter a valid 5-digit OTP code');
      return;
    }

    setOtpError('');
    setOtpLoading(true);

    try {
      const api = (await import('@/lib/api')).default;

      const response = await api.post('/store/orders/verify', {
        phone_number: pendingOrder?.phone_number,
        otp_code: otpCode,
        order_id: pendingOrder?.id,
      });

      // OTP verified successfully
      setShowOtpModal(false);
      orderPlacedRef.current = true;

      // Check if credentials were generated (guest checkout)
      const credentials = (response as Record<string, unknown>).credentials as { phone?: string; password?: string } | undefined;
      const passwordParam = credentials?.password ? `&password=${encodeURIComponent(credentials.password)}` : '';

      // Redirect to success page
      const successUrl = `/order-success?invoice=${pendingOrder?.order_number}&total=${pendingOrder?.total_amount}&name=${encodeURIComponent(pendingOrder?.customer_name || '')}&phone=${encodeURIComponent(pendingOrder?.phone_number || '')}${passwordParam}`;

      // Mark that we're navigating away to prevent cart redirect
      setIsNavigatingAway(true);

      // Clear cart after a short delay to allow navigation to start
      setTimeout(() => {
        clearCart();
        // Reset the navigation flag after a longer delay
        setTimeout(() => setIsNavigatingAway(false), 2000);
      }, 100);

      // Show success toast
      toast.success('Order verified successfully! Redirecting...', {
        duration: 2000,
      });

      try {
        router.push(successUrl);
      } catch {
        // Fallback: use window.location
        window.location.href = successUrl;
      }

    } catch (error: any) {
      console.error('[Checkout] OTP verification failed:', error);
      if (error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError('OTP verification failed. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setOtpError('');
    setResendLoading(true);

    try {
      const api = (await import('@/lib/api')).default;

      await api.post('/store/auth/send-otp', {
        phone_number: pendingOrder?.phone_number,
      });

      alert('OTP has been resent to your phone number.');

    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to resend OTP. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="container py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#ec3137] transition-colors">
              {t('common.home')}
            </Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/cart" className="hover:text-[#ec3137] transition-colors">
              {t('common.cart')}
            </Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">{t('checkout.title')}</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {t('checkout.title')}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('checkout.customerInfo')}
                </h2>
                
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.phoneNumber')} <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    readOnly={isAuthenticated}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${
                      isAuthenticated
                        ? 'border-gray-300 bg-gray-100 text-gray-900 font-medium cursor-not-allowed'
                        : phoneError
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137]'
                    }`}
                    placeholder={t('checkout.phoneNumberPlaceholder')}
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{phoneError}</p>
                  )}
                  {isAuthenticated && (
                    <p className="mt-1 text-xs text-gray-500">{t('checkout.prefilledFromAccount')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.fullName')} <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    readOnly={isAuthenticated}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${
                      isAuthenticated
                        ? 'border-gray-300 bg-gray-100 text-gray-900 font-medium cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137]'
                    }`}
                    placeholder={t('checkout.enterYourFullName')}
                  />
                  {isAuthenticated && (
                    <p className="mt-1 text-xs text-gray-500">{t('checkout.prefilledFromAccount')}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.email')} ({t('checkout.optional')})
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={isAuthenticated && !!user?.email}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${
                      (isAuthenticated && !!user?.email)
                        ? 'border-gray-300 bg-gray-100 text-gray-900 font-medium cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137]'
                    }`}
                    placeholder={t('checkout.emailPlaceholder')}
                  />
                  {isAuthenticated && user?.email && (
                    <p className="mt-1 text-xs text-gray-500">{t('checkout.prefilledFromAccount')}</p>
                  )}
                </div>

                {/* Searching indicator */}
                {isSearchingCustomer && (
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-800 dark:text-blue-300">
                        Searching for your account...
                      </span>
                    </div>
                  </div>
                )}

              {/* Address Selection for Logged-in Users */}
              {isAuthenticated && addresses.length > 0 && (
                <div className="md:col-span-2 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('checkout.deliveryAddress')}
                  </h3>

                  {/* Saved Addresses */}
                  <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAddress === address.id
                            ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === address.id}
                          onChange={() => handleAddressSelect(address.id)}
                          className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137] mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {address.type || t('checkout.homeAddress')} {t('checkout.address')}
                            </p>
                            {address.is_default && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                                {t('checkout.defaultAddress')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {[
                              address.addressLine1 || address.address_line1,
                              address.addressLine2 || address.address_line2,
                              address.thana || address.city,
                              address.district
                            ].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Use Different Address Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={useDifferentAddress}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setUseDifferentAddress(isChecked);
                        // When unchecking "use different address", restore form data from selected address
                        if (!isChecked && selectedAddress) {
                          const address = addresses.find(addr => addr.id === selectedAddress);
                          if (address) {
                            const addr = address as unknown as Record<string, unknown>;
                            const district = (addr.district || '') as string;
                            // Use division directly from address if available, otherwise find from district
                            let division = (addr.division || '') as string;
                            if (!division && district) {
                              division = getDivisionForDistrict(district);
                            }
                            const addressLine1 = (addr.addressLine1 || addr.address_line1 || '') as string;
                            const addressLine2 = (addr.addressLine2 || addr.address_line2 || '') as string;
                            // Combine both address lines if both exist
                            const fullAddress = addressLine2 ? `${addressLine1}, ${addressLine2}` : addressLine1;

                            setFormData(prev => ({
                              ...prev,
                              address: fullAddress,
                              thana: (addr.city || addr.thana || prev.thana) as string,
                              district: district,
                              division: division,
                            }));
                          }
                        }
                      }}
                      className="w-4 h-4 text-[#ec3137] border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-[#ec3137]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {t('checkout.useDifferentAddress')}
                    </span>
                  </label>
                </div>
              )}

              {/* Division, District, Thana Fields - Show when guest or user wants different address */}
              {(!isAuthenticated || addresses.length === 0 || useDifferentAddress) && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('checkout.division')} <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="division"
                      value={formData.division}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          division: e.target.value,
                          district: '',
                          thana: '',
                        }));
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors"
                      required
                    >
                      <option value="">{t('checkout.selectDivision')}</option>
                      {divisions.map(div => (
                        <option key={div.name} value={div.name}>{div.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('checkout.district')} <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          district: e.target.value,
                          thana: '',
                        }));
                      }}
                      disabled={!formData.division}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">{formData.division ? t('checkout.selectDistrict') : t('checkout.selectDivisionFirst')}</option>
                      {formData.division && divisions
                        .find(div => div.name === formData.division)?.districts.map(d => (
                          <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('checkout.thana')} <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="thana"
                      value={formData.thana}
                      onChange={handleInputChange}
                      disabled={!formData.district}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">{formData.district ? t('checkout.selectThana') : t('checkout.selectDistrictFirst')}</option>
                      {formData.district && getThanasForDistrict(formData.district).map(thana => (
                        <option key={thana.name} value={thana.name}>{thana.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Address Field - Show when guest or user wants different address */}
              {(!isAuthenticated || addresses.length === 0 || useDifferentAddress) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('checkout.address')} <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors"
                    placeholder={t('checkout.addressPlaceholder')}
                  />
                </div>
              )}

              {/* Selected Address Display */}
              {isAuthenticated && addresses.length > 0 && selectedAddress && !useDifferentAddress && (
                <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Selected Delivery Address:</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line">
                    {formData.address}, {formData.thana}, {formData.district}
                  </p>
                </div>
              )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('checkout.paymentMethod')}
              </h2>

              {/* Payment Error Alert - Show prominently */}
              {paymentError && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-900 dark:text-red-200 mb-1">
                        Payment Error
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-300">
                        {paymentError.message}
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-2">
                        {paymentError.type === 'eps' && 'EPS payment gateway is currently unavailable.'}
                        {paymentError.type === 'sslcommerz' && 'SSLCommerz payment gateway is currently unavailable.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setPaymentError(null)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                    >
                      ✕
                    </button>
                  </div>
                  {(paymentError?.message.toLowerCase().includes('unavailable') ||
                   paymentError?.message.toLowerCase().includes('currently unavailable')) && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setPaymentMethod('cod');
                          setPaymentError(null);
                        }}
                        className="px-3 py-1 text-sm font-semibold bg-white dark:bg-[#1a1a1a] text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Switch to Cash on Delivery
                      </button>
                      <button
                        onClick={() => setPaymentError(null)}
                        className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {/* Payment Gateway (SSLCommerz or EPS - based on active gateway) */}
                {activeGateway && (
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === activeGateway
                        ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={activeGateway}
                      checked={paymentMethod === activeGateway}
                      onChange={() => changePaymentMethod(activeGateway)}
                      className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${activeGateway === 'sslcommerz' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                        <svg className={`w-6 h-6 ${activeGateway === 'sslcommerz' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{t('checkout.paymentGateway')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('checkout.paymentGatewayDesc')}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {activeGateway === 'sslcommerz' ? (
                            <img
                              src="/SSLCommerz-Pay-With-logo-All-Size-01.png"
                              alt="SSLCommerz Payment"
                              className="h-12 w-full object-contain"
                            />
                          ) : (
                            <img
                              src="/eps-payment-all-logo.png"
                              alt="EPS Payment"
                              className="h-12 w-full object-contain"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                )}

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => changePaymentMethod('cod')}
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{t('checkout.cashOnDelivery')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('checkout.payWhenReceive')}</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden lg:sticky lg:top-24">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ec3137] to-[#8a0f12] text-white p-6">
                <h2 className="text-2xl font-bold">{t('checkout.summary')}</h2>
                <p className="text-sm text-white/90 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? t('checkout.item') : t('checkout.items')}
                </p>
              </div>

              <div className="p-6">
                {/* Cart Items with Thumbnails */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 max-h-[300px] overflow-y-auto">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.product.id}-${item.variant?.id || 'default'}`} className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <img
                            src={item.product.variant_image || item.product.image_url || '/placeholder-product.png'}
                            alt={getLocalizedNameForProduct(item.product)}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#ec3137] dark:hover:text-[#ec3137] line-clamp-2 transition-colors"
                          >
                            {getLocalizedNameForProduct(item.product)}
                          </Link>

                          {item.variant && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {item.variant.name}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                                disabled={item.quantity <= 1}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              {item.product.originalPrice && item.product.originalPrice > item.price ? (
                                <>
                                  <p className="text-sm font-bold text-[#ec3137]">
                                    ৳{(item.price || 0) * item.quantity}
                                  </p>
                                  <div className="flex items-center justify-end gap-1.5">
                                    <span className="text-xs text-gray-400 line-through">
                                      ৳{item.product.originalPrice} {t('checkout.each')}
                                    </span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      ৳{item.price || 0} {t('checkout.each')}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    ৳{(item.price || 0) * item.quantity}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    ৳{item.price || 0} {t('checkout.each')}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Cart Link */}
                  <Link
                    href="/cart"
                    className="mt-4 inline-flex items-center gap-1 text-sm text-[#ec3137] hover:underline font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t('checkout.editCart')}
                  </Link>
                </div>

                {/* Coupon Code */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    {t('checkout.applyCoupon')}
                  </h3>

                  {appliedCoupon ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-bold text-green-900 dark:text-green-100">
                              {appliedCoupon.code}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                              {appliedCoupon.type === 'percentage' && `${appliedCoupon.value}${t('checkout.percentageDiscount')}`}
                              {appliedCoupon.type === 'fixed_amount' && `৳${appliedCoupon.discountAmount}${t('checkout.fixedDiscount')}`}
                              {appliedCoupon.type === 'shipping' && t('checkout.freeShippingApplied')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-green-700 dark:text-green-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          aria-label={t('checkout.removeCoupon')}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            if (couponStore.validationErrors.code || couponStore.validationErrors.general) {
                              couponStore.clearValidationErrors();
                            }
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder={t('checkout.enterCode')}
                          className={`flex-1 px-4 py-2.5 border-2 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-colors ${
                            couponStore.validationErrors.code || couponStore.validationErrors.general
                              ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137]'
                          }`}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponStore.isValidating || !couponCode.trim()}
                          className="px-6 py-2.5 bg-[#ec3137] hover:bg-[#8a0f12] disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          {couponStore.isValidating ? (
                            <>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              {t('checkout.validating')}
                            </>
                          ) : t('checkout.apply')}
                        </button>
                      </div>

                      {/* Code-specific validation error */}
                      {couponStore.validationErrors.code && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-start gap-1">
                          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span>{couponStore.validationErrors.code[0]}</span>
                        </p>
                      )}
                      {/* General validation error (fallback) */}
                      {couponStore.validationErrors.general && !couponStore.validationErrors.code && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-start gap-1">
                          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span>{couponStore.validationErrors.general[0]}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Auto-apply coupon suggestions */}
                  {!appliedCoupon && couponStore.autoApplyCoupons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t('checkout.availableOffers')}
                      </p>
                      <div className="space-y-2">
                        {couponStore.autoApplyCoupons.map((offer) => (
                          <div
                            key={offer.code}
                            className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg"
                          >
                            <div>
                              <p className="text-xs font-bold text-blue-900 dark:text-blue-100">
                                {offer.code}
                              </p>
                              <p className="text-[10px] text-blue-700 dark:text-blue-300">
                                {offer.description || `৳${offer.discountAmount} ${t('checkout.discount')}`}
                              </p>
                            </div>
                            <button
                              onClick={() => couponStore.validateAndApply(offer.code, subtotal)}
                              disabled={couponStore.isValidating}
                              className="px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-white hover:bg-[#ec3137] dark:hover:text-white dark:hover:bg-[#ec3137] border border-blue-300 dark:border-blue-700 rounded transition-colors disabled:opacity-50"
                            >
                              {t('checkout.applyOffer')}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Free Delivery Promotion - Only show for progressive delivery mode */}
                {!freeShipping && deliveryStore.isProgressiveDelivery() && amountNeededForFreeDelivery > 0 && (
                  <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-1">
                          Almost there!
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-300" dangerouslySetInnerHTML={{
                          __html: t('checkout.addMoreForFreeShipping', { amount: amountNeededForFreeDelivery.toLocaleString() })
                        }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Progressive Delivery Display */}
                {deliveryStore.breakdown && deliveryStore.breakdown.progressive_delivery?.enabled && (
                  <div className="mb-6">
                    <ProgressiveDeliveryBreakdown
                      breakdown={deliveryStore.breakdown}
                      orderAmount={subtotal}
                    />
                  </div>
                )}

                {/* Summary Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{t('common.subtotal')}</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={subtotal} prefix="৳" duration={600} />
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        {t('checkout.couponDiscount')}
                      </span>
                      <span className="font-semibold">
                        -<AnimatedCounter value={couponDiscount} prefix="৳" duration={600} />
                      </span>
                    </div>
                  )}

                  {/* Delivery Charge - Using new DeliveryInfo component */}
                  <DeliveryInfo orderAmount={subtotal} freeShippingFromCoupon={freeShipping} />

                  {/* Service Charge */}
                  {serviceChargeSettings?.enabled && serviceCharge >= 0 && (
                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {t('checkout.serviceCharge')}
                      </span>
                      <span className="font-semibold">
                        ৳{serviceCharge.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{t('common.total')}</span>
                    <span className="text-2xl font-bold text-[#ec3137]">
                      <AnimatedCounter value={total} prefix="৳" duration={600} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{t('checkout.payableTotal')}</span>
                    <span className="text-2xl font-bold text-[#ec3137]">
                      <AnimatedCounter value={payableTotal} prefix="৳" duration={600} />
                    </span>
                  </div>
                </div>

                {/* Savings Message */}
                {totalSavings > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                    <p className="text-sm font-bold text-green-900 dark:text-green-100 text-center flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      You are saving <AnimatedCounter value={totalSavings} prefix="৳" duration={600} />
                    </p>
                  </div>
                )}

  

                {/* Terms and Conditions */}
                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-[#ec3137] focus:ring-offset-0 mt-0.5"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    {t('checkout.agreeToTerms')}{' '}
                    <Link href="/privacy-policy" className="text-[#ec3137] hover:underline font-semibold">
                      {t('footer.privacy')}
                    </Link>
                    ,{' '}
                    <Link href="/refund-policy" className="text-[#ec3137] hover:underline font-semibold">
                      {t('footer.returns')}
                    </Link>
                    ,{' '}
                    <Link href="/terms-and-conditions" className="text-[#ec3137] hover:underline font-semibold">
                      {t('footer.terms')}
                    </Link>
                  </span>
                </label>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!agreeToTerms || isProcessingPayment || isPlacingOrder || paymentLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {(isProcessingPayment || isPlacingOrder || paymentLoading) ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{(paymentMethod === 'cod' ? t('checkout.placingOrder') : t('checkout.processing'))}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{(paymentMethod === 'sslcommerz' || paymentMethod === 'eps') ? `${t('checkout.pay')} ৳${payableTotal}` : t('checkout.placeOrder')}</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{t('checkout.secureCheckout')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{t('checkout.fastDelivery')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && pendingOrder && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300 border-4 border-red-500">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowOtpModal(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              {t('checkout.confirmYourOrder')}
            </h2>

            {/* Order Number */}
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              {t('checkout.orderNumber')}{pendingOrder.order_number}
            </p>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 text-center mb-2">
                📱 OTP sent to:
              </p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100 text-center mb-2">
                {pendingOrder.phone_number}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                Please enter the 5-digit code sent to your phone number above to complete your order.
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                {t('checkout.enterOtp')}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtpCode(value);
                  setOtpError('');
                }}
                className="w-full px-4 py-4 text-2xl text-center tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors font-mono"
                placeholder={t('checkout.otpPlaceholder')}
              />
            </div>

            {/* Error Message */}
            {otpError && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-200 text-center flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {otpError}
                </p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleOtpVerification}
              disabled={otpLoading || otpCode.length !== 5}
              className="w-full py-4 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-3"
            >
              {otpLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('checkout.verifying')}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('checkout.verifyCompleteOrder')}</span>
                </>
              )}
            </button>

            {/* Resend OTP Link */}
            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-sm text-[#ec3137] hover:text-[#8a0f12] dark:hover:text-red-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resendLoading ? t('checkout.sending') : t('checkout.didntReceiveCode')}
              </button>
            </div>
          </div>
        </div>
      </>
      )}

      {/* Payment Processing Overlay - Only for payment gateways, not COD */}
      {(isProcessingPayment || paymentLoading) && (paymentMethod === 'sslcommerz' || paymentMethod === 'eps') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 border-4 border-[#ec3137]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#ec3137] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#ec3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('checkout.processingPayment')}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('checkout.pleaseWaitProcessOrder')}
            </p>

            {(paymentMethod === 'sslcommerz' || paymentMethod === 'eps') ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  {paymentMethod === 'sslcommerz' ? t('checkout.redirectingToSsl') : 'Redirecting to EPS Payment Gateway...'}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  {t('checkout.doNotCloseWindow')}
                </p>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-900 dark:text-green-100">
                  {t('checkout.placingCodOrder')}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                  {t('checkout.pleaseWaitConfirmOrder')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
