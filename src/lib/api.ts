// API Client for Hook & Hunt Storefront

import { User, Address, Category, Slider } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://probesh.hooknhunt.com/api/v2';

interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_token', token);
      // Also set cookie for middleware-based route protection
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Also remove cookie
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    }
  }

  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(includeAuth) as Record<string, string>;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const error = {
          status: response.status,
          message: data.message || 'An error occurred',
          errors: data.errors || {},
          response: response, // Add response object for better error handling
        };

        // If unauthorized, clear auth token
        if (response.status === 401 && includeAuth) {
          this.removeToken();
        }

        throw error;
      }

      return data;
    } catch (error: unknown) {

      // If it's a network error (not a response from server)
      const networkError = error as { response?: unknown; status?: number };
      if (!networkError.response && !networkError.status) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
          errors: {},
          response: null
        };
      }

      throw error;
    }
  }

  // Auth endpoints
  async register(phone: string, password: string, name?: string): Promise<ApiResponse> {
    return this.request('/store/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        password,
        password_confirmation: password,
        name
      }),
    });
  }

  async sendOtp(phone: string): Promise<ApiResponse> {
    return this.request('/store/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<{ user: User; access_token?: string; token?: string }>> {
    const response = await this.request<{ user: User; access_token?: string; token?: string }>('/store/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });

    // Store token if verification successful (check both possible response structures)
    const token = response.data?.access_token || response.data?.token || (response as { access_token?: string; token?: string })?.access_token || (response as { token?: string })?.token;
    if (token) {
      this.setToken(token);
    }

    return response;
  }

  async sendResetOtp(phone: string): Promise<ApiResponse<{ message: string; otp_code?: string }>> {
    return this.request<{ message: string; otp_code?: string }>('/store/auth/send-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async resetPassword(phone: string, otp: string, password: string, passwordConfirmation: string): Promise<ApiResponse> {
    return this.request('/store/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        otp,
        password,
        password_confirmation: passwordConfirmation
      }),
    });
  }

  async login(phone: string, password: string): Promise<ApiResponse<{ user: User; access_token?: string; token?: string }>> {
    const response = await this.request<{ user: User; access_token?: string; token?: string }>('/store/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login_id: phone, password }),
    });

    // Store token if login successful (check both possible response structures)
    const token = response.data?.access_token || response.data?.token || (response as { access_token?: string; token?: string })?.access_token || (response as { token?: string })?.token;
    if (token) {
      this.setToken(token);
    }

    return response;
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/store/account/me', {}, true);
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/store/account/logout', {
      method: 'POST',
    }, true);

    this.removeToken();
    return response;
  }

  async updateProfile(data: { name?: string; email?: string; whatsapp_number?: string; address?: string; city?: string; district?: string }): Promise<ApiResponse> {
    return this.request('/store/account/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true);
  }

  // Address endpoints
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return this.request('/store/account/addresses', {}, true);
  }

  async addAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse> {
    return this.request('/store/account/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }, true);
  }

  async updateAddress(addressId: number, address: Partial<Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse> {
    return this.request(`/store/account/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }, true);
  }

  async deleteAddress(addressId: number): Promise<ApiResponse> {
    return this.request(`/store/account/addresses/${addressId}`, {
      method: 'DELETE',
    }, true);
  }

  async getOrders(): Promise<ApiResponse> {
    return this.request('/store/account/orders', {}, true);
  }

  async getOrder(orderId: number | string): Promise<ApiResponse> {
    return this.request(`/store/account/orders/${orderId}`, {}, true);
  }

  // Public: Get order by order number (for payment page)
  async getOrderByOrderNumber(orderNumber: string): Promise<ApiResponse> {
    return this.request(`/store/orders/${orderNumber}`, {});
  }

  // Public: Initiate EPS payment directly
  async initiateEpsPayment(data: {
    sales_order_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: {
      address_line1: string;
      address_line2: string;
      city: string;
      postal_code: string;
      country: string;
    };
  }): Promise<ApiResponse> {
    return this.request('/store/payments/eps/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Authenticated: Order summary (stats + recent orders)
  async getOrderSummary(): Promise<ApiResponse> {
    return this.request('/store/account/orders/summary', {}, true);
  }

  // Public: Categories (paginated — returns { data: { data: Category[], ... } })
  async getCategories(): Promise<ApiResponse<{ data: Category[]; total: number }>> {
    return this.request('/store/categories', {});
  }

  // Public: Products (paginated with filters)
  async getProducts(params?: {
    category_id?: number;
    search?: string;
    sort_by?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{ data: unknown[]; total: number; last_page: number; current_page: number; next_page_url: string | null }>> {
    const query = new URLSearchParams();
    if (params?.category_id) query.set('category_id', String(params.category_id));
    if (params?.search) query.set('search', params.search);
    if (params?.sort_by) query.set('sort_by', params.sort_by);
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    const qs = query.toString();
    return this.request(`/store/products${qs ? `?${qs}` : ''}`, {});
  }

  // Public: Single product by slug
  async getProduct(slug: string): Promise<ApiResponse> {
    return this.request(`/store/products/${slug}`, {});
  }

  // Public: Related products
  async getRelatedProducts(slug: string, limit: number = 6): Promise<ApiResponse> {
    return this.request(`/store/products/${slug}/related?limit=${limit}`, {});
  }

  // Public: Hot deals products
  async getHotDeals(limit: number = 12): Promise<ApiResponse> {
    return this.request(`/store/products/hot-deals?limit=${limit}`, {});
  }

  // Public: Sliders for home page banner
  async getSliders(): Promise<ApiResponse<Slider[]>> {
    return this.request('/store/sliders', {});
  }

  // Contact Form Submission (Public Endpoint)
  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    priority?: string;
  }): Promise<ApiResponse<{ lead_id?: number; message: string }>> {
    return this.request('/public/contact/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Coupon endpoints (authenticated for user-specific rules)
  async validateCoupon(code: string, cartTotal: number, productIds?: number[], categoryIds?: number[]): Promise<ApiResponse> {
    return this.request('/store/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({
        code,
        cart_total: cartTotal,
        product_ids: productIds || [],
        category_ids: categoryIds || [],
      }),
    }, true); // Include auth for per-customer limits, first-purchase checks
  }

  async getAutoApplyCoupons(cartTotal: number, productIds?: number[], categoryIds?: number[]): Promise<ApiResponse> {
    const params = new URLSearchParams({ cart_total: String(cartTotal) });
    if (productIds?.length) params.set('product_ids', productIds.join(','));
    if (categoryIds?.length) params.set('category_ids', categoryIds.join(','));
    return this.request(`/store/coupons/auto-apply?${params.toString()}`, {}, true);
  }

  // Thank-you product (public)
  async getThankYouProducts(limit: number = 1): Promise<ApiResponse> {
    return this.request(`/store/thank-you-products?limit=${limit}`, {});
  }

  // Add thank-you product to existing order (public, 1-min window)
  async addThankYouToOrder(invoiceNo: string, productId: number): Promise<ApiResponse> {
    return this.request(`/store/orders/${invoiceNo}/thank-you`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  // ==================== Tracking Scripts (Public) ====================

  /**
   * Get tracking scripts configuration (Facebook Pixel, GA, GTM)
   * GET /website/tracking
   */
  async getTrackingSettings(): Promise<ApiResponse<{
    facebook: {
      pixelId: string | null;
      pixelCode: string | null;
    };
    google: {
      analyticsId: string | null;
      analyticsCode: string | null;
      tagManagerId: string | null;
      tagManagerCode: string | null;
    };
  }>> {
    return this.request('/website/tracking', {});
  }

  /**
   * Calculate delivery charge based on weight and location
   * POST /public/calculate-delivery
   */
  async calculateDeliveryCharge(data: {
    weight: number;
    division: string;
    order_amount?: number;
  }): Promise<ApiResponse<{
    charge: number;
    breakdown: {
      total_weight: number;
      base_weight: number;
      zone: string;
      is_inside_dhaka: boolean;
      is_flat_rate: boolean;
      base_charge: number;
      additional_kg: number;
      per_kg_rate: number;
      total_charge: number;
      free_delivery: boolean;
      progressive_delivery: {
        enabled: boolean;
        order_amount?: number;
        min_amount?: number;
        discount_percentage?: number;
        discount_amount?: number;
        amount_needed_for_free?: number;
        is_free?: boolean;
        motivational_message?: string;
      };
    };
  }>> {
    return this.request('/public/calculate-delivery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== Payment Methods (SSL Commerz & EPS) ====================

  /**
   * Initiate payment for an order
   * Routes to SSLCommerz or EPS based on payment_method
   * POST /store/payments/initiate
   */
  async initiatePayment(data: {
    sales_order_id: number;
    customer_name: string;
    customer_email?: string;
    customer_phone: string;
    customer_address: {
      address_line1: string;
      address_line2?: string;
      city?: string;
      district?: string;
      country: string;
      postal_code?: string;
    };
    payment_method?: 'cod' | 'sslcommerz' | 'eps';
    emi_option?: number;
  }): Promise<ApiResponse<{
    payment_id: number;
    gateway_url: string;
    tran_id: string;
    amount: number;
    currency: string;
    sandbox: boolean;
  }>> {
    return this.request('/store/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get EMI options for a payment amount
   * POST /store/payments/emi-options
   */
  async getEmiOptions(amount: number): Promise<ApiResponse<{
    amount: number;
    currency: string;
    emi_enabled: boolean;
    min_amount: number;
    options: Array<{
      tenure: number;
      interest_rate: number;
      monthly_payment: number;
      total_amount: number;
      total_interest: number;
    }>;
    banks: Record<number | string, string>;
  }>> {
    return this.request('/store/payments/emi-options', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  /**
   * Get payment status by transaction ID
   * GET /store/payments/status/{tran_id}
   */
  async getPaymentStatus(tranId: string): Promise<ApiResponse<{
    payment_id: number;
    tran_id: string;
    amount: number;
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';
    paid_at?: string;
    order_id: number;
    order_invoice: string;
    order_payment_status: 'unpaid' | 'paid' | 'partial';
  }>> {
    return this.request(`/store/payments/status/${tranId}`, {}, true);
  }

  /**
   * Verify payment callback from SSL Commerz
   * POST /store/payments/callback
   */
  async verifyPaymentCallback(callbackData: Record<string, unknown>): Promise<ApiResponse<{
    payment_id: number;
    tran_id: string;
    order_id: number;
    order_invoice: string;
    amount: number;
    status: string;
    callback_type: 'success' | 'fail' | 'cancel';
  }>> {
    return this.request('/store/payments/callback', {
      method: 'POST',
      body: JSON.stringify(callbackData),
    });
  }

  /**
   * Get active payment gateway configuration (public endpoint)
   * Returns which gateway is currently active (sslcommerz, eps, or null)
   * GET /api/v2/public/payment/gateway
   */
  async getActivePaymentGateway(): Promise<ApiResponse<{
    activeGateway: 'sslcommerz' | 'eps' | null;
  }>> {
    return this.request('/public/payment/gateway');
  }

  // Generic POST method for other API calls
  async post<T = unknown>(endpoint: string, data: unknown, includeAuth: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, includeAuth);
  }

  // Search products suggestions
  async searchSuggestions(query: string): Promise<ApiResponse<{ suggestions: Array<{
    id: number;
    name: string;
    slug: string;
    image: string | null;
    category: string | null;
    price: number | null;
  }> }>> {
    return this.request(`/public/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Search products
  async searchProducts(params: {
    q: string;
    category_id?: number;
    per_page?: number;
    page?: number;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.q);
    if (params.category_id) searchParams.append('category_id', params.category_id.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.page) searchParams.append('page', params.page.toString());

    return this.request(`/public/search?${searchParams.toString()}`);
  }

  // Review endpoints (public)
  async getReviews(params?: { page?: number; per_page?: number; rating?: number; product_id?: number }): Promise<ApiResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    if (params?.rating) query.set('rating', String(params.rating));
    if (params?.product_id) query.set('product_id', String(params.product_id));
    const qs = query.toString();
    return this.request(`/store/reviews${qs ? `?${qs}` : ''}`, {});
  }

  async getProductReviews(productSlug: string, params?: { page?: number; per_page?: number; rating?: number }): Promise<ApiResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    if (params?.rating) query.set('rating', String(params.rating));
    const qs = query.toString();
    return this.request(`/store/reviews/product/${productSlug}${qs ? `?${qs}` : ''}`, {});
  }

  async getFeaturedReviews(limit: number = 6): Promise<ApiResponse> {
    return this.request(`/store/reviews/featured?limit=${limit}`, {});
  }

  // ==================== Admin Review Endpoints ====================

  /**
   * Generic request method for admin endpoints (authenticated)
   * Use this for admin operations that need authentication
   */
  async adminRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, options, true);
  }

  /**
   * Get all reviews (admin endpoint - includes unapproved/management data)
   * GET /api/v2/website-admin/reviews
   */
  async getAdminReviews(params?: {
    page?: number;
    per_page?: number;
    rating?: number;
    product_id?: number;
    search?: string;
  }): Promise<ApiResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    if (params?.rating) query.set('rating', String(params.rating));
    if (params?.product_id) query.set('product_id', String(params.product_id));
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();

    return this.adminRequest(`/website-admin/reviews${qs ? `?${qs}` : ''}`);
  }

  /**
   * Create a new review (admin endpoint)
   * POST /api/v2/website-admin/reviews
   */
  async createReview(data: {
    screenshot_id?: number | null;
    review_text: string;
    rating: number;
    is_featured?: boolean;
    sort_order?: number;
    product_ids?: number[];
  }): Promise<ApiResponse> {
    return this.adminRequest('/website-admin/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a review (admin endpoint)
   * PUT /api/v2/website-admin/reviews/{id}
   */
  async updateReview(
    reviewId: number,
    data: {
      screenshot_id?: number | null;
      review_text?: string;
      rating?: number;
      is_featured?: boolean;
      sort_order?: number;
      product_ids?: number[];
    }
  ): Promise<ApiResponse> {
    return this.adminRequest(`/website-admin/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a review (admin endpoint)
   * DELETE /api/v2/website-admin/reviews/{id}
   */
  async deleteReview(reviewId: number): Promise<ApiResponse> {
    return this.adminRequest(`/website-admin/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Toggle featured status of a review (admin endpoint)
   * PUT /api/v2/website-admin/reviews/{id}/toggle-featured
   */
  async toggleReviewFeatured(reviewId: number): Promise<ApiResponse> {
    return this.adminRequest(`/website-admin/reviews/${reviewId}/toggle-featured`, {
      method: 'PUT',
    });
  }

  /**
   * Update sort order for multiple reviews (admin endpoint)
   * POST /api/v2/website-admin/reviews/sort-order
   */
  async updateReviewSortOrder(reviews: Array<{ id: number; sort_order: number }>): Promise<ApiResponse> {
    return this.adminRequest('/website-admin/reviews/sort-order', {
      method: 'POST',
      body: JSON.stringify({ reviews }),
    });
  }

  // Helper to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Clear authentication
  clearAuth(): void {
    this.removeToken();
  }
}

// Export singleton instance
const api = new ApiClient(API_BASE_URL);
export default api;
