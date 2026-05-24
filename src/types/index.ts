// types.ts

// ✅ Customer Profile (from customer_profiles table)
export interface CustomerProfile {
  dob?: string;
  gender?: string;
  whatsapp_number?: string;
  preferred_language?: string;
  preferred_currency?: string;
  loyalty_tier?: string;
  loyalty_points?: number;
  total_orders?: number;
  total_spent?: number;
  avg_order_value?: number;
}

// ✅ User
export interface User {
  id: number;
  name: string;
  email?: string;
  // snake_case (legacy/frontend default)
  phone_number?: string;
  phone_verified_at?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  // camelCase (API response format)
  phoneNumber?: string;
  phoneVerifiedAt?: string;
  emailVerifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Common fields
  phone?: string; // Alternative field name
  role?: string;
  customer_profile?: CustomerProfile | null;
  customerProfile?: CustomerProfile | null;
  address?: string;
  thana?: string;
  district?: string;
}

// ✅ Address (from addresses table)
export interface Address {
  id: number;
  user_id?: number;
  userId?: number; // camelCase from API
  label?: string;
  // Name fields - support both formats
  full_name?: string; // snake_case (legacy)
  fullName?: string; // camelCase (API)
  // Phone - same in both
  phone: string;
  // Address fields - support both formats
  address_line1?: string; // snake_case (legacy)
  addressLine1?: string; // camelCase (API)
  address_line2?: string; // snake_case (legacy)
  addressLine2?: string; // camelCase (API)
  area?: string;
  // Type field - derived from boolean fields
  type?: 'shipping' | 'billing'; // Derived from is_shipping_address/is_billing_address
  // Location fields - support both formats
  thana?: string; // snake_case
  city?: string; // camelCase (API) - maps to thana
  district?: string;
  division?: string;
  post_code?: string; // snake_case (legacy)
  postalCode?: string; // camelCase (API)
  country?: string;
  // Boolean flags - support both formats
  is_default?: boolean; // snake_case (legacy)
  isDefault?: boolean; // camelCase (API)
  is_billing_address?: boolean; // snake_case (legacy)
  isBillingAddress?: boolean; // camelCase (API)
  is_shipping_address?: boolean; // snake_case (legacy)
  isShippingAddress?: boolean; // camelCase (API)
  // Timestamps - support both formats
  created_at?: string; // snake_case (legacy)
  createdAt?: string; // camelCase (API)
  updated_at?: string; // snake_case (legacy)
  updatedAt?: string; // camelCase (API)
  deleted_at?: string | null;
  deletedAt?: string | null;
}

// ✅ Simplified Product for Cart (only essential fields)
export interface CartProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // Added for savings calculation
  image_url: string; // Updated from 'image' to 'image_url'
  image_id?: number; // New field
  slug: string;
  stock: number;
  variant_id?: number;
  variant_name?: string;
  variant_image?: string; // Variant-specific image if different from main product image
  category_id?: number | null; // Category for coupon validation
}

// ✅ Cart Item
export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
  price: number;
  variant?: {
    id: number;
    name: string;
    sku: string;
    price: number;
    [key: string]: unknown;
  };
}

// ✅ Purchase Item
export interface PurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  variant_id?: number | null;
  rmb_price: number;
  quantity: number;
  total_cost_bdt: number;
  created_at: string;
  updated_at: string;
}

// ✅ Sale Item
export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  variant_id?: number | null;
  rate: number;
  quantity: number;
  weight: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

// ✅ Supplier
export interface Supplier {
  id: number;
  shop_name: string;
  wechat: string;
  country: string;
  created_at: string;
  updated_at: string;
}

// ✅ Category
export interface CategoryImage {
  id: number;
  folder_id?: number | null;
  filename: string;
  original_filename?: string;
  path: string;
  url: string;
  full_url?: string;  // snake_case (legacy)
  fullUrl?: string;   // camelCase (API response)
  mime_type?: string;
  width?: number;
  height?: number;
  size?: number;
  alt_text?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  image_id?: number | null; // Standardized field
  is_active?: number;
  sort_order?: number;
  products_count?: number;
  parent?: Category | null;
  image?: CategoryImage | string | null;
  children?: Category[];
  created_at?: string;
  updated_at?: string;

  // Standardized image field (API response format)
  image_url?: string;   // Full URL to category image
}

// ✅ Product
export interface Product {
  id: number;
  product_code: string | null; // internal unique code

  // 🏷️ Basic Info
  title: string;
  slug: string;
  sku: string;
  description: string;
  short_description?: string;
  supplier_id: number;
  product_link: string;
  category_id: number;
  brand: string;
  tags: string[];

