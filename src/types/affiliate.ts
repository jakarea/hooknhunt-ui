/**
 * Affiliate Module Types
 * All types for the affiliate system
 */

// ====================================================
// CORE TYPES
// ====================================================

export interface Affiliate {
  id: number;
  user_id: number;
  referral_code: string;
  referral_link: string;
  commission_rate: number;
  total_earned: number;
  withdrawn_amount: number;
  available_balance: number;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  is_approved: boolean;
  created_at: string;
  approved_at?: string;
  last_conversion_at?: string;
  // Additional fields from API
  referralCode?: string;
  commissionRate?: number;
  totalEarned?: number;
  withdrawnAmount?: number;
  availableBalance?: number;
  totalClicks?: number;
  totalConversions?: number;
  conversionRateValue?: number;
  isApproved?: boolean;
}

export interface AffiliateReferral {
  id: number;
  affiliate_id: number;
  referral_code: string;
  ip_address: string | null;
  user_agent: string | null;
  landing_page: string | null;
  clicked_at: string;
  converted_at: string | null;
  sales_order_id: number | null;
  order_amount: number | null;
  commission_amount: number | null;
  status: 'clicked' | 'converted' | 'cancelled';
  customer_id?: number | null;
  customer_name?: string | null;
  customer_email?: string | null;
}

export interface AffiliateEarning {
  id: number;
  affiliate_id: number;
  sales_order_id: number;
  order_invoice: string;
  order_amount: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  customer_id?: number | null;
  customer_name?: string | null;
  customer_email?: string | null;
}

export interface AffiliatePayout {
  id: number;
  affiliate_id: number;
  amount: number;
  payment_method: 'bank_transfer' | 'bkash' | 'nagad' | 'rocket' | 'other';
  payment_details: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  admin_notes: string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ProductCommission {
  id: number;
  product_id: number;
  product_name: string;
  commission_rate: number;
  is_active: boolean;
  type: 'global' | 'specific';
  affiliate_id?: number | null;
}

export interface CategoryCommission {
  id: number;
  category_id: number;
  category_name: string;
  commission_rate: number;
  is_active: boolean;
  type: 'global' | 'specific';
  affiliate_id?: number | null;
}

// ====================================================
// API REQUEST TYPES
// ====================================================

export interface AffiliateApplicationRequest {
  name: string;
  phone: string;
  email: string;
  address?: string;
  why_join?: string;
}

export interface PayoutRequest {
  amount: number;
  payment_method: 'bank_transfer' | 'bkash' | 'nagad' | 'rocket' | 'other';
  payment_details: string;
}

export interface AffiliateDashboardParams {
  period?: '7days' | '30days' | '90days' | '1year';
}

// ====================================================
// API RESPONSE TYPES
// ====================================================

export interface AffiliateCheckResponse {
  success: boolean;
  isAffiliate: boolean;
  data?: {
    id: number;
    referralCode: string;
    commissionRate: number;
    isApproved: boolean;
  };
}

export interface AffiliateApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    affiliate_id: number;
    referralCode: string;
    referral_link: string;
    isApproved: boolean;
  };
}

export interface PeriodStats {
  period: '7days' | '30days' | '90days' | '1year';
  clicks: number;
  conversions: number;
  earnings: number;
  conversion_rate: number;
}

export interface AffiliateDashboardResponse {
  success: boolean;
  data: {
    affiliate: Affiliate;
    period_stats?: PeriodStats;
    recent_referrals: AffiliateReferral[];
    recent_earnings: AffiliateEarning[];
    recent_payouts?: AffiliatePayout[];
    product_commissions: ProductCommission[];
    category_commissions: CategoryCommission[];
  };
}

export interface PayoutRequestResponse {
  success: boolean;
  message: string;
  data?: {
    payout_id: number;
    amount: number;
    status: string;
  };
}

// ====================================================
// UI STATE TYPES
// ====================================================

export interface AffiliateStats {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  product_image?: string | null;
  referrals: number;
  earnings: string;
  commission: string;
  commission_rate: number;
}

// ====================================================
// ERROR TYPES
// ====================================================

export interface AffiliateError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  type?: 'validation' | 'auth' | 'server' | 'network';
}

// ============================================================
// ADMIN AFFILIATE TYPES
// ============================================================

export interface AdminAffiliateListResponse {
  success: boolean;
  data: {
    affiliates: AdminAffiliate[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}

export interface AdminAffiliate {
  id: number;
  user_id: number;
  referral_code: string;
  commission_rate: number;
  total_earned: number;
  withdrawn_amount: number;
  available_balance: number;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  is_approved: boolean;
  rejection_reason?: string;
  admin_notes?: string;
  approved_at?: string;
  approved_by?: number;
  created_at: string;
  updated_at: string;
  // User info
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface AdminAffiliateStatsResponse {
  success: boolean;
  data: AdminAffiliateStats;
}

export interface AdminAffiliateStats {
  total_affiliates: number;
  active_affiliates: number;
  pending_affiliates: number;
  rejected_affiliates: number;
  total_earned: number;
  total_withdrawn: number;
  total_pending_payouts: number;
  total_completed_payouts: number;
  total_clicks: number;
  total_conversions: number;
  this_month_earnings: number;
  this_month_clicks: number;
}

export interface AffiliateActionResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    is_approved: boolean;
    rejection_reason?: string;
  };
}

export interface AdminAffiliateDetailsResponse {
  success: boolean;
  data: {
    affiliate: AdminAffiliate;
    recent_earnings: any[];
    recent_referrals: any[];
    recent_payouts: any[];
    product_commissions: any[];
    category_commissions: any[];
  };
}

export interface UpdateAffiliateRequest {
  commission_rate?: number;
  admin_notes?: string;
  is_approved?: boolean;
  referral_code?: string;
}

export interface AffiliateListParams {
  page?: number;
  status?: 'all' | 'pending' | 'approved' | 'rejected';
  search?: string;
  per_page?: number;
}
