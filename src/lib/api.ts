// API Client for Hook & Hunt Storefront

import { User, Address, Category } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.166:8000/api/v2';

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

    console.log('🔍 [API_DEBUG] Request:', {
      url,
      method: options.method || 'GET',
      includeAuth,
      hasToken: !!headers['Authorization']
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      });

      console.log('🔍 [API_DEBUG] Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      const data = await response.json();

      if (!response.ok) {
        const error = {
          status: response.status,
          message: data.message || 'An error occurred',
          errors: data.errors || {},
          response: response, // Add response object for better error handling
        };

        console.log('🔍 [API_DEBUG] Error thrown:', error);

        // If unauthorized, clear auth token
        if (response.status === 401 && includeAuth) {
          console.log('🔍 [API_DEBUG] 401 Unauthorized, clearing token');
          this.removeToken();
        }

        throw error;
      }

      return data;
    } catch (error: unknown) {
      console.log('🔍 [API_DEBUG] Catch error:', error);

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

  // Generic POST method for other API calls
  async post<T = unknown>(endpoint: string, data: any, includeAuth: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, includeAuth);
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