  // 🖼️ Media - Standardized fields
  image_url?: string; // Main product image URL (snake_case format)
  imageUrl?: string; // Main product image URL (camelCase format - actual API response)
  image_id?: number; // Main image ID (snake_case format)
  imageId?: number; // Main image ID (camelCase format - actual API response)
  gallery_images?: GalleryImage[]; // Gallery images (new structure)

  // ⚙️ Physical Info
  weight: number;
  unit: string;

  // 💱 Import Pricing
  cost_rmb: number;
  exchange_rate: number;
  cost_bdt: number;

  // 💰 Sale Pricing
  actual_price: number;
  default_price: number;
  compare_at_price: number;
  price_wholesale: number;
  price_retail: number;
  price_daraz: number;

  // 🏷️ Channel-specific Names
  name_wholesale?: string;
  name_retail?: string;
  name_daraz?: string;

  // 📦 Inventory
  inventory_quantity: number;
  inventory_policy: 'continue' | 'deny';
  has_variants: boolean;
  status: 'active' | 'inactive' | 'draft';
  featured?: boolean;   // Featured product flag
  is_trending?: boolean; // Trending product flag
  view_count?: number;  // Product view count for social proof

  // 📦 Additional Identifiers
  barcode: string;
  hs_code: string;

  // 🔍 SEO
  seo_title: string;
  seo_description: string;
  search_keywords?: string[];

  // 🕓 System
  created_at: string;
  updated_at: string;

  // 🎨 Display properties (for UI components)
  name?: string;        // Alias for title (English)
  nameBn?: string | null;      // Bangla name
  price?: number;       // Alias for actual_price
  originalPrice?: number; // Alias for compare_at_price
  image?: string;       // Legacy alias for featured_image
  stock?: number;       // Alias for inventory_quantity
  rating?: number;      // Product rating (1-5)
  reviews?: number;     // Number of reviews
  category?: string;    // Category name (for display)
  variant_count?: number; // Number of variants
  price_range_display?: string; // Price range display text
  has_offer?: boolean;  // Whether product has offers
  thumbnail_url?: string; // Legacy - use image_url instead
  gallery?: string[];   // Legacy - use gallery_images instead
  featured_image?: string; // Legacy - use image_url instead
  price_range?: {       // Price range object
    min: string;
    max: string;
    display: string;
  };
  categories?: Category[]; // Product categories
  variants?: ProductVariant[]; // Product variants
  meta_title?: string; // SEO meta title
  meta_description?: string; // SEO meta description

  // 🌐 Language-specific content (Bangla only - English fields are in Basic Info section)
  descriptionBn?: string | null; // Bangla description
  shortDescriptionBn?: string | null; // Bangla short description
  includesInBox?: string[] | null; // English includes box items
  includesInBoxBn?: string[] | null; // Bangla includes box items
  highlights?: string[] | null; // English highlights
  highlightsBn?: string[] | null; // Bangla highlights
}

// ✅ Gallery Image (new standardized structure)
export interface GalleryImage {
  image_url: string;
  image_id?: number;
}


// ✅ Product Variant
export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  sku: string;
  price: number;
  compare_at_price: number;
  cost_price: number;
  inventory_quantity: number;
  weight: number;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  image_url: string; // Updated from 'image' to 'image_url'
  image_id?: number; // New field
  barcode: string;
  created_at: string;
  updated_at: string;
}

// ✅ Customer
export interface Customer {
  id: number;
  name: string;
  location: string;
  mobile: string;
  point: number;
  created_at: string;
  updated_at: string;
}

// ✅ Purchase
export interface Purchase {
  id: number;
  supplier_id: number;
  invoice_no: string;
  date: string;
  tracking_no: string;
  courier_name: string;
  received_at_china: string;
  received_at_bd: string;
  exchange_rate: number;
  shipping_cost: number;
  note: string;
  created_at: string;
  updated_at: string;
}

// ✅ Purchase Item
export interface PurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  product_variant_id?: number | null;
  rmb_price: number;
  quantity: number;
  total_cost_bdt: number;
  created_at: string;
  updated_at: string;
}

// ✅ Sale
export interface Sale {
  id: number;
  customer_id: number;
  order_no: string;
  date: string;
  tracking_code: string;
  courier_name: string;
  cod_charge: number;
  discount: number;
  shipping_charge: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// ✅ Sale Item
export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_variant_id?: number | null;
  rate: number;
  quantity: number;
  weight: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

// ✅ Slider (from /store/sliders API)
export interface Slider {
  // Media type: 'image' or 'video'
  media_type?: 'image' | 'video';

  // Image/Video URLs (standardized)
  image_url?: string | null; // Full URL for image sliders
  video_url?: string | null; // YouTube/embed URL for video sliders

  // Content
  capsule_title?: string | null;
  title?: string;
  sub_title?: string;
  features?: string | null;
  features_list?: string[];
  cta1_label?: string | null;
  cta1_link?: string | null;
  cta2_label?: string | null;
  cta2_link?: string | null;
  sort_order?: number;

  // Legacy camelCase aliases (for backward compatibility)
  imageUrl?: string | null;
  videoUrl?: string | null;
  capsuleTitle?: string | null;
  subTitle?: string | null;
  featuresList?: string[];
  cta1Label?: string | null;
  cta1Link?: string | null;
  cta2Label?: string | null;
  cta2Link?: string | null;
  sortOrder?: number;
}

// ========================================
// New Product Module Types (table.txt)
// ========================================

// 1. Products Table - Stores basic, static details about the root product
export interface ProductNew {
  product_id: number;
  name_internal: string; // Primary reference name for the product
  description: string; // Full product description/details
  base_unit: string; // Unit of measure (e.g., 'pcs', 'box')
  status: 'Active' | 'Draft' | 'Discontinued';
  created_at: string;
  updated_at: string;
}

// 2. Variations Table - Represents a unique, purchasable/sellable SKU
export interface Variation {
  variation_id: number;
  product_id: number; // FK to Products
  sku: string; // Unique Stock Keeping Unit
  attributes_json: string; // JSON string: { "Color": "Red", "Size": "L" }
  unit_weight_g: number; // Weight in grams
  created_at: string;
  updated_at: string;
}

// 3. Pricing Table - Manages multi-channel display name and price for a specific SKU
export interface Pricing {
  pricing_id: number;
  variation_id: number; // FK to Variations
  channel: 'Retail' | 'Wholesale' | 'Daraz' | 'Internal'; // Selling channel
  display_name: string; // Product name used for this channel
  actual_price: number; // Default, non-discounted selling price
  offer_price: number; // Current promotional or sale price
  created_at: string;
  updated_at: string;
}

// 4. Inventory Table - Tracks the current available stock for each SKU
export interface Inventory {
  inventory_id: number;
  variation_id: number; // FK to Variations
  current_stock: number; // Quantity currently available for sale
  reserved_stock: number; // Quantity held for pending orders
  last_purchase_cost_bdt: number; // Last recorded Landed Cost (COGS) in BDT
  updated_at: string;
}

// ========================================
// Payment Types (SSL Commerz)
// ========================================

// Re-export payment types from payment.ts for convenience
export type {
  CustomerAddress,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentStatusResponse,
  PaymentStatusType,
  EmiOption,
  EmiOptionsResponse,
  PaymentCallbackResponse,
  PaymentError,
  PaymentErrorType,
} from './payment';

// ========================================
// Review Types
// ========================================

export interface ReviewProduct {
  id: number;
  name: string;
  slug: string;
  image_url?: string; // Product image URL
  image_id?: number; // Product image ID
}

export interface ReviewScreenshot {
  id: number;
  full_url: string;
}

export interface Review {
  id: number;
  screenshot_id: number | null;
  review_text: string;
  rating: number; // 1-5 stars
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  screenshot: ReviewScreenshot | null;
  screenshot_url?: string | null; // Legacy field
  image_url?: string; // Standardized field (review screenshot)
  image_id?: number; // Image ID
  products: ReviewProduct[];
}

export interface ReviewFilters {
  rating?: number;
  product_id?: number;
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
  };
}

// ========================================
// Order Types
// ========================================

export interface OrderItem {
  id: number;
  variantId?: number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  total_price_formatted?: string;
  productName?: string;
  variantName?: string;
  sku?: string;
  // Standardized image field
  image_url: string;
  image_id?: number;
  // Legacy fields (for backward compatibility)
  image?: string;
  thumbnail_url?: string;
  thumbnailUrl?: string;
  thumbnail_path?: string;
  thumbnailPath?: string;
  product_image?: string;
  productImage?: string;
}

export interface ShippingInfo {
  address: string;
  city?: string | null;
  district: string;
  division?: string;
  thana?: string;
}

export interface Order {
  id: number;
  orderNumber?: string;
  order_number?: string;
  invoiceNo?: string;
  invoice_no?: string;
  status: string;
  paymentStatus?: string;
  payment_status?: string;
  subTotal?: number;
  totalAmount?: number;
  deliveryCharge?: number;
  paidAmount?: number;
  dueAmount?: number;
  shipping?: ShippingInfo;
  items: OrderItem[];
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
}
