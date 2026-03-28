(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    theme: 'light',
    toggleTheme: ()=>{}
});
function ThemeProvider({ children }) {
    _s();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            setMounted(true);
            // Force light mode by clearing any existing dark theme
            localStorage.removeItem('theme');
            setTheme('light');
            // Remove dark class and update CSS variables
            document.documentElement.classList.remove('dark');
            document.documentElement.style.setProperty('--background', '#ffffff');
            document.documentElement.style.setProperty('--foreground', '#171717');
            // Also update body styles directly
            document.body.style.background = '#ffffff';
            document.body.style.color = '#171717';
            document.body.classList.remove('dark');
            // Debug: Log the current state
            console.log('Theme initialized to light mode');
            console.log('HTML classes:', document.documentElement.className);
            console.log('Body classes:', document.body.className);
        }
    }["ThemeProvider.useEffect"], []);
    const toggleTheme = ()=>{
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.setProperty('--background', '#0a0a0a');
            document.documentElement.style.setProperty('--foreground', '#ededed');
            document.body.style.background = '#0a0a0a';
            document.body.style.color = '#ededed';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.setProperty('--background', '#ffffff');
            document.documentElement.style.setProperty('--foreground', '#171717');
            document.body.style.background = '#ffffff';
            document.body.style.color = '#171717';
        }
    };
    // Prevent hydration mismatch
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
            value: {
                theme: 'light',
                toggleTheme
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/src/contexts/ThemeContext.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            toggleTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/ThemeContext.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "YCKE2uRMIshh/+RpyjK2SrKjidc=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/CartContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isCartOpen, setIsCartOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load cart from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error('Failed to load cart from localStorage:', error);
                }
            }
        }
    }["CartProvider.useEffect"], []);
    // Save cart to localStorage whenever it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }["CartProvider.useEffect"], [
        cartItems
    ]);
    const addToCart = (product, quantity = 1)=>{
        setCartItems((prevItems)=>{
            // Check if exact same product variant already exists
            const existingItem = prevItems.find((item)=>item.product.id === product.id && item.product.variant_id === product.variant_id);
            if (existingItem) {
                // Update quantity if exact same item exists
                return prevItems.map((item)=>item.product.id === product.id && item.product.variant_id === product.variant_id ? {
                        ...item,
                        quantity: Math.min(item.quantity + quantity, product.stock || 999)
                    } : item);
            } else {
                // Add new item with unique ID
                const newCartItem = {
                    id: Date.now(),
                    product,
                    quantity,
                    price: product.price || 0,
                    variant: product.variant_id ? {
                        id: product.variant_id,
                        name: product.variant_name || '',
                        sku: '',
                        price: product.price || 0
                    } : undefined
                };
                return [
                    ...prevItems,
                    newCartItem
                ];
            }
        });
        // Open cart sidebar when item is added
        setIsCartOpen(true);
    };
    const removeFromCart = (cartItemId)=>{
        setCartItems((prevItems)=>prevItems.filter((item)=>item.id !== cartItemId));
    };
    const updateQuantity = (cartItemId, quantity)=>{
        if (quantity <= 0) {
            removeFromCart(cartItemId);
            return;
        }
        setCartItems((prevItems)=>prevItems.map((item)=>item.id === cartItemId ? {
                    ...item,
                    quantity: Math.min(quantity, item.product.stock || 999)
                } : item));
    };
    const clearCart = ()=>{
        setCartItems([]);
    };
    const isInCart = (productId, variantId)=>{
        return cartItems.some((item)=>item.product.id === productId && (variantId === undefined || item.product.variant_id === variantId));
    };
    const getCartTotal = ()=>{
        return cartItems.reduce((total, item)=>total + (item.product.price || 0) * item.quantity, 0);
    };
    const getCartCount = ()=>{
        return cartItems.reduce((count, item)=>count + item.quantity, 0);
    };
    const openCart = ()=>setIsCartOpen(true);
    const closeCart = ()=>setIsCartOpen(false);
    const toggleCart = ()=>setIsCartOpen((prev)=>!prev);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isInCart,
            getCartTotal,
            getCartCount,
            isCartOpen,
            openCart,
            closeCart,
            toggleCart
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/CartContext.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "SWWJ2kUgHw/YSEzYWjm6PViUzIQ=");
_c = CartProvider;
function useCart() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API Client for Hook & Hunt Storefront
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000/api/v2") || 'http://192.168.0.166:8000/api/v2';
class ApiClient {
    baseURL;
    constructor(baseURL){
        this.baseURL = baseURL;
    }
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }
    getToken() {
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && typeof localStorage !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }
    setToken(token) {
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('auth_token', token);
            // Also set cookie for middleware-based route protection
            document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        }
    }
    removeToken() {
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_token');
            // Also remove cookie
            document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
        }
    }
    async request(endpoint, options = {}, includeAuth = false) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(includeAuth);
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
                    ...options.headers || {}
                }
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
                    response: response
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
        } catch (error) {
            console.log('🔍 [API_DEBUG] Catch error:', error);
            // If it's a network error (not a response from server)
            const networkError = error;
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
    async register(phone, password, name) {
        return this.request('/store/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                phone_number: phone,
                password,
                password_confirmation: password,
                name
            })
        });
    }
    async sendOtp(phone) {
        return this.request('/store/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({
                phone_number: phone
            })
        });
    }
    async verifyOtp(phone, otp) {
        const response = await this.request('/store/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
                phone_number: phone,
                otp_code: otp
            })
        });
        // Store token if verification successful (check both possible response structures)
        const token = response.data?.access_token || response.data?.token || response?.access_token || response?.token;
        if (token) {
            this.setToken(token);
        }
        return response;
    }
    async sendResetOtp(phone) {
        return this.request('/store/auth/send-reset-otp', {
            method: 'POST',
            body: JSON.stringify({
                phone_number: phone
            })
        });
    }
    async resetPassword(phone, otp, password, passwordConfirmation) {
        return this.request('/store/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                phone_number: phone,
                otp_code: otp,
                password,
                password_confirmation: passwordConfirmation
            })
        });
    }
    async login(phone, password) {
        const response = await this.request('/store/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                login_id: phone,
                password
            })
        });
        // Store token if login successful (check both possible response structures)
        const token = response.data?.access_token || response.data?.token || response?.access_token || response?.token;
        if (token) {
            this.setToken(token);
        }
        return response;
    }
    async getMe() {
        return this.request('/store/account/me', {}, true);
    }
    async logout() {
        const response = await this.request('/store/account/logout', {
            method: 'POST'
        }, true);
        this.removeToken();
        return response;
    }
    async updateProfile(data) {
        return this.request('/store/account/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        }, true);
    }
    // Address endpoints
    async getAddresses() {
        return this.request('/store/account/addresses', {}, true);
    }
    async addAddress(address) {
        return this.request('/store/account/addresses', {
            method: 'POST',
            body: JSON.stringify(address)
        }, true);
    }
    async updateAddress(addressId, address) {
        return this.request(`/store/account/addresses/${addressId}`, {
            method: 'PUT',
            body: JSON.stringify(address)
        }, true);
    }
    async deleteAddress(addressId) {
        return this.request(`/store/account/addresses/${addressId}`, {
            method: 'DELETE'
        }, true);
    }
    async getOrders() {
        return this.request('/store/account/orders', {}, true);
    }
    async getOrder(orderId) {
        return this.request(`/store/account/orders/${orderId}`, {}, true);
    }
    // Contact Form Submission (Public Endpoint)
    async submitContactForm(data) {
        return this.request('/public/contact/submit', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    // Generic POST method for other API calls
    async post(endpoint, data, includeAuth = false) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        }, includeAuth);
    }
    // Helper to check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }
    // Clear authentication
    clearAuth() {
        this.removeToken();
    }
}
// Export singleton instance
const api = new ApiClient(API_BASE_URL);
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Check authentication status on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const initializeAuth = {
                "AuthProvider.useEffect.initializeAuth": async ()=>{
                    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
                    console.log('🔍 [AUTH_DEBUG] Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
                    if (token) {
                        console.log('🔍 [AUTH_DEBUG] Validating token with API...');
                        // First, try to use cached user data immediately for better UX
                        const cachedUser = localStorage.getItem('cached_user');
                        if (cachedUser) {
                            try {
                                const userData = JSON.parse(cachedUser);
                                console.log('🔍 [AUTH_DEBUG] ⚡ Using cached user immediately:', userData);
                                setUser(userData);
                                setIsAuthenticated(true);
                            } catch  {
                                console.log('🔍 [AUTH_DEBUG] ❌ Failed to parse cached user');
                                localStorage.removeItem('cached_user');
                            }
                        }
                        try {
                            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getMe();
                            console.log('🔍 [AUTH_DEBUG] API response status:', 'OK');
                            console.log('🔍 [AUTH_DEBUG] API response data:', response);
                            // Check both possible response structures: {data: {user: ...}} or {user: ...}
                            const user = response?.data?.user || response?.user || response;
                            if (user) {
                                console.log('🔍 [AUTH_DEBUG] ✅ User authenticated:', user);
                                setUser(user);
                                setIsAuthenticated(true);
                                // Cache user data for offline scenarios
                                localStorage.setItem('cached_user', JSON.stringify(user));
                            } else {
                                // Token exists but is invalid, clear it
                                console.log('🔍 [AUTH_DEBUG] ❌ Invalid response structure, clearing auth');
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].clearAuth();
                                localStorage.removeItem('cached_user');
                                setUser(null);
                                setIsAuthenticated(false);
                            }
                        } catch (error) {
                            const err = error;
                            console.log('🔍 [AUTH_DEBUG] ❌ API Error:', err.status, err.message);
                            // Always clear auth on 401 unauthorized errors
                            if (err.status === 401) {
                                console.log('🔍 [AUTH_DEBUG] ❌ 401 Unauthorized, clearing auth');
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].clearAuth();
                                localStorage.removeItem('cached_user');
                                setUser(null);
                                setIsAuthenticated(false);
                            } else if (err.status === 0 && !cachedUser) {
                                // Network error - only show error if we don't have cached data
                                console.log('🔍 [AUTH_DEBUG] 🌐 Network error, no cached user available');
                                setUser(null);
                                setIsAuthenticated(false);
                            } else {
                                console.log('🔍 [AUTH_DEBUG] 🌐 Network error but cached user is available');
                            }
                        }
                    } else {
                        console.log('🔍 [AUTH_DEBUG] ❌ No token found');
                        // Clear any stale cached user data
                        localStorage.removeItem('cached_user');
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                    console.log('🔍 [AUTH_DEBUG] Auth initialization complete. isLoading = false');
                    setIsLoading(false);
                }
            }["AuthProvider.useEffect.initializeAuth"];
            initializeAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (phone, password)=>{
        try {
            // Clear any existing auth data before login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('cached_user');
            setUser(null);
            setIsAuthenticated(false);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].login(phone, password);
            // Check both response.data.user and response.user for backward compatibility
            const user = response.data?.user || response?.user;
            if (user) {
                setUser(user);
                setIsAuthenticated(true);
                // Cache user data for offline scenarios
                localStorage.setItem('cached_user', JSON.stringify(user));
            }
        } catch (error) {
            throw error;
        }
    };
    const register = async (phone, password, name)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].register(phone, password, name);
        // Registration successful, but user needs to verify OTP
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };
    const sendOtp = async (phone)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sendOtp(phone);
        } catch (error) {
            console.error('Send OTP failed:', error);
            throw error;
        }
    };
    const verifyOtp = async (phone, otp)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].verifyOtp(phone, otp);
            if (response.data?.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                // Cache user data for offline scenarios
                localStorage.setItem('cached_user', JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
            throw error;
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setUser(null);
            setIsAuthenticated(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].clearAuth();
            // Clear cached user data
            localStorage.removeItem('cached_user');
        }
    };
    const refreshUser = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getMe();
            const user = response.data?.user || response?.user;
            if (user) {
                setUser(user);
            }
        } catch (error) {
            console.error('Refresh user failed:', error);
            throw error;
        }
    };
    const sendResetOtp = async (phone)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sendResetOtp(phone);
            return response;
        } catch (error) {
            console.error('Send reset OTP failed:', error);
            throw error;
        }
    };
    const resetPassword = async (phone, otp, password, passwordConfirmation)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].resetPassword(phone, otp, password, passwordConfirmation);
        } catch (error) {
            console.error('Password reset failed:', error);
            throw error;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated,
            isLoading,
            login,
            register,
            sendOtp,
            verifyOtp,
            sendResetOtp,
            resetPassword,
            logout,
            refreshUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 213,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "v1LRzRO747hYRtRdhUIJv9BiM4M=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/locales/en/inventory.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"inventory":{"title":"Inventory","subtitle":"Manage your current stock levels","noVariants":"No variants","noItems":"No inventory items found","stats":{"totalItems":"Total Items","totalQuantity":"Total Quantity","totalValue":"Total Value","alerts":"Alerts","alertsDetail":"{{out}} out, {{low}} low"},"filters":{"title":"Filters","searchPlaceholder":"Search products...","stockStatusPlaceholder":"Stock Status","allStatus":"All Status","locationPlaceholder":"Filter by location...","clear":"Clear Filters"},"currentStock":{"title":"Current Stock","showing":"Showing {{from}} to {{to}} of {{total}} items"},"table":{"product":"Product","variant":"Variant","sku":"SKU","landedCost":"Landed Cost","retailPrice":"Retail Price","quantity":"Quantity","reserved":"Reserved","available":"Available","stockValue":"Stock Value","status":"Status"},"status":{"outOfStock":"Out of Stock","lowStock":"Low Stock","reorderNeeded":"Reorder Needed","overstocked":"Overstocked","inStock":"In Stock"},"pagination":{"page":"Page {{current}} of {{last}}","previous":"Previous","next":"Next"}}});}),
"[project]/src/locales/en/sidebar.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"dashboard":"Dashboard","products":"Products","allProducts":"All Products","addProduct":"Add Product","categories":"Categories","attributes":"Attributes","inventory":"Inventory","stockOverview":"Stock Overview","stockMovements":"Stock Movements","lowStockAlerts":"Low Stock Alerts","stockAdjustments":"Stock Adjustments","orders":"Orders","allOrders":"All Orders","pendingOrders":"Pending Orders","processing":"Processing","shipped":"Shipped","returns":"Returns","customers":"Customers","allCustomers":"All Customers","dealers":"Dealers","affiliates":"Affiliates","dropshippers":"Dropshippers","financial":"Financial","revenueOverview":"Revenue Overview","profitAndLoss":"Profit & Loss","expenses":"Expenses","commissions":"Commissions","reports":"Reports","salesReports":"Sales Reports","inventoryReports":"Inventory Reports","customerReports":"Customer Reports","performance":"Performance","suppliers":"Suppliers","marketing":"Marketing","campaigns":"Campaigns","coupons":"Coupons","emailMarketing":"Email Marketing","analytics":"Analytics","settings":"Settings","general":"General","usersAndRoles":"Users & Roles","paymentMethods":"Payment Methods","shipping":"Shipping","notifications":"Notifications","hookAndHunt":"Hook & Hunt 1","adminPanel":"Admin Panel 2","helpAndSupport":"Help & Support","viewStore":"View Store"});}),
"[project]/src/locales/bn/sidebar.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"dashboard":"ড্যাশবোর্ড","products":"পণ্য","allProducts":"সমস্ত পণ্য","addProduct":"পণ্য যোগ করুন","categories":"বিভাগ","attributes":"বৈশিষ্ট্য","inventory":"ইনভেন্টরি","stockOverview":"স্টক ওভারভিউ","stockMovements":"স্টক মুভমেন্ট","lowStockAlerts":"কম স্টক সতর্কতা","stockAdjustments":"স্টক অ্যাডজাস্টমেন্ট","orders":"অর্ডার","allOrders":"সমস্ত অর্ডার","pendingOrders":"পেন্ডিং অর্ডার","processing":"প্রসেসিং","shipped":"প্রেরিত","returns":"রিটার্ন","customers":"গ্রাহক","allCustomers":"সমস্ত গ্রাহক","dealers":"ডিলার","affiliates":"অ্যাফিলিয়েট","dropshippers":"ড্রপশিপার","financial":"আর্থিক","revenueOverview":"রাজস্ব ওভারভিউ","profitAndLoss":"লাভ ও ক্ষতি","expenses":"খরচ","commissions":"কমিশন","reports":"রিপোর্ট","salesReports":"বিক্রয় রিপোর্ট","inventoryReports":"ইনভেন্টরি রিপোর্ট","customerReports":"গ্রাহক রিপোর্ট","performance":"কর্মক্ষমতা","suppliers":"সরবরাহকারী","marketing":"মার্কেটিং","campaigns":"ক্যাম্পেইন","coupons":"কুপন","emailMarketing":"ইমেল মার্কেটিং","analytics":"অ্যানালিটিক্স","settings":"সেটিংস","general":"সাধারণ","usersAndRoles":"ব্যবহারকারী এবং ভূমিকা","paymentMethods":"পেমেন্ট পদ্ধতি","shipping":"শিপিং","notifications":"বিজ্ঞপ্তি","hookAndHunt":"হুক অ্যান্ড হান্ট ১","adminPanel":"অ্যাডমিন প্যানেল ২","helpAndSupport":"সাহায্য ও поддержка","viewStore":"স্টোর দেখুন"});}),
"[project]/src/locales/en/contact.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"title":"Contact Us","subtitle":"Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.","contactInfo":{"phone":{"label":"Phone","number":"01841544590","hours":"Sat-Thu, 9am-6pm"},"email":{"label":"Email","address":"support@hooknhunt.com","responseTime":"We reply within 24 hours"},"location":{"label":"Location","address":"Dhaka, Bangladesh","note":"Visit our store"}},"form":{"fullName":{"label":"Full Name","placeholder":"John Doe","required":"*"},"email":{"label":"Email Address","placeholder":"john@example.com","required":"*"},"phone":{"label":"Phone Number","placeholder":"01712345678","optional":""},"subject":{"label":"Subject","placeholder":"How can we help?","required":"*"},"priority":{"label":"Priority Level","required":"*","options":{"low":"🟢 Low - General inquiry","medium":"🟡 Medium - Standard response time","high":"🟠 High - Needs attention soon","urgent":"🔴 Urgent - Immediate response needed"},"helper":"This helps us prioritize your inquiry"},"message":{"label":"Message","placeholder":"Tell us more about your inquiry...","required":"*"},"submitButton":{"default":"Send Message","submitting":"Sending..."}},"socialLinks":{"title":"Follow Us"},"success":{"title":"Thank you for contacting us!","message":"We have received your message and will get back to you soon."},"error":{"title":"Submission Failed","message":"Failed to submit form. Please try again or call us directly."},"validation":{"required":"This field is required","email":"Please enter a valid email address","phone":"Please enter a valid phone number","minLength":"Minimum {min} characters required"}});}),
"[project]/src/locales/bn/contact.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"title":"যোগাযোগ করুন","subtitle":"আপনার কোনো প্রশ্ন আছে? আমরা শুনতে চাই। আমাদের মেসেজ পাঠান এবং আমরা যত দ্রুত সম্ভব উত্তর দেব।","contactInfo":{"phone":{"label":"ফোন","number":"০১৮৪১৫৪৪৫৯০","hours":"শনি-বৃহঃ, সকাল ৯টা - সন্ধ্যা ৬টা"},"email":{"label":"ইমেইল","address":"support@hooknhunt.com","responseTime":"২৪ ঘন্টার মধ্যে উত্তর দেওয়া হবে"},"location":{"label":"অবস্থান","address":"ঢাকা, বাংলাদেশ","note":"আমাদের স্টোরে ভিজিট করুন"}},"form":{"fullName":{"label":"পূর্ণ নাম","placeholder":"জন দো","required":"*"},"email":{"label":"ইমেইল ঠিকানা","placeholder":"john@example.com","required":"*"},"phone":{"label":"ফোন নম্বর","placeholder":"০১৭১২৩৪৫৬৭৮","optional":""},"subject":{"label":"বিষয়","placeholder":"কিভাবে সাহায্য করতে পারি?","required":"*"},"priority":{"label":"অগ্রাধিকার স্তর","required":"*","options":{"low":"🟢 কম - সাধারণ জিজ্ঞাসা","medium":"🟡 মাঝারি - স্বাভাবিক সময়ের মধ্যে","high":"🟠 বেশি - শীঘ্রই মনোযোগ দরকার","urgent":"🔴 জরুরি - এখনই উত্তর প্রয়োজন"},"helper":"এটি আপনার জিজ্ঞাসা অগ্রাধিকার দিতে সাহায্য করে"},"message":{"label":"বার্তা","placeholder":"আপনার জিজ্ঞাসা সম্পর্কে আরও জানান...","required":"*"},"submitButton":{"default":"বার্তা পাঠান","submitting":"পাঠানো হচ্ছে..."}},"socialLinks":{"title":"আমাদের অনুসরণ করুন"},"success":{"title":"যোগাযোগ করার জন্য ধন্যবাদ!","message":"আমরা আপনার বার্তা পেয়েছি এবং শীঘ্রই যোগাযোগ করব।"},"error":{"title":"জমা ব্যর্থ হয়েছে","message":"ফর্ম জমা দিতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা সরাসরি কল করুন।"},"validation":{"required":"এই ঘরটি পূরণ করা আবশ্যক","email":"অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন","phone":"অনুগ্রহ করে একটি সঠিক ফোন নম্বর দিন","minLength":"সর্বনিম্ন {min} অক্ষর প্রয়োজন"}});}),
"[project]/src/locales/en/trackOrder.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"title":"Track Your Order","subtitle":"Enter your Steadfast tracking ID to track your shipment","form":{"trackingId":{"label":"Tracking ID","required":"*","placeholder":"e.g., 123456789","helper":"Enter your Steadfast tracking ID from order confirmation"},"submitButton":"Track on Steadfast"},"infoBox":{"title":"How to find your tracking ID?","items":["Check your order confirmation email","View SMS notification from Steadfast","Login to your account and view order details"]},"helpSection":{"title":"Need help with your order?","contactButton":"Contact Support"}});}),
"[project]/src/locales/bn/trackOrder.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"title":"আপনার অর্ডার ট্র্যাক করুন","subtitle":"আপনার পণ্য শিপমেন্ট ট্র্যাক করতে আপনার স্টেডফাস্ট ট্র্যাকিং আইডি প্রবেশ করুন","form":{"trackingId":{"label":"ট্র্যাকিং আইডি","required":"*","placeholder":"যেমন, 123456789","helper":"অর্ডার নিশ্চিতকরণ থেকে আপনার স্টেডফাস্ট ট্র্যাকিং আইডি প্রবেশ করুন"},"submitButton":"স্টেডফাস্টে ট্র্যাক করুন"},"infoBox":{"title":"আপনার ট্র্যাকিং আইডি কীভাবে পাবেন?","items":["আপনার অর্ডার নিশ্চিতকরণ ইমেইল চেক করুন","স্টেডফাস্ট থেকে এসএমএস নোটিফিকেশন দেখুন","আপনার অ্যাকাউন্টে লগইন করে অর্ডারের বিস্তারিত দেখুন"]},"helpSection":{"title":"আপনার অর্ডারে সাহায্য প্রয়োজন?","contactButton":"সহায়কের সাথে যোগাযোগ করুন"}});}),
"[project]/src/locales/en/hotDeals.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"title":"Hot Deals","subtitle":"{count} products on sale","newsletter":{"title":"Don't Miss Out!","description":"Subscribe to our newsletter and get notified about exclusive hot deals and special offers.","emailPlaceholder":"Enter your email","submitButton":"Subscribe"}});}),
"[project]/src/locales/bn/hotDeals.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"title":"হট ডিলস","subtitle":"{count} টি পণ্য বিক্রি হচ্ছে","newsletter":{"title":"সুযোগ হারাবেন না!","description":"আমাদের নিউজলেটার সাবস্ক্রাইব করুন এবং এক্সক্লুসিভ হট ডিলস এবং বিশেষ অফার সম্পর্কে জানতে পান।","emailPlaceholder":"আপনার ইমেইল প্রবেশ করুন","submitButton":"সাবস্ক্রাইব করুন"}});}),
"[project]/src/locales/en/productCard.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"productCard.discount":"-{percent}%","productCard.stockWarning":"Only {count} left","productCard.outOfStock":"OUT OF STOCK","productCard.priceUnavailable":"Price unavailable","productCard.priceVaries":"Price varies","productCard.variantsAvailable":"{count} variants available","productCard.viewCart":"View Cart","productCard.viewDetails":"View Details","productCard.addToCart":"Add to Cart","productCard.outOfStockButton":"Out of Stock","productCard.unavailable":"Unavailable"});}),
"[project]/src/locales/bn/productCard.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"productCard.discount":"-{percent}%","productCard.stockWarning":"মাত্র {count} টি বাকি আছে","productCard.outOfStock":"স্টক নেই","productCard.priceUnavailable":"মূল্য পাওয়া যায়","productCard.priceVaries":"মূল্য ভিন্ন হতে পারে","productCard.variantsAvailable":"{count} টি ভ্যারিয়েন্ট আছে","productCard.viewCart":"কার্ট দেখুন","productCard.viewDetails":"বিস্তারিত দেখুন","productCard.addToCart":"কার্টে যোগ করুন","productCard.outOfStockButton":"স্টক নেই","productCard.unavailable":"পাওয়া নেই"});}),
"[project]/src/locales/en/product.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"breadcrumb":{"home":"Home","products":"Products","loading":"Loading..."},"stock":{"inStock":"In Stock","outOfStock":"Out of Stock","lowStock":"Low Stock","available":"{count} available","status":"Status: {status}"},"buttons":{"addToCart":"Add to Cart","buyNow":"Buy Now","viewCart":"View Cart","selectVariant":"Select Variant"},"quantity":{"label":"Quantity","decrease":"Decrease quantity","increase":"Increase quantity"},"variants":{"title":"Select Variant","selectOption":"Select {option}","price":"Price","sku":"SKU: {sku}","inStock":"In Stock","outOfStock":"Out of Stock","selectVariant":"Please select a variant"},"details":{"description":"Description","specifications":"Specifications","features":"Features","gallery":"Product Gallery","imageOf":"Image {current} of {total}"},"reviews":{"title":"Customer Reviews","rating":"Rating","basedOn":"Based on {count} reviews","seeAll":"See all reviews →","writeReview":"Write a Review","noReviews":"No reviews yet.","beFirst":"Be the first to review this product!"},"related":{"title":"Related Products","viewAll":"View All Products"},"offers":{"limitedTime":"Limited Time Offer!","save":"Save ৳{amount}"},"share":{"title":"Share this product","copyLink":"Copy link","linkCopied":"Link copied!"},"compare":{"title":"Compare","addToCompare":"Add to Compare"},"wishlist":{"addToWishlist":"Add to Wishlist","inWishlist":"In Wishlist"}});}),
"[project]/src/locales/bn/product.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"breadcrumb":{"home":"হোম","products":"পণ্য","loading":"লোড হচ্ছে..."},"stock":{"inStock":"স্টকে আছে","outOfStock":"স্টক নেই","lowStock":"স্টক কম","available":"{count} টি উপলব্ধ","status":"অবস্থা: {status}"},"buttons":{"addToCart":"কার্টে যোগ করুন","buyNow":"এখনই কিনুন","viewCart":"কার্ট দেখুন","selectVariant":"ভ্যারিয়েন্ট নির্বাচন করুন"},"quantity":{"label":"পরিমাণ","decrease":"পরিমাণ কমান","increase":"পরিমাণ বাড়ান"},"variants":{"title":"ভ্যারিয়েন্ট নির্বাচন করুন","selectOption":"{option} নির্বাচন করুন","price":"মূল্য","sku":"এসকেইউ: {sku}","inStock":"স্টকে আছে","outOfStock":"স্টক নেই","selectVariant":"অনুগ্রহ করে একটি ভ্যারিয়েন্ট নির্বাচন করুন"},"details":{"description":"বর্ণনা","specifications":"স্পেসিফিকেশন","features":"বৈশিষ্ট্য","gallery":"পণ্য গ্যালারি","imageOf":"মোট {total} টির {current} নম্বর ছবি"},"reviews":{"title":"গ্রাহক রিভিউ","rating":"রেটিং","basedOn":"{count} টি রিভিউ এর ভিত্তিতে","seeAll":"সব রিভিউ দেখুন →","writeReview":"রিভিউ লিখুন","noReviews":"কোনো রিভিউ নেই।","beFirst":"প্রথম রিভিউ লিখুন!"},"related":{"title":"সম্পর্কিত পণ্য","viewAll":"সব পণ্য দেখুন"},"offers":{"limitedTime":"সীমিত সময়ের অফার!","save":"৳{amount} সেভ করুন"},"share":{"title":"এই পণ্যটি শেয়ার করুন","copyLink":"লিংক কপি করুন","linkCopied":"লিংক কপি করা হয়েছে!"},"compare":{"title":"তুলনা করুন","addToCompare":"তুলনায় যোগ করুন"},"wishlist":{"addToWishlist":"উইশলিস্টে যোগ করুন","inWishlist":"উইশলিস্টে আছে"}});}),
"[project]/src/locales/en/products.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"breadcrumb":{"home":"Home","products":"Products"},"title":"Products","filterButton":"Filters","activeFilters":"Active Filters","clearAll":"Clear All","categories":"Categories","allProducts":"All Products","priceRange":"Price Range","under1000":"Under ৳1,000","1000-5000":"৳1,000 - ৳5,000","5000-10000":"৳5,000 - ৳10,000","10000-plus":"৳10,000 & Above","customerRating":"Customer Rating","andUp":"& Up","specialOffer":{"title":"Special Offer!","description":"Get up to 30% off on selected items","viewDeals":"View Deals"},"showing":"Showing","products":"products","product":"product","sortBy":"Sort by:","sortOptions":{"bestSelling":"Best selling","newest":"New Released","discount":"Discount","priceLow":"Price Low to High","priceHigh":"Price High to Low"},"loading":"Loading more products...","noProducts":{"title":"No products found","message":"Try adjusting your filters or browse all categories to find what you're looking for","clearFilters":"Clear All Filters"},"endOfList":"You've reached the end. Showing all {count} products.","loadingPage":"Loading products..."});}),
"[project]/src/lib/i18n.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18next/dist/esm/i18next.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/initReactI18next.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$inventory$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/inventory.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$sidebar$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/sidebar.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$sidebar$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/bn/sidebar.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$contact$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/contact.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$contact$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/bn/contact.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$trackOrder$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/trackOrder.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$trackOrder$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/bn/trackOrder.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$hotDeals$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/hotDeals.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$hotDeals$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/bn/hotDeals.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$productCard$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/productCard.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$productCard$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/bn/productCard.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$product$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/product.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$product$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/bn/product.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$products$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/locales/en/products.json (json)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Translation resources
const resources = {
    en: {
        translation: {
            // Header
            'header.welcome': 'Welcome to Hook & Hunt - Hunting Happiness',
            'header.welcomeShort': 'Hook & Hunt',
            'header.phone': 'Call us: 01841544590',
            'header.search': 'Search for products...',
            'header.cart': 'Cart',
            'header.account': 'Account',
            'header.login': 'Login',
            'header.signup': 'Sign Up',
            // Navigation
            'nav.home': 'Home',
            'nav.hotDeals': 'Hot Deals',
            'nav.allProduct': 'All Product',
            'nav.category': 'Category',
            'nav.trackOrder': 'Track Order',
            'nav.rods': 'Fishing Rods',
            'nav.reels': 'Reels',
            'nav.lures': 'Lures & Baits',
            'nav.lines': 'Fishing Lines',
            'nav.accessories': 'Accessories',
            'nav.about': 'About Us',
            'nav.contact': 'Contact',
            // Footer
            'footer.newsletter.title': 'Subscribe to Our Newsletter',
            'footer.newsletter.subtitle': 'Get the latest updates on new products and upcoming sales',
            'footer.newsletter.placeholder': 'Enter your email address',
            'footer.newsletter.button': 'Subscribe',
            'footer.description': 'Your premier destination for quality fishing accessories and equipment. Hunting Happiness with every catch.',
            'footer.categories': 'Product Categories',
            'footer.customerService': 'Customer Service',
            'footer.getInTouch': 'Get In Touch',
            'footer.aboutUs': 'About Us',
            'footer.contactUs': 'Contact Us',
            'footer.shipping': 'Delivery & Shipping',
            'footer.returns': 'Returns & Exchange',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms & Conditions',
            'footer.location': 'Location',
            'footer.phone': 'Phone',
            'footer.email': 'Email',
            'footer.address': 'Holding - 3528/3, Biddut Nagar, Rail-Gate, Bogura Sadar, Bogura 5800.',
            'footer.phoneNumber': '+88 09613 244 200',
            'footer.emailAddress': 'Support@hooknhunt.com',
            'footer.copyright': '2025 Hook & Hunt. All rights reserved.',
            'footer.weAccept': 'We Accept:',
            // Hero Slider
            'hero.slide1.title': 'Premium Fishing Rods',
            'hero.slide1.subtitle': 'Cast Further, Catch More',
            'hero.slide1.description': 'Discover our collection of professional-grade fishing rods designed for serious anglers',
            'hero.slide1.cta': 'Shop Rods',
            'hero.slide2.title': 'High-Performance Reels',
            'hero.slide2.subtitle': 'Smooth. Strong. Reliable.',
            'hero.slide2.description': 'Experience precision engineering with our selection of premium fishing reels',
            'hero.slide2.cta': 'Explore Reels',
            'hero.slide3.title': 'Lures & Baits',
            'hero.slide3.subtitle': 'Irresistible to Every Fish',
            'hero.slide3.description': 'Browse our extensive range of lures and baits for all fishing conditions',
            'hero.slide3.cta': 'View Collection',
            'hero.viewAll': 'View All Products',
            // Home Page
            'home.categories.title': 'Shop by Category',
            'home.categories.subtitle': 'Explore our wide range of fishing equipment',
            // Banners
            'home.banners.rods.title': 'Premium Rods',
            'home.banners.rods.subtitle': 'Up to 40% OFF on select models',
            'home.banners.reels.title': 'Professional Reels',
            'home.banners.reels.subtitle': 'Heavy-duty performance guaranteed',
            'home.banners.shopNow': 'Shop Now',
            // Popular Products
            'home.popular.title': 'Popular Products',
            'home.popular.subtitle': 'Best selling fishing gear chosen by our customers',
            'home.popular.viewAll': 'View All',
            // New Arrival
            'home.newArrival.title': 'New Arrival',
            'home.newArrival.subtitle': 'Latest fishing equipment just arrived',
            'home.newArrival.viewAll': 'View All',
            // Best Deals
            'home.deals.title': 'Best Deals',
            'home.deals.subtitle': 'Amazing discounts on top fishing products',
            // Trending Products
            'home.trending.title': 'Trending Products',
            'home.trending.subtitle': 'Most popular items right now',
            'home.trending.viewAll': 'View All',
            // Recently Sold
            'home.recentlySold.title': 'Recently Sold',
            'home.recentlySold.subtitle': 'Products our customers just purchased',
            'home.recentlySold.viewAll': 'View All',
            // Recommended for You
            'home.recommended.title': 'Recommended for You',
            'home.recommended.subtitle': 'Handpicked products based on your interests',
            'home.recommended.viewAll': 'View All',
            // Customer Reviews
            'home.reviews.title': 'Customer Reviews',
            'home.reviews.subtitle': 'What our customers say about us',
            'home.reviews.review1.text': 'Excellent quality fishing rods! Fast delivery and great customer service. Very satisfied with my purchase.',
            'home.reviews.review2.text': 'Best fishing equipment store in Bangladesh. Highly recommended for all fishing enthusiasts!',
            'home.reviews.review3.text': 'Amazing products at competitive prices. Great variety and helpful staff. Will definitely buy again!',
            'home.features.shipping.title': 'Free Shipping',
            'home.features.shipping.description': 'On orders over 5000 BDT',
            'home.features.payment.title': 'Secure Payment',
            'home.features.payment.description': '100% secure transactions',
            'home.features.returns.title': 'Easy Returns',
            'home.features.returns.description': '7-day return policy',
            // Hot Deals
            'hotDeals.title': 'Hot Deals',
            'hotDeals.subtitle': 'Limited time offer - Grab it before it\'s gone!',
            'hotDeals.save': 'Save',
            'hotDeals.endsIn': 'Ends in',
            'hotDeals.days': 'Days',
            'hotDeals.hours': 'Hours',
            'hotDeals.minutes': 'Min',
            'hotDeals.seconds': 'Sec',
            'hotDeals.hot': 'HOT',
            'hotDeals.stock': 'Stock',
            'hotDeals.hurry': 'Hurry!',
            'hotDeals.buyNow': 'Buy Now',
            'hotDeals.addToCart': 'Add to Cart',
            'hotDeals.viewAll': 'View All Hot Deals',
            // Categories
            'categories.rods': 'Fishing Rods',
            'categories.reels': 'Fishing Reels',
            'categories.lines': 'Fishing Lines',
            'categories.lures': 'Lures & Baits',
            'categories.hooks': 'Hooks & Rigs',
            'categories.storage': 'Tackle Storage',
            'categories.tools': 'Fishing Tools',
            'categories.apparel': 'Fishing Apparel',
            // Common
            'common.loading': 'Loading...',
            'common.error': 'Error',
            'common.success': 'Success',
            'common.home': 'Home',
            'common.cart': 'Cart',
            'common.checkout': 'Checkout',
            'common.continueShopping': 'Continue Shopping',
            'common.remove': 'Remove',
            'common.quantity': 'Quantity',
            'common.subtotal': 'Subtotal',
            'common.total': 'Total',
            'common.free': 'FREE',
            // Cart Sidebar
            'cart.sidebar.title': 'Shopping Cart',
            'cart.sidebar.empty': 'Your cart is empty',
            'cart.sidebar.emptyMessage': 'Add some products to get started!',
            'cart.sidebar.item': 'item',
            'cart.sidebar.items': 'items',
            'cart.sidebar.viewCart': 'View Cart',
            'cart.sidebar.proceedToCheckout': 'Proceed to Checkout',
            'cart.sidebar.shippingNote': 'Shipping and taxes calculated at checkout',
            'cart.sidebar.maxStock': 'Max stock reached',
            // Cart Page
            'cart.page.title': 'Shopping Cart',
            'cart.page.emptyTitle': 'Your Cart is Empty',
            'cart.page.emptyMessage': 'Looks like you haven\'t added anything to your cart yet. Start shopping now!',
            'cart.page.startShopping': 'Start Shopping',
            'cart.page.selectAll': 'Select All',
            'cart.page.yourTotal': 'Your total:',
            'cart.page.productDiscount': 'Product Discount',
            'cart.page.shipping': 'Shipping',
            'cart.page.orderSummary': 'Order Summary',
            'cart.page.selected': 'selected',
            'cart.page.noItemsSelected': 'No items selected',
            'cart.page.maxStockReached': 'Max stock reached',
            'cart.page.only': 'Only',
            'cart.page.available': 'available',
            'cart.page.youSaved': 'You saved',
            'cart.page.almostThere': 'Almost there!',
            'cart.page.addMore': 'Add',
            'cart.page.moreToGetFreeShipping': 'more to get FREE shipping!',
            'cart.page.secureCheckout': 'Secure Checkout',
            'cart.page.freeShippingOver': 'Free Shipping Over',
            'cart.page.easyReturns': '30-Day Easy Returns',
            'cart.page.proceedToCheckout': 'Proceed to Checkout',
            'cart.page.removeConfirm': 'Are you sure you want to remove this item?',
            'cart.page.removeWarning': 'In future, you may not get this product at this price. Price may increase and stock may be low.',
            'cart.page.confirmRemove': 'Yes, Remove',
            'cart.page.keepItem': 'Keep in Cart',
            // Checkout Page
            'checkout.title': 'Checkout',
            'checkout.customerInfo': 'Customer Information',
            'checkout.fullName': 'Full Name',
            'checkout.phoneNumber': 'Phone Number',
            'checkout.email': 'Email',
            'checkout.optional': 'Optional',
            'checkout.address': 'Address',
            'checkout.city': 'City',
            'checkout.district': 'District',
            'checkout.required': '*',
            // Payment Method
            'checkout.paymentMethod': 'Payment Method',
            'checkout.cashOnDelivery': 'Cash on Delivery',
            'checkout.payWhenReceive': 'Pay when you receive',
            'checkout.mobileWallet': 'Mobile Wallet',
            'checkout.mobileWalletDesc': 'bKash, Nagad, Rocket',
            'checkout.debitCreditCard': 'Debit / Credit Card',
            'checkout.cardTypes': 'Visa, Mastercard, Amex',
            // Order Summary
            'checkout.summary': 'Checkout Summary',
            'checkout.applyCoupon': 'Apply Voucher or Promo Code',
            'checkout.enterCode': 'Enter code',
            'checkout.apply': 'Apply',
            'checkout.tryCodes': 'Try these codes:',
            'checkout.couponDiscount': 'Coupon Discount',
            'checkout.deliveryCharge': 'Delivery Charge',
            'checkout.serviceCharge': 'Website Service Charge',
            'checkout.payableTotal': 'Payable Total',
            'checkout.youAreSaving': 'You are saving',
            // Terms
            'checkout.agreeToTerms': 'I agree to the',
            'checkout.termsAndConditions': 'terms and conditions',
            'checkout.placeOrder': 'Place Order',
            'checkout.fastDelivery': 'Fast Delivery',
            // Validation Messages
            'checkout.pleaseAgreeToTerms': 'Please agree to the terms and conditions',
            'checkout.pleaseSelectWallet': 'Please select a mobile wallet',
            'checkout.pleaseFillAllFields': 'Please fill in all required fields',
            'checkout.orderPlacedSuccess': 'Order placed successfully!',
            // Coupon Messages
            'checkout.enterCouponCode': 'Please enter a coupon code',
            'checkout.invalidCoupon': 'Invalid coupon code',
            'checkout.couponAlreadyApplied': 'This coupon is already applied',
            'checkout.couponApplied': 'Coupon applied successfully!',
            'checkout.percentageDiscount': '% discount applied',
            'checkout.fixedDiscount': ' discount applied',
            'checkout.freeShippingApplied': 'Free shipping applied',
            // Placeholders
            'checkout.enterYourFullName': 'Enter your full name',
            'checkout.phoneNumberPlaceholder': '01XXXXXXXXX',
            'checkout.emailPlaceholder': 'your@email.com',
            'checkout.addressPlaceholder': 'House/Flat No., Road, Area',
            'checkout.cityPlaceholder': 'e.g., Dhaka',
            'checkout.districtPlaceholder': 'e.g., Dhaka',
            // Authentication
            'auth.login.title': 'Welcome Back',
            'auth.login.subtitle': 'Login to your account',
            'auth.login.email': 'Email Address',
            'auth.login.password': 'Password',
            'auth.login.rememberMe': 'Remember me',
            'auth.login.forgotPassword': 'Forgot Password?',
            'auth.login.button': 'Login',
            'auth.login.noAccount': 'Don\'t have an account?',
            'auth.login.signUp': 'Sign Up',
            'auth.login.orContinueWith': 'Or continue with',
            'auth.login.google': 'Google',
            'auth.login.facebook': 'Facebook',
            'auth.login.phone': 'Phone Number',
            'auth.login.passwordPlaceholder': 'Enter your password',
            'auth.login.failed': 'Login failed. Please check your credentials.',
            'auth.register.title': 'Create Account',
            'auth.register.subtitle': 'Join us today',
            'auth.register.fullName': 'Full Name',
            'auth.register.email': 'Email Address',
            'auth.register.phone': 'Phone Number',
            'auth.register.password': 'Password',
            'auth.register.confirmPassword': 'Confirm Password',
            'auth.register.agreeToTerms': 'I agree to the',
            'auth.register.terms': 'Terms & Conditions',
            'auth.register.and': 'and',
            'auth.register.privacy': 'Privacy Policy',
            'auth.register.button': 'Create Account',
            'auth.register.haveAccount': 'Already have an account?',
            'auth.register.login': 'Login',
            'auth.register.failed': 'Registration failed. Please try again.',
            'auth.register.changePhone': 'Change Phone Number',
            'auth.register.phoneHint': 'Enter your Bangladesh phone number',
            'auth.register.passwordPlaceholder': 'Create a password',
            'auth.register.confirmPasswordPlaceholder': 'Confirm your password',
            'auth.reset.title': 'Reset Password',
            'auth.reset.subtitle': 'Enter your email to reset password',
            'auth.reset.email': 'Email Address',
            'auth.reset.button': 'Send Reset Link',
            'auth.reset.backToLogin': 'Back to Login',
            'auth.reset.backToHome': 'Back to Home',
            'auth.reset.checkEmail': 'Check Your Email',
            'auth.reset.sentMessage': 'We have sent a password reset link to your email address.',
            'auth.reset.didNotReceive': 'Didn\'t receive the email?',
            'auth.reset.resend': 'Resend',
            'auth.validation.emailRequired': 'Email is required',
            'auth.validation.emailInvalid': 'Please enter a valid email',
            'auth.validation.passwordRequired': 'Password is required',
            'auth.validation.passwordMin': 'Password must be at least 6 characters',
            'auth.validation.passwordMatch': 'Passwords do not match',
            'auth.validation.nameRequired': 'Full name is required',
            'auth.validation.phoneRequired': 'Phone number is required',
            'auth.validation.termsRequired': 'You must agree to terms and conditions',
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$inventory$2e$json__$28$json$29$__["default"].inventory,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$sidebar$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$contact$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$trackOrder$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$hotDeals$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$productCard$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$product$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$products$2e$json__$28$json$29$__["default"]
        }
    },
    bn: {
        translation: {
            // Header
            'header.welcome': 'হুক এন্ড হান্ট এ স্বাগতম - সুখের শিকার',
            'header.welcomeShort': 'হুক এন্ড হান্ট',
            'header.phone': 'কল করুন: 01841544590',
            'header.search': 'পণ্য খুঁজুন...',
            'header.cart': 'কার্ট',
            'header.account': 'অ্যাকাউন্ট',
            'header.login': 'লগইন',
            'header.signup': 'সাইন আপ',
            // Navigation
            'nav.home': 'হোম',
            'nav.hotDeals': 'হট ডিলস',
            'nav.allProduct': 'সব পণ্য',
            'nav.category': 'ক্যাটাগরি',
            'nav.trackOrder': 'অর্ডার ট্র্যাক করুন',
            'nav.rods': 'ফিশিং রড',
            'nav.reels': 'রিল',
            'nav.lures': 'লোর ও টোপ',
            'nav.lines': 'ফিশিং লাইন',
            'nav.accessories': 'এক্সেসরিজ',
            'nav.about': 'আমাদের সম্পর্কে',
            'nav.contact': 'যোগাযোগ',
            // Footer
            'footer.newsletter.title': 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন',
            'footer.newsletter.subtitle': 'নতুন পণ্য এবং আসন্ন বিক্রয়ের সর্বশেষ আপডেট পান',
            'footer.newsletter.placeholder': 'আপনার ইমেইল ঠিকানা লিখুন',
            'footer.newsletter.button': 'সাবস্ক্রাইব',
            'footer.description': 'মানসম্পন্ন মাছ ধরার আনুষাঙ্গিক এবং সরঞ্জামের জন্য আপনার প্রধান গন্তব্য। প্রতিটি ক্যাচের সাথে সুখের শিকার।',
            'footer.categories': 'পণ্য বিভাগ',
            'footer.customerService': 'গ্রাহক সেবা',
            'footer.getInTouch': 'যোগাযোগ করুন',
            'footer.aboutUs': 'আমাদের সম্পর্কে',
            'footer.contactUs': 'যোগাযোগ করুন',
            'footer.shipping': 'ডেলিভারি ও শিপিং',
            'footer.returns': 'রিটার্ন ও এক্সচেঞ্জ',
            'footer.privacy': 'গোপনীয়তা নীতি',
            'footer.terms': 'শর্তাবলী',
            'footer.location': 'অবস্থান',
            'footer.phone': 'ফোন',
            'footer.email': 'ইমেইল',
            'footer.address': 'হোল্ডিং - ৩৫২৮/৩, বিদ্যুৎ নগর, রেল-গেট, বগুড়া সদর, বগুড়া ৫৮০০।',
            'footer.phoneNumber': '+৮৮ ০৯৬১৩ ২৪৪ ২০০',
            'footer.emailAddress': 'Support@hooknhunt.com',
            'footer.copyright': '২০২৫ হুক এন্ড হান্ট। সর্বস্বত্ব সংরক্ষিত।',
            'footer.weAccept': 'আমরা গ্রহণ করি:',
            // Hero Slider
            'hero.slide1.title': 'প্রিমিয়াম ফিশিং রড',
            'hero.slide1.subtitle': 'আরও দূরে নিক্ষেপ করুন, আরও ধরুন',
            'hero.slide1.description': 'পেশাদার জেলেদের জন্য ডিজাইন করা আমাদের পেশাদার-গ্রেড ফিশিং রডের সংগ্রহ আবিষ্কার করুন',
            'hero.slide1.cta': 'রড কিনুন',
            'hero.slide2.title': 'হাই-পারফরম্যান্স রিল',
            'hero.slide2.subtitle': 'মসৃণ। শক্তিশালী। নির্ভরযোগ্য।',
            'hero.slide2.description': 'আমাদের প্রিমিয়াম ফিশিং রিলের নির্বাচন সহ নির্ভুল ইঞ্জিনিয়ারিং অনুভব করুন',
            'hero.slide2.cta': 'রিল দেখুন',
            'hero.slide3.subtitle': 'প্রতিটি মাছের কাছে অপ্রতিরোধ্য',
            'hero.slide3.description': 'সমস্ত মাছ ধরার অবস্থার জন্য আমাদের বিস্তৃত পরিসীমা লোর এবং টোপ ব্রাউজ করুন',
            'hero.slide3.cta': 'সংগ্রহ দেখুন',
            'hero.viewAll': 'সকল পণ্য দেখুন',
            // Home Page
            'home.categories.title': 'ক্যাটাগরি অনুযায়ী কিনুন',
            'home.categories.subtitle': 'আমাদের বিস্তৃত মাছ ধরার সরঞ্জাম দেখুন',
            // Banners
            'home.banners.rods.title': 'প্রিমিয়াম রড',
            'home.banners.rods.subtitle': 'নির্বাচিত মডেলে ৪০% পর্যন্ত ছাড়',
            'home.banners.reels.title': 'পেশাদার রিল',
            'home.banners.reels.subtitle': 'হেভি-ডিউটি পারফরম্যান্সের গ্যারান্টি',
            'home.banners.shopNow': 'এখনই কিনুন',
            // Popular Products
            'home.popular.title': 'জনপ্রিয় পণ্য',
            'home.popular.subtitle': 'আমাদের গ্রাহকদের দ্বারা নির্বাচিত সেরা বিক্রিত মাছ ধরার সরঞ্জাম',
            'home.popular.viewAll': 'সব দেখুন',
            // New Arrival
            'home.newArrival.title': 'নতুন আগমন',
            'home.newArrival.subtitle': 'সদ্য আগত সর্বশেষ মাছ ধরার সরঞ্জাম',
            'home.newArrival.viewAll': 'সব দেখুন',
            // Best Deals
            'home.deals.title': 'সেরা ডিল',
            'home.deals.subtitle': 'শীর্ষ মাছ ধরার পণ্যে আশ্চর্যজনক ছাড়',
            // Trending Products
            'home.trending.title': 'ট্রেন্ডিং পণ্য',
            'home.trending.subtitle': 'এই মুহূর্তে সবচেয়ে জনপ্রিয় আইটেম',
            'home.trending.viewAll': 'সব দেখুন',
            // Recently Sold
            'home.recentlySold.title': 'সদ্য বিক্রিত',
            'home.recentlySold.subtitle': 'আমাদের গ্রাহকরা সদ্য ক্রয় করেছেন',
            'home.recentlySold.viewAll': 'সব দেখুন',
            // Recommended for You
            'home.recommended.title': 'আপনার জন্য সুপারিশকৃত',
            'home.recommended.subtitle': 'আপনার পছন্দের ভিত্তিতে নির্বাচিত পণ্য',
            'home.recommended.viewAll': 'সব দেখুন',
            // Customer Reviews
            'home.reviews.title': 'গ্রাহক পর্যালোচনা',
            'home.reviews.subtitle': 'আমাদের গ্রাহকরা আমাদের সম্পর্কে কী বলেন',
            'home.reviews.review1.text': 'চমৎকার মানের ফিশিং রড! দ্রুত ডেলিভারি এবং দুর্দান্ত গ্রাহক সেবা। আমার ক্রয়ে খুবই সন্তুষ্ট।',
            'home.reviews.review2.text': 'বাংলাদেশের সেরা মাছ ধরার সরঞ্জামের দোকান। সকল মাছ ধরার উৎসাহীদের জন্য অত্যন্ত সুপারিশকৃত!',
            'home.reviews.review3.text': 'প্রতিযোগিতামূলক দামে আশ্চর্যজনক পণ্য। দুর্দান্ত বৈচিত্র্য এবং সহায়ক কর্মী। অবশ্যই আবার কিনব!',
            'home.features.shipping.title': 'বিনামূল্যে শিপিং',
            'home.features.shipping.description': '৫০০০ টাকার উপরে অর্ডারে',
            'home.features.payment.title': 'নিরাপদ পেমেন্ট',
            'home.features.payment.description': '১০০% নিরাপদ লেনদেন',
            'home.features.returns.title': 'সহজ রিটার্ন',
            'home.features.returns.description': '৭ দিনের রিটার্ন নীতি',
            // Hot Deals
            'hotDeals.title': 'হট ডিলস',
            'hotDeals.subtitle': 'সীমিত সময়ের অফার - শেষ হওয়ার আগে কিনুন!',
            'hotDeals.save': 'সাশ্রয়',
            'hotDeals.endsIn': 'শেষ হবে',
            'hotDeals.days': 'দিন',
            'hotDeals.hours': 'ঘন্টা',
            'hotDeals.minutes': 'মিনিট',
            'hotDeals.seconds': 'সেকেন্ড',
            'hotDeals.hot': 'হট',
            'hotDeals.stock': 'স্টক',
            'hotDeals.hurry': 'তাড়াতাড়ি!',
            'hotDeals.buyNow': 'এখনই কিনুন',
            'hotDeals.addToCart': 'কার্টে যোগ করুন',
            'hotDeals.viewAll': 'সকল হট ডিলস পণ্য দেখুন',
            // Categories
            'categories.rods': 'ফিশিং রড',
            'categories.reels': 'ফিশিং রিল',
            'categories.lines': 'ফিশিং লাইন',
            'categories.lures': 'লোর ও টোপ',
            'categories.hooks': 'হুক ও রিগ',
            'categories.storage': 'ট্যাকল স্টোরেজ',
            'categories.tools': 'ফিশিং টুলস',
            'categories.apparel': 'ফিশিং পোশাক',
            // Common
            'common.loading': 'লোড হচ্ছে...',
            'common.error': 'ত্রুটি',
            'common.success': 'সফল',
            'common.home': 'হোম',
            'common.cart': 'কার্ট',
            'common.checkout': 'চেকআউট',
            'common.continueShopping': 'কেনাকাটা চালিয়ে যান',
            'common.remove': 'মুছুন',
            'common.quantity': 'পরিমাণ',
            'common.subtotal': 'সাবটোটাল',
            'common.total': 'মোট',
            'common.free': 'বিনামূল্যে',
            // Cart Sidebar
            'cart.sidebar.title': 'শপিং কার্ট',
            'cart.sidebar.empty': 'আপনার কার্ট খালি',
            'cart.sidebar.emptyMessage': 'শুরু করতে কিছু পণ্য যোগ করুন!',
            'cart.sidebar.item': 'আইটেম',
            'cart.sidebar.items': 'আইটেম',
            'cart.sidebar.viewCart': ' কার্ট দেখুন',
            'cart.sidebar.proceedToCheckout': 'চেকআউট করুন',
            'cart.sidebar.shippingNote': 'চেকআউটে শিপিং এবং ট্যাক্স হিসাব করা হবে',
            'cart.sidebar.maxStock': 'সর্বোচ্চ স্টক পৌঁছেছে',
            // Cart Page
            'cart.page.title': 'শপিং কার্ট',
            'cart.page.emptyTitle': 'আপনার কার্ট খালি',
            'cart.page.emptyMessage': 'মনে হচ্ছে আপনি এখনও আপনার কার্টে কিছু যোগ করেননি। এখনই কেনাকাটা শুরু করুন!',
            'cart.page.startShopping': 'কেনাকাটা শুরু করুন',
            'cart.page.selectAll': 'সব নির্বাচন করুন',
            'cart.page.yourTotal': 'আপনার মোট:',
            'cart.page.productDiscount': 'পণ্য ছাড়',
            'cart.page.shipping': 'শিপিং',
            'cart.page.orderSummary': 'অর্ডার সারাংশ',
            'cart.page.selected': 'নির্বাচিত',
            'cart.page.noItemsSelected': 'কোন আইটেম নির্বাচিত নেই',
            'cart.page.maxStockReached': 'সর্বোচ্চ স্টক পৌঁছেছে',
            'cart.page.only': 'শুধুমাত্র',
            'cart.page.available': 'উপলব্ধ',
            'cart.page.youSaved': 'আপনি সঞ্চয় করেছেন',
            'cart.page.almostThere': 'প্রায় হয়ে গেছে!',
            'cart.page.addMore': 'আরও',
            'cart.page.moreToGetFreeShipping': 'যোগ করুন বিনামূল্যে শিপিং পেতে!',
            'cart.page.secureCheckout': 'নিরাপদ চেকআউট',
            'cart.page.freeShippingOver': 'এর উপরে বিনামূল্যে শিপিং',
            'cart.page.easyReturns': '৩০ দিনের সহজ রিটার্ন',
            'cart.page.proceedToCheckout': 'চেকআউট করুন',
            'cart.page.removeConfirm': 'আপনি কি এই পণ্যটি সরাতে চান?',
            'cart.page.removeWarning': 'ভবিষ্যতে, আপনি এই পণ্যটি এই দামে নাও পেতে পারেন। দাম বাড়তে পারে এবং স্টক কম হতে পারে।',
            'cart.page.confirmRemove': 'হ্যাঁ, সরান',
            'cart.page.keepItem': 'কার্টে রাখুন',
            // Checkout Page
            'checkout.title': 'চেকআউট',
            'checkout.customerInfo': 'গ্রাহক তথ্য',
            'checkout.fullName': 'পুরো নাম',
            'checkout.phoneNumber': 'ফোন নম্বর',
            'checkout.email': 'ইমেইল',
            'checkout.optional': 'ঐচ্ছিক',
            'checkout.address': 'ঠিকানা',
            'checkout.city': 'শহর',
            'checkout.district': 'জেলা',
            'checkout.required': '*',
            // Payment Method
            'checkout.paymentMethod': 'পেমেন্ট পদ্ধতি',
            'checkout.cashOnDelivery': 'ক্যাশ অন ডেলিভারি',
            'checkout.payWhenReceive': 'পণ্য পেলে পেমেন্ট করুন',
            'checkout.mobileWallet': 'মোবাইল ওয়ালেট',
            'checkout.mobileWalletDesc': 'বিকাশ, নগদ, রকেট',
            'checkout.debitCreditCard': 'ডেবিট / ক্রেডিট কার্ড',
            'checkout.cardTypes': 'ভিসা, মাস্টারকার্ড, অ্যামেক্স',
            // Order Summary
            'checkout.summary': 'চেকআউট সারাংশ',
            'checkout.applyCoupon': 'ভাউচার বা প্রোমো কোড প্রয়োগ করুন',
            'checkout.enterCode': 'কোড লিখুন',
            'checkout.apply': 'প্রয়োগ করুন',
            'checkout.tryCodes': 'এই কোডগুলি চেষ্টা করুন:',
            'checkout.couponDiscount': 'কুপন ছাড়',
            'checkout.deliveryCharge': 'ডেলিভারি চার্জ',
            'checkout.serviceCharge': 'ওয়েবসাইট সেবা চার্জ',
            'checkout.payableTotal': 'প্রদেয় মোট',
            'checkout.youAreSaving': 'আপনি সঞ্চয় করছেন',
            // Terms
            'checkout.agreeToTerms': 'আমি সম্মত',
            'checkout.termsAndConditions': 'শর্তাবলী',
            'checkout.placeOrder': 'অর্ডার করুন',
            'checkout.fastDelivery': 'দ্রুত ডেলিভারি',
            // Validation Messages
            'checkout.pleaseAgreeToTerms': 'অনুগ্রহ করে শর্তাবলীতে সম্মতি দিন',
            'checkout.pleaseSelectWallet': 'অনুগ্রহ করে একটি মোবাইল ওয়ালেট নির্বাচন করুন',
            'checkout.pleaseFillAllFields': 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন',
            'checkout.orderPlacedSuccess': 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
            // Coupon Messages
            'checkout.enterCouponCode': 'অনুগ্রহ করে একটি কুপন কোড লিখুন',
            'checkout.invalidCoupon': 'অবৈধ কুপন কোড',
            'checkout.couponAlreadyApplied': 'এই কুপন ইতিমধ্যে প্রয়োগ করা হয়েছে',
            'checkout.couponApplied': 'কুপন সফলভাবে প্রয়োগ করা হয়েছে!',
            'checkout.percentageDiscount': '% ছাড় প্রয়োগ করা হয়েছে',
            'checkout.fixedDiscount': ' ছাড় প্রয়োগ করা হয়েছে',
            'checkout.freeShippingApplied': 'বিনামূল্যে শিপিং প্রয়োগ করা হয়েছে',
            // Placeholders
            'checkout.enterYourFullName': 'আপনার পুরো নাম লিখুন',
            'checkout.phoneNumberPlaceholder': '০১XXXXXXXXX',
            'checkout.emailPlaceholder': 'আপনার@ইমেইল.কম',
            'checkout.addressPlaceholder': 'বাড়ি/ফ্ল্যাট নং, রোড, এলাকা',
            'checkout.cityPlaceholder': 'যেমন, ঢাকা',
            'checkout.districtPlaceholder': 'যেমন, ঢাকা',
            // Authentication
            'auth.login.title': 'স্বাগতম',
            'auth.login.subtitle': 'আপনার অ্যাকাউন্টে লগইন করুন',
            'auth.login.email': 'ইমেইল ঠিকানা',
            'auth.login.password': 'পাসওয়ার্ড',
            'auth.login.rememberMe': 'আমাকে মনে রাখুন',
            'auth.login.forgotPassword': 'পাসওয়ার্ড ভুলে গেছেন?',
            'auth.login.button': 'লগইন',
            'auth.login.noAccount': 'অ্যাকাউন্ট নেই?',
            'auth.login.signUp': 'সাইন আপ',
            'auth.login.orContinueWith': 'অথবা চালিয়ে যান',
            'auth.login.google': 'গুগল',
            'auth.login.facebook': 'ফেসবুক',
            'auth.register.title': 'অ্যাকাউন্ট তৈরি করুন',
            'auth.register.subtitle': 'আজই আমাদের সাথে যোগ দিন',
            'auth.register.fullName': 'পুরো নাম',
            'auth.register.email': 'ইমেইল ঠিকানা',
            'auth.register.phone': 'ফোন নম্বর',
            'auth.register.password': 'পাসওয়ার্ড',
            'auth.register.confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
            'auth.register.agreeToTerms': 'আমি সম্মত',
            'auth.register.terms': 'শর্তাবলী',
            'auth.register.and': 'এবং',
            'auth.register.privacy': 'গোপনীয়তা নীতি',
            'auth.register.button': 'অ্যাকাউন্ট তৈরি করুন',
            'auth.register.haveAccount': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
            'auth.register.login': 'লগইন',
            'auth.register.failed': 'নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
            'auth.register.changePhone': 'ফোন নম্বর পরিবর্তন করুন',
            'auth.register.phoneHint': 'আপনার বাংলাদেশ ফোন নম্বর লিখুন',
            'auth.register.passwordPlaceholder': 'একটি পাসওয়ার্ড তৈরি করুন',
            'auth.register.confirmPasswordPlaceholder': 'আপনার পাসওয়ার্ড নিশ্চিত করুন',
            'auth.reset.title': 'পাসওয়ার্ড রিসেট',
            'auth.reset.subtitle': 'পাসওয়ার্ড রিসেট করতে ইমেইল লিখুন',
            'auth.reset.email': 'ইমেইল ঠিকানা',
            'auth.reset.button': 'রিসেট লিঙ্ক পাঠান',
            'auth.reset.backToLogin': 'লগইনে ফিরে যান',
            'auth.reset.backToHome': 'হোমে ফিরে যান',
            'auth.reset.checkEmail': 'আপনার ইমেইল চেক করুন',
            'auth.reset.sentMessage': 'আমরা আপনার ইমেইল ঠিকানায় একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়েছি।',
            'auth.reset.didNotReceive': 'ইমেইল পাননি?',
            'auth.reset.resend': 'পুনরায় পাঠান',
            'auth.validation.emailRequired': 'ইমেইল প্রয়োজন',
            'auth.validation.emailInvalid': 'অনুগ্রহ করে একটি বৈধ ইমেইল লিখুন',
            'auth.validation.passwordRequired': 'পাসওয়ার্ড প্রয়োজন',
            'auth.validation.passwordMin': 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে',
            'auth.validation.passwordMatch': 'পাসওয়ার্ড মিলছে না',
            'auth.validation.nameRequired': 'পুরো নাম প্রয়োজন',
            'auth.validation.phoneRequired': 'ফোন নম্বর প্রয়োজন',
            'auth.validation.termsRequired': 'আপনাকে শর্তাবলীতে সম্মত হতে হবে',
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$en$2f$inventory$2e$json__$28$json$29$__["default"].inventory,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$sidebar$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$contact$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$trackOrder$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$hotDeals$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$productCard$2e$json__$28$json$29$__["default"],
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$locales$2f$bn$2f$product$2e$json__$28$json$29$__["default"]
        }
    }
};
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initReactI18next"]).init({
    resources,
    lng: 'bn',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$I18nextProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/I18nextProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$I18nextProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I18nextProvider"], {
        i18n: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/app/providers.tsx",
                    lineNumber: 14,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/providers.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/LanguageContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/i18n.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function LanguageProvider({ children }) {
    _s();
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('bn');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LanguageProvider.useEffect": ()=>{
            // Get saved language or use default
            const savedLang = localStorage.getItem('language') || 'bn';
            setLanguage(savedLang);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].changeLanguage(savedLang);
        }
    }["LanguageProvider.useEffect"], []);
    const changeLanguage = (lang)=>{
        setLanguage(lang);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].changeLanguage(lang);
        localStorage.setItem('language', lang);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            language,
            changeLanguage
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/LanguageContext.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_s(LanguageProvider, "EiYn8YdRd1ndrajgg24f5w8Z0ew=");
_c = LanguageProvider;
function useLanguage() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
_s1(useLanguage, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/static-products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBestDeals",
    ()=>getBestDeals,
    "getFeaturedProducts",
    ()=>getFeaturedProducts,
    "getNewArrivals",
    ()=>getNewArrivals,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProductsByCategory",
    ()=>getProductsByCategory,
    "getRandomProducts",
    ()=>getRandomProducts,
    "getRecentlySoldProducts",
    ()=>getRecentlySoldProducts,
    "getRecommendedProducts",
    ()=>getRecommendedProducts,
    "getTrendingProducts",
    ()=>getTrendingProducts,
    "staticCategories",
    ()=>staticCategories,
    "staticProducts",
    ()=>staticProducts
]);
const staticCategories = [
    {
        id: 1,
        name: 'Fishing Rods',
        slug: 'fishing-rods',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 2,
        name: 'Fishing Reels',
        slug: 'fishing-reels',
        image_url: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 3,
        name: 'Fishing Lures',
        slug: 'fishing-lures',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 4,
        name: 'Fishing Lines',
        slug: 'fishing-lines',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 5,
        name: 'Fishing Accessories',
        slug: 'fishing-accessories',
        image_url: 'https://images.unsplash.com/photo-1518589728347-67f3ac8c45f6?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 6,
        name: 'Fishing Hooks',
        slug: 'fishing-hooks',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 7,
        name: 'Fishing Nets',
        slug: 'fishing-nets',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 8,
        name: 'Fishing Apparel',
        slug: 'fishing-apparel',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 9,
        name: 'Fishing Electronics',
        slug: 'fishing-electronics',
        image_url: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 10,
        name: 'Tackle Boxes',
        slug: 'tackle-boxes',
        image_url: 'https://images.unsplash.com/photo-1518589728347-67f3ac8c45f6?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 11,
        name: 'Fishing Tools',
        slug: 'fishing-tools',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 12,
        name: 'Fishing Baits',
        slug: 'fishing-baits',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 13,
        name: 'Fishing Boats',
        slug: 'fishing-boats',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 14,
        name: 'Marine Electronics',
        slug: 'marine-electronics',
        image_url: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 15,
        name: 'Fishing Sunglasses',
        slug: 'fishing-sunglasses',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 16,
        name: 'Fish Finders',
        slug: 'fish-finders',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 17,
        name: 'Fishing Knives',
        slug: 'fishing-knives',
        image_url: 'https://images.unsplash.com/photo-1518589728347-67f3ac8c45f6?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 18,
        name: 'Fishing Chairs',
        slug: 'fishing-chairs',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
        parent_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    }
];
const staticProducts = [
    {
        id: 1,
        product_code: 'FR-001',
        title: 'Carbon Fiber Fishing Rod',
        slug: 'carbon-fiber-fishing-rod',
        sku: 'FR-001-BLK-M',
        description: 'Professional-grade carbon fiber fishing rod with ultra-sensitive tip. Perfect for both freshwater and saltwater fishing. Lightweight yet durable construction with premium cork handle.',
        short_description: 'Ultra-sensitive carbon fiber rod for professional anglers',
        supplier_id: 1,
        product_link: 'https://example.com/product/carbon-fiber-rod',
        category_id: 1,
        brand: 'Hook & Hunt Pro',
        tags: [
            'fishing',
            'rod',
            'carbon-fiber',
            'professional',
            'saltwater'
        ],
        featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop'
        ],
        weight: 250,
        unit: 'g',
        cost_rmb: 120,
        exchange_rate: 23.5,
        cost_bdt: 2820,
        actual_price: 4500,
        default_price: 4500,
        compare_at_price: 5500,
        price_wholesale: 4200,
        price_retail: 4500,
        price_daraz: 4800,
        name_wholesale: 'Carbon Fiber Rod - Wholesale',
        name_retail: 'Carbon Fiber Fishing Rod Pro',
        name_daraz: 'Premium Carbon Fiber Fishing Rod',
        inventory_quantity: 150,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: true,
        barcode: 'FR0011234567890',
        hs_code: '9507.00.00',
        seo_title: 'Carbon Fiber Fishing Rod | Hook & Hunt',
        seo_description: 'Professional carbon fiber fishing rod for anglers. Ultra-sensitive, lightweight, durable.',
        search_keywords: [
            'carbon fiber',
            'fishing rod',
            'professional rod',
            'saltwater rod'
        ],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-02-20T15:30:00Z',
        // Display aliases
        name: 'Carbon Fiber Fishing Rod',
        price: 4500,
        originalPrice: 5500,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
        stock: 150,
        rating: 4.8,
        reviews: 124,
        category: 'Fishing Rods',
        variant_count: 6,
        price_range_display: '৳4,200 - ৳4,800',
        has_offer: true
    },
    {
        id: 2,
        product_code: 'FR-002',
        title: 'Spinning Fishing Reel',
        slug: 'spinning-fishing-reel',
        sku: 'FR-002-3000',
        description: 'High-performance spinning fishing reel with smooth drag system. Features 12+1 ball bearings for ultra-smooth operation. Aluminum alloy body with corrosion-resistant coating.',
        short_description: 'Smooth drag spinning reel with 12+1 ball bearings',
        supplier_id: 1,
        product_link: 'https://example.com/product/spinning-reel',
        category_id: 2,
        brand: 'Hook & Hunt Pro',
        tags: [
            'fishing',
            'reel',
            'spinning',
            'smooth-drag',
            'aluminum'
        ],
        featured_image: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop'
        ],
        weight: 320,
        unit: 'g',
        cost_rmb: 85,
        exchange_rate: 23.5,
        cost_bdt: 1997,
        actual_price: 3200,
        default_price: 3200,
        compare_at_price: 3800,
        price_wholesale: 3000,
        price_retail: 3200,
        price_daraz: 3500,
        name_wholesale: 'Spinning Reel - Wholesale',
        name_retail: 'Pro Spinning Fishing Reel',
        name_daraz: 'Premium Spinning Reel 3000',
        inventory_quantity: 200,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: true,
        barcode: 'FR0021234567890',
        hs_code: '9507.00.00',
        seo_title: 'Spinning Fishing Reel | Hook & Hunt',
        seo_description: 'High-performance spinning reel with smooth drag. Perfect for all fishing conditions.',
        search_keywords: [
            'spinning reel',
            'fishing reel',
            'smooth drag',
            'ball bearing'
        ],
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-02-18T15:30:00Z',
        name: 'Spinning Fishing Reel',
        price: 3200,
        originalPrice: 3800,
        image: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
        stock: 200,
        rating: 4.7,
        reviews: 89,
        category: 'Fishing Reels',
        variant_count: 4,
        price_range_display: '৳3,000 - ৳3,500',
        has_offer: true
    },
    {
        id: 3,
        product_code: 'FL-003',
        title: 'Premium Fishing Lure Set',
        slug: 'premium-fishing-lure-set',
        sku: 'FL-003-50PCS',
        description: 'Complete set of 50 pieces premium fishing lures. Includes crankbaits, spinnerbaits, jigs, and soft plastics. All packed in a waterproof tackle box.',
        short_description: '50-piece premium lure set with tackle box',
        supplier_id: 2,
        product_link: 'https://example.com/product/lure-set',
        category_id: 3,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'lure',
            'tackle',
            'set',
            'accessories'
        ],
        featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop'
        ],
        weight: 850,
        unit: 'g',
        cost_rmb: 45,
        exchange_rate: 23.5,
        cost_bdt: 1057,
        actual_price: 1800,
        default_price: 1800,
        compare_at_price: 2200,
        price_wholesale: 1650,
        price_retail: 1800,
        price_daraz: 1950,
        name_wholesale: 'Lure Set - Wholesale',
        name_retail: 'Premium Fishing Lure Collection',
        name_daraz: '50-Piece Fishing Lure Kit',
        inventory_quantity: 300,
        inventory_policy: 'continue',
        has_variants: false,
        status: 'active',
        featured: true,
        barcode: 'FL0031234567890',
        hs_code: '9507.90.00',
        seo_title: 'Premium Fishing Lure Set | Hook & Hunt',
        seo_description: '50-piece premium fishing lure set. Complete collection for all fishing conditions.',
        search_keywords: [
            'fishing lures',
            'tackle set',
            'crankbait',
            'spinnerbait'
        ],
        created_at: '2024-01-25T10:00:00Z',
        updated_at: '2024-02-15T15:30:00Z',
        name: 'Premium Fishing Lure Set',
        price: 1800,
        originalPrice: 2200,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        stock: 300,
        rating: 4.6,
        reviews: 67,
        category: 'Fishing Lures',
        variant_count: 0,
        price_range_display: '৳1,800',
        has_offer: true
    },
    {
        id: 4,
        product_code: 'FL-004',
        title: 'Fishing Line Braided PE',
        slug: 'fishing-line-braided-pe',
        sku: 'FL-004-50LB-300M',
        description: 'Ultra-strong braided PE fishing line. 50lb test strength, 300 meters length. Zero stretch with superior sensitivity. Abrasion-resistant for long-lasting performance.',
        short_description: '50lb braided PE line - 300 meters',
        supplier_id: 2,
        product_link: 'https://example.com/product/braided-line',
        category_id: 4,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'line',
            'braided',
            'pe',
            'accessories'
        ],
        featured_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop'
        ],
        weight: 450,
        unit: 'g',
        cost_rmb: 25,
        exchange_rate: 23.5,
        cost_bdt: 587,
        actual_price: 1200,
        default_price: 1200,
        compare_at_price: 1500,
        price_wholesale: 1100,
        price_retail: 1200,
        price_daraz: 1300,
        name_wholesale: 'Braided Line - Wholesale',
        name_retail: 'Premium Braided PE Line',
        name_daraz: 'Ultra-Strong Braided Fishing Line',
        inventory_quantity: 500,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: false,
        barcode: 'FL0041234567890',
        hs_code: '9507.90.00',
        seo_title: 'Braided PE Fishing Line | Hook & Hunt',
        seo_description: 'Ultra-strong braided PE fishing line. 50lb test, zero stretch, superior sensitivity.',
        search_keywords: [
            'braided line',
            'PE line',
            'fishing line',
            'zero stretch'
        ],
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-10T15:30:00Z',
        name: 'Fishing Line Braided PE',
        price: 1200,
        originalPrice: 1500,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
        stock: 500,
        rating: 4.5,
        reviews: 156,
        category: 'Fishing Lines',
        variant_count: 6,
        price_range_display: '৳1,100 - ৳1,300',
        has_offer: true
    },
    {
        id: 5,
        product_code: 'FT-005',
        title: 'Fishing Tackle Box Organizer',
        slug: 'fishing-tackle-box-organizer',
        sku: 'FT-005-LG',
        description: 'Large waterproof fishing tackle box with multiple compartments. Adjustable dividers for custom organization. Transparent design for easy visibility.',
        short_description: 'Large waterproof tackle box with adjustable dividers',
        supplier_id: 3,
        product_link: 'https://example.com/product/tackle-box',
        category_id: 5,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'tackle',
            'box',
            'organizer',
            'storage'
        ],
        featured_image: 'https://images.unsplash.com/photo-1518589728347-67f3ac8c45f6?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1518589728347-67f3ac8c45f6?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop'
        ],
        weight: 1200,
        unit: 'g',
        cost_rmb: 55,
        exchange_rate: 23.5,
        cost_bdt: 1292,
        actual_price: 2200,
        default_price: 2200,
        compare_at_price: 0,
        price_wholesale: 2000,
        price_retail: 2200,
        price_daraz: 2400,
        name_wholesale: 'Tackle Box - Wholesale',
        name_retail: 'Premium Tackle Box Organizer',
        name_daraz: 'Large Fishing Tackle Box',
        inventory_quantity: 120,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: false,
        barcode: 'FT0051234567890',
        hs_code: '4202.92.00',
        seo_title: 'Fishing Tackle Box | Hook & Hunt',
        seo_description: 'Large waterproof tackle box with adjustable dividers. Perfect storage solution.',
        search_keywords: [
            'tackle box',
            'fishing storage',
            'organizer',
            'waterproof'
        ],
        created_at: '2024-02-05T10:00:00Z',
        updated_at: '2024-02-12T15:30:00Z',
        name: 'Fishing Tackle Box Organizer',
        price: 2200,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1518589728347-67f3ac8c45f6?w=800&h=800&fit=crop',
        stock: 120,
        rating: 4.4,
        reviews: 45,
        category: 'Fishing Accessories',
        variant_count: 2,
        price_range_display: '৳2,000 - ৳2,400',
        has_offer: false
    },
    {
        id: 6,
        product_code: 'FR-006',
        title: 'Telescopic Fishing Rod',
        slug: 'telescopic-fishing-rod',
        sku: 'FR-006-2.4M',
        description: 'Portable telescopic fishing rod that collapses to 50cm. Extends to 2.4 meters for full reach. High-density fiberglass construction for durability.',
        short_description: 'Portable telescopic rod - extends to 2.4m',
        supplier_id: 1,
        product_link: 'https://example.com/product/telescopic-rod',
        category_id: 1,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'rod',
            'telescopic',
            'portable',
            'travel'
        ],
        featured_image: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop'
        ],
        weight: 280,
        unit: 'g',
        cost_rmb: 65,
        exchange_rate: 23.5,
        cost_bdt: 1527,
        actual_price: 2800,
        default_price: 2800,
        compare_at_price: 3200,
        price_wholesale: 2600,
        price_retail: 2800,
        price_daraz: 3000,
        name_wholesale: 'Telescopic Rod - Wholesale',
        name_retail: 'Travel Telescopic Fishing Rod',
        name_daraz: 'Portable Telescopic Rod 2.4m',
        inventory_quantity: 180,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: true,
        barcode: 'FR0061234567890',
        hs_code: '9507.00.00',
        seo_title: 'Telescopic Fishing Rod | Hook & Hunt',
        seo_description: 'Portable telescopic fishing rod perfect for travel. Collapses to 50cm.',
        search_keywords: [
            'telescopic rod',
            'portable rod',
            'travel fishing',
            'collapsible rod'
        ],
        created_at: '2024-02-08T10:00:00Z',
        updated_at: '2024-02-14T15:30:00Z',
        name: 'Telescopic Fishing Rod',
        price: 2800,
        originalPrice: 3200,
        image: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
        stock: 180,
        rating: 4.3,
        reviews: 78,
        category: 'Fishing Rods',
        variant_count: 3,
        price_range_display: '৳2,600 - ৳3,000',
        has_offer: true
    },
    {
        id: 7,
        product_code: 'FA-007',
        title: 'Fishing Hook Set Assorted',
        slug: 'fishing-hook-set-assorted',
        sku: 'FA-007-100PCS',
        description: 'Complete fishing hook set with 100 pieces in various sizes (2/0 to 12). High-carbon steel construction with sharp chemically sharpened points.',
        short_description: '100-piece assorted hook set - sizes 2/0 to 12',
        supplier_id: 3,
        product_link: 'https://example.com/product/hook-set',
        category_id: 6,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'hooks',
            'assorted',
            'accessories',
            'sharp'
        ],
        featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop'
        ],
        weight: 150,
        unit: 'g',
        cost_rmb: 15,
        exchange_rate: 23.5,
        cost_bdt: 352,
        actual_price: 750,
        default_price: 750,
        compare_at_price: 900,
        price_wholesale: 700,
        price_retail: 750,
        price_daraz: 800,
        name_wholesale: 'Hook Set - Wholesale',
        name_retail: 'Premium Fishing Hook Assortment',
        name_daraz: '100-Piece Fishing Hook Kit',
        inventory_quantity: 400,
        inventory_policy: 'continue',
        has_variants: false,
        status: 'active',
        featured: false,
        barcode: 'FA0071234567890',
        hs_code: '9507.90.00',
        seo_title: 'Fishing Hook Set | Hook & Hunt',
        seo_description: '100-piece assorted fishing hook set. High-carbon steel with sharp points.',
        search_keywords: [
            'fishing hooks',
            'hook set',
            'assorted hooks',
            'sharp hooks'
        ],
        created_at: '2024-02-10T10:00:00Z',
        updated_at: '2024-02-16T15:30:00Z',
        name: 'Fishing Hook Set Assorted',
        price: 750,
        originalPrice: 900,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        stock: 400,
        rating: 4.7,
        reviews: 92,
        category: 'Fishing Accessories',
        variant_count: 0,
        price_range_display: '৳750',
        has_offer: true
    },
    {
        id: 8,
        product_code: 'FF-008',
        title: 'Fishing Float/Bobber Set',
        slug: 'fishing-float-bobber-set',
        sku: 'FF-008-30PCS',
        description: 'Set of 30 fishing floats in various sizes and colors. Lightweight and highly visible. Perfect for fresh and saltwater fishing.',
        short_description: '30-piece fishing float set - various sizes',
        supplier_id: 3,
        product_link: 'https://example.com/product/float-set',
        category_id: 6,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'float',
            'bobber',
            'accessories',
            'indicator'
        ],
        featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop'
        ],
        weight: 200,
        unit: 'g',
        cost_rmb: 12,
        exchange_rate: 23.5,
        cost_bdt: 282,
        actual_price: 550,
        default_price: 550,
        compare_at_price: 0,
        price_wholesale: 500,
        price_retail: 550,
        price_daraz: 600,
        name_wholesale: 'Float Set - Wholesale',
        name_retail: 'Premium Fishing Float Set',
        name_daraz: '30-Piece Fishing Bobber Kit',
        inventory_quantity: 350,
        inventory_policy: 'continue',
        has_variants: false,
        status: 'active',
        featured: false,
        barcode: 'FF0081234567890',
        hs_code: '9507.90.00',
        seo_title: 'Fishing Float Set | Hook & Hunt',
        seo_description: '30-piece fishing float set in various sizes and colors. Highly visible.',
        search_keywords: [
            'fishing floats',
            'bobbers',
            'fishing indicators',
            'strike indicators'
        ],
        created_at: '2024-02-12T10:00:00Z',
        updated_at: '2024-02-17T15:30:00Z',
        name: 'Fishing Float/Bobber Set',
        price: 550,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
        stock: 350,
        rating: 4.2,
        reviews: 34,
        category: 'Fishing Accessories',
        variant_count: 0,
        price_range_display: '৳550',
        has_offer: false
    },
    {
        id: 9,
        product_code: 'FN-009',
        title: 'Fishing Net Landing',
        slug: 'fishing-net-landing',
        sku: 'FN-009-FOLDABLE',
        description: 'Folding landing net with telescopic handle. Extends to 1.8 meters. Hexagonal mesh design with rubber coating for fish-friendly catch.',
        short_description: 'Foldable landing net with telescopic handle - 1.8m',
        supplier_id: 4,
        product_link: 'https://example.com/product/landing-net',
        category_id: 7,
        brand: 'Hook & Hunt Pro',
        tags: [
            'fishing',
            'net',
            'landing',
            'telescopic',
            'accessories'
        ],
        featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop'
        ],
        weight: 650,
        unit: 'g',
        cost_rmb: 48,
        exchange_rate: 23.5,
        cost_bdt: 1128,
        actual_price: 1900,
        default_price: 1900,
        compare_at_price: 2300,
        price_wholesale: 1750,
        price_retail: 1900,
        price_daraz: 2100,
        name_wholesale: 'Landing Net - Wholesale',
        name_retail: 'Pro Folding Landing Net',
        name_daraz: 'Telescopic Fishing Landing Net',
        inventory_quantity: 85,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: false,
        barcode: 'FN0091234567890',
        hs_code: '9507.90.00',
        seo_title: 'Fishing Landing Net | Hook & Hunt',
        seo_description: 'Folding landing net with telescopic handle. Fish-friendly rubber coating.',
        search_keywords: [
            'landing net',
            'fishing net',
            'telescopic net',
            'folding net'
        ],
        created_at: '2024-02-15T10:00:00Z',
        updated_at: '2024-02-19T15:30:00Z',
        name: 'Fishing Net Landing',
        price: 1900,
        originalPrice: 2300,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        stock: 85,
        rating: 4.6,
        reviews: 51,
        category: 'Fishing Nets',
        variant_count: 2,
        price_range_display: '৳1,750 - ৳2,100',
        has_offer: true
    },
    {
        id: 10,
        product_code: 'FF-010',
        title: 'Fishing Vest Multi-Pocket',
        slug: 'fishing-vest-multi-pocket',
        sku: 'FF-010-L',
        description: 'Lightweight fishing vest with multiple pockets. Breathable mesh back for comfort. Quick-dry fabric with adjustable fit.',
        short_description: 'Multi-pocket fishing vest - breathable mesh',
        supplier_id: 4,
        product_link: 'https://example.com/product/fishing-vest',
        category_id: 8,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'vest',
            'apparel',
            'multi-pocket',
            'outdoor'
        ],
        featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop'
        ],
        weight: 450,
        unit: 'g',
        cost_rmb: 38,
        exchange_rate: 23.5,
        cost_bdt: 893,
        actual_price: 1600,
        default_price: 1600,
        compare_at_price: 0,
        price_wholesale: 1450,
        price_retail: 1600,
        price_daraz: 1750,
        name_wholesale: 'Fishing Vest - Wholesale',
        name_retail: 'Pro Multi-Pocket Fishing Vest',
        name_daraz: 'Lightweight Fishing Vest with Pockets',
        inventory_quantity: 95,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: false,
        barcode: 'FF0101234567890',
        hs_code: '6211.33.00',
        seo_title: 'Fishing Vest | Hook & Hunt',
        seo_description: 'Multi-pocket fishing vest with breathable mesh. Quick-dry fabric.',
        search_keywords: [
            'fishing vest',
            'fishing apparel',
            'multi-pocket vest',
            'outdoor vest'
        ],
        created_at: '2024-02-18T10:00:00Z',
        updated_at: '2024-02-20T15:30:00Z',
        name: 'Fishing Vest Multi-Pocket',
        price: 1600,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop',
        stock: 95,
        rating: 4.5,
        reviews: 28,
        category: 'Fishing Apparel',
        variant_count: 4,
        price_range_display: '৳1,450 - ৳1,750',
        has_offer: false
    },
    {
        id: 11,
        product_code: 'FS-011',
        title: 'Fishing Scale Digital',
        slug: 'fishing-scale-digital',
        sku: 'FS-011-50KG',
        description: 'Digital fishing scale with 50kg capacity. Backlit LCD display for easy reading. Waterproof design with durable construction.',
        short_description: 'Digital fishing scale - 50kg capacity with backlight',
        supplier_id: 5,
        product_link: 'https://example.com/product/fishing-scale',
        category_id: 9,
        brand: 'Hook & Hunt',
        tags: [
            'fishing',
            'scale',
            'digital',
            'accessories',
            'weighing'
        ],
        featured_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop'
        ],
        weight: 180,
        unit: 'g',
        cost_rmb: 22,
        exchange_rate: 23.5,
        cost_bdt: 517,
        actual_price: 1100,
        default_price: 1100,
        compare_at_price: 0,
        price_wholesale: 1000,
        price_retail: 1100,
        price_daraz: 1200,
        name_wholesale: 'Fishing Scale - Wholesale',
        name_retail: 'Digital Fishing Scale Pro',
        name_daraz: 'Electronic Fish Weighing Scale',
        inventory_quantity: 220,
        inventory_policy: 'continue',
        has_variants: false,
        status: 'active',
        featured: false,
        barcode: 'FS0111234567890',
        hs_code: '8423.10.00',
        seo_title: 'Digital Fishing Scale | Hook & Hunt',
        seo_description: 'Digital fishing scale with 50kg capacity. Backlit LCD display.',
        search_keywords: [
            'fishing scale',
            'digital scale',
            'fish weighing',
            'electronic scale'
        ],
        created_at: '2024-02-20T10:00:00Z',
        updated_at: '2024-02-21T15:30:00Z',
        name: 'Fishing Scale Digital',
        price: 1100,
        originalPrice: 0,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
        stock: 220,
        rating: 4.4,
        reviews: 63,
        category: 'Fishing Electronics',
        variant_count: 0,
        price_range_display: '৳1,100',
        has_offer: false
    },
    {
        id: 12,
        product_code: 'FR-012',
        title: 'Baitcasting Fishing Reel',
        slug: 'baitcasting-fishing-reel',
        sku: 'FR-012-LEFT',
        description: 'Professional baitcasting reel with smooth drag system. Magnetic braking system for precise casting. Aluminum alloy construction with ergonomic handle.',
        short_description: 'Professional baitcasting reel with magnetic brake',
        supplier_id: 1,
        product_link: 'https://example.com/product/baitcasting-reel',
        category_id: 2,
        brand: 'Hook & Hunt Pro',
        tags: [
            'fishing',
            'reel',
            'baitcasting',
            'professional',
            'magnetic'
        ],
        featured_image: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop'
        ],
        weight: 280,
        unit: 'g',
        cost_rmb: 95,
        exchange_rate: 23.5,
        cost_bdt: 2232,
        actual_price: 3800,
        default_price: 3800,
        compare_at_price: 4500,
        price_wholesale: 3500,
        price_retail: 3800,
        price_daraz: 4200,
        name_wholesale: 'Baitcasting Reel - Wholesale',
        name_retail: 'Pro Baitcasting Fishing Reel',
        name_daraz: 'Premium Baitcast Reel Magnetic',
        inventory_quantity: 75,
        inventory_policy: 'continue',
        has_variants: true,
        status: 'active',
        featured: true,
        barcode: 'FR0121234567890',
        hs_code: '9507.00.00',
        seo_title: 'Baitcasting Fishing Reel | Hook & Hunt',
        seo_description: 'Professional baitcasting reel with magnetic braking system.',
        search_keywords: [
            'baitcasting reel',
            'baitcast reel',
            'magnetic brake',
            'casting reel'
        ],
        created_at: '2024-02-22T10:00:00Z',
        updated_at: '2024-02-23T15:30:00Z',
        name: 'Baitcasting Fishing Reel',
        price: 3800,
        originalPrice: 4500,
        image: 'https://images.unsplash.com/photo-1535581272126-f2a1c0fe7e21?w=800&h=800&fit=crop',
        stock: 75,
        rating: 4.9,
        reviews: 112,
        category: 'Fishing Reels',
        variant_count: 2,
        price_range_display: '৳3,500 - ৳4,200',
        has_offer: true
    }
];
const getProductsByCategory = (categoryId)=>{
    return staticProducts.filter((p)=>p.category_id === categoryId);
};
const getFeaturedProducts = ()=>{
    return staticProducts.filter((p)=>p.featured === true);
};
const getTrendingProducts = ()=>{
    return [
        ...staticProducts
    ].sort((a, b)=>{
        // Primary sort by rating (descending)
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        // Secondary sort by id (ascending) for deterministic order
        if (ratingDiff === 0) {
            return a.id - b.id;
        }
        return ratingDiff;
    }).slice(0, 12);
};
const getNewArrivals = ()=>{
    return [
        ...staticProducts
    ].sort((a, b)=>{
        // Primary sort by created_at (descending - newest first)
        const dateDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        // Secondary sort by id (descending) for deterministic order
        if (dateDiff === 0) {
            return b.id - a.id;
        }
        return dateDiff;
    }).slice(0, 12);
};
const getBestDeals = ()=>{
    return staticProducts.filter((p)=>p.has_offer === true);
};
const getRandomProducts = (count = 6)=>{
    // Use a simple deterministic selection based on index to avoid hydration issues
    // This ensures the same products are selected on every render
    return staticProducts.slice(0, count);
};
const getRecentlySoldProducts = (count = 6)=>{
    return staticProducts.slice(6, 6 + count);
};
const getRecommendedProducts = (count = 6)=>{
    return staticProducts.slice(0, count);
};
const getProductBySlug = (slug)=>{
    return staticProducts.find((p)=>p.slug === slug);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/LanguageSwitcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LanguageSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LanguageContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function LanguageSwitcher() {
    _s();
    const { language, changeLanguage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>changeLanguage('bn'),
                className: `px-2 py-0.5 text-xs font-medium transition-colors ${language === 'bn' ? 'bg-white text-[#bc1215]' : 'bg-transparent hover:bg-white/20'}`,
                children: "বাংলা"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/LanguageSwitcher.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>changeLanguage('en'),
                className: `px-2 py-0.5 text-xs font-medium transition-colors ${language === 'en' ? 'bg-white text-[#bc1215]' : 'bg-transparent hover:bg-white/20'}`,
                children: "EN"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/LanguageSwitcher.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/LanguageSwitcher.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_s(LanguageSwitcher, "YfQ/tjEUGa1Vo/lhAQnnbamvpP0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c = LanguageSwitcher;
var _c;
__turbopack_context__.k.register(_c, "LanguageSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/SocialLinks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SocialLinks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-[18px] h-[18px]",
            fill: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/SocialLinks.tsx",
                lineNumber: 11,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/layout/SocialLinks.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'YouTube',
        href: 'https://youtube.com',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-[18px] h-[18px]",
            fill: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/SocialLinks.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/layout/SocialLinks.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        name: 'Instagram',
        href: 'https://instagram.com',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-[18px] h-[18px]",
            fill: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/SocialLinks.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/layout/SocialLinks.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function SocialLinks() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3",
        children: socialLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: link.href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "hover:opacity-75 transition-opacity",
                "aria-label": link.name,
                children: link.icon
            }, link.name, false, {
                fileName: "[project]/src/components/layout/SocialLinks.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/layout/SocialLinks.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c = SocialLinks;
var _c;
__turbopack_context__.k.register(_c, "SocialLinks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/TopBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/LanguageSwitcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SocialLinks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/SocialLinks.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function TopBar() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const { toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#bc1215] text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center h-9 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: t('header.welcome')
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 19,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sm:hidden",
                                children: t('header.welcomeShort')
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 20,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/TopBar.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "tel:01841544590",
                                className: "flex items-center hover:opacity-80 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4 mr-1.5",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/TopBar.tsx",
                                            lineNumber: 28,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 27,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "01841544590"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 30,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 26,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$LanguageSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleTheme,
                                className: "hover:opacity-80 transition-opacity",
                                "aria-label": "Toggle theme",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-[18px] h-[18px]",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/TopBar.tsx",
                                        lineNumber: 43,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/TopBar.tsx",
                                    lineNumber: 42,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 37,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$SocialLinks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/TopBar.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/TopBar.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/TopBar.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/layout/TopBar.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/TopBar.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_s(TopBar, "vyNtK5dzUgrwJ0ZvkvqDjiz1SmM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = TopBar;
var _c;
__turbopack_context__.k.register(_c, "TopBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$static$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/static-products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/TopBar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function Header() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNavSticky, setIsNavSticky] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { getCartCount, toggleCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { isAuthenticated, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Prevent hydration mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            setMounted(true);
        }
    }["Header.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const handleScroll = {
                "Header.useEffect.handleScroll": ()=>{
                    setIsNavSticky(window.scrollY > 300);
                }
            }["Header.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "Header.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    const navItems = [
        {
            href: '/',
            label: t('nav.home'),
            icon: '🏠'
        },
        {
            href: '/hot-deals',
            label: t('nav.hotDeals'),
            icon: '🔥'
        },
        {
            href: '/products',
            label: t('nav.allProduct'),
            icon: '🎣'
        }
    ];
    const navItemsAfterCategory = [
        {
            href: '/track-order',
            label: t('nav.trackOrder'),
            icon: '📦'
        },
        {
            href: '/contact',
            label: t('nav.contact'),
            icon: '📞'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-white dark:bg-[#0a0a0a] z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$TopBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-4 py-3 sm:py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/hook-and-hunt-logo.svg",
                                    alt: "Hook & Hunt",
                                    width: 180,
                                    height: 60,
                                    className: "w-auto h-10 sm:h-12",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 57,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:flex flex-1 max-w-[400px] lg:max-w-[500px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative w-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: t('header.search'),
                                            className: "w-full h-10 px-4 pr-12 text-sm border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:border-[#bc1215] transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 70,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "absolute right-0 top-0 h-10 px-4 bg-[#bc1215] text-white rounded-r-md hover:bg-[#8a0e10] transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 76,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 75,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 sm:gap-6",
                                children: [
                                    mounted && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: isAuthenticated ? "/account" : "/login",
                                        className: "hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#bc1215] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 sm:w-6 sm:h-6",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 87,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm sm:text-base font-medium",
                                                children: isAuthenticated ? t('header.account') : t('header.login')
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 90,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 86,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleCart,
                                        className: "flex items-center gap-1 sm:gap-2 text-gray-700 dark:text-gray-300 hover:text-[#ec3137] transition-colors relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5 sm:w-6 sm:h-6",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Header.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 19
                                                }, this),
                                                mounted && getCartCount() > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute -top-2 -right-2 bg-[#ec3137] text-white text-[10px] sm:text-xs font-bold rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center px-1",
                                                    children: getCartCount()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 100,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "lg:hidden p-2 text-gray-700 dark:text-gray-300",
                                        onClick: ()=>setIsMenuOpen(!isMenuOpen),
                                        "aria-label": "Toggle menu",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-6 h-6",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: isMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 121,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M4 6h16M4 12h16M4 18h16"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 123,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Header.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `hidden lg:block bg-gray-50 dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${isNavSticky ? 'sticky top-0 z-40 shadow-md' : ''}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex items-center justify-start gap-6 sm:gap-8",
                        children: [
                            navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#ec3137] transition-colors relative group flex items-center gap-1",
                                    children: [
                                        item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 142,
                                            columnNumber: 31
                                        }, this),
                                        item.label,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute bottom-0 left-0 w-full h-0.5 bg-[#ec3137] transform scale-x-0 group-hover:scale-x-100 transition-transform"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                onMouseEnter: ()=>setIsCategoryDropdownOpen(true),
                                onMouseLeave: ()=>setIsCategoryDropdownOpen(false),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] transition-colors relative group flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "📁"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 155,
                                                columnNumber: 17
                                            }, this),
                                            t('nav.category'),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4 transition-transform group-hover:rotate-180",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M19 9l-7 7-7-7"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-opacity duration-200 ${isCategoryDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "max-h-[400px] overflow-y-auto",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$static$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["staticCategories"].map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/products?category=${category.slug}`,
                                                    className: "block px-4 py-2 text-sm md:text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors",
                                                    children: category.name
                                                }, category.id, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 164,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Header.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            navItemsAfterCategory.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] transition-colors relative group flex items-center gap-1",
                                    children: [
                                        item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 186,
                                            columnNumber: 31
                                        }, this),
                                        item.label,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 188,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 181,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Header.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: t('header.search'),
                                    className: "w-full h-10 px-4 pr-12 text-sm border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:border-[#bc1215] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "absolute right-0 top-0 h-10 px-4 bg-[#bc1215] text-white rounded-r-md hover:bg-[#8a0e10] transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 208,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex flex-col space-y-1",
                            children: [
                                navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: "px-4 py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#bc1215] transition-colors flex items-center gap-2",
                                        onClick: ()=>setIsMenuOpen(false),
                                        children: [
                                            item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: item.icon
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 222,
                                                columnNumber: 33
                                            }, this),
                                            item.label
                                        ]
                                    }, item.href, true, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-gray-200 dark:border-gray-800 pt-4 mt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-4 py-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "📁"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 19
                                                }, this),
                                                t('nav.category')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 229,
                                            columnNumber: 17
                                        }, this),
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$static$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["staticCategories"].map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/products?category=${category.slug}`,
                                                className: "block px-4 py-2 pl-8 text-sm md:text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#bc1215] transition-colors",
                                                onClick: ()=>setIsMenuOpen(false),
                                                children: category.name
                                            }, category.id, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 234,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-gray-200 dark:border-gray-800 pt-4 mt-4",
                                    children: navItemsAfterCategory.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.href,
                                            className: "px-4 py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#bc1215] transition-colors flex items-center gap-2",
                                            onClick: ()=>setIsMenuOpen(false),
                                            children: [
                                                item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Header.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 35
                                                }, this),
                                                item.label
                                            ]
                                        }, item.href, true, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 248,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 246,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 214,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 198,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Header.tsx",
                lineNumber: 197,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Header.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(Header, "9Vk5QXpoHWJk/GarjXMHPGkU8qc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Footer() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-gray-100 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-300 transition-colors duration-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-[1192px] mx-auto px-4 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "inline-block mb-5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white p-2.5 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/hook-and-hunt-logo.svg",
                                            alt: "Hook & Hunt",
                                            width: 140,
                                            height: 46,
                                            className: "h-11 w-auto"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 20,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                        lineNumber: 19,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 18,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[17px] text-gray-600 dark:text-gray-400 mb-4 leading-relaxed",
                                    children: t('footer.description')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 29,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mt-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://facebook.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#ec3137] transition-colors group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-gray-400 group-hover:text-white transition-colors",
                                                fill: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 40,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 39,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 33,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://youtube.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#ec3137] transition-colors group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-gray-400 group-hover:text-white transition-colors",
                                                fill: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 50,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 49,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 43,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://instagram.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#ec3137] transition-colors group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-gray-400 group-hover:text-white transition-colors",
                                                fill: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 60,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 59,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 53,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 32,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 17,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-gray-900 dark:text-white font-bold text-[17px] mb-5",
                                    children: t('footer.categories')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/products?category=rods",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 72,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('nav.rods')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 71,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/products?category=reels",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('nav.reels')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 77,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/products?category=lures",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('nav.lures')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 83,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 82,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/products?category=lines",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('nav.lines')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/products?category=accessories",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('nav.accessories')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 95,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-gray-900 dark:text-white font-bold text-[17px] mb-5",
                                    children: t('footer.customerService')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/about",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('footer.aboutUs')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 108,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/contact",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('footer.contactUs')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/shipping",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('footer.shipping')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 120,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/returns",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('footer.returns')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 126,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 125,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/privacy",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('footer.privacy')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/terms",
                                                className: "text-[17px] text-gray-600 dark:text-gray-400 hover:text-[#ec3137] transition-colors flex items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-gray-600 dark:bg-gray-700 rounded-full mr-2 group-hover:bg-[#ec3137] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('footer.terms')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-gray-900 dark:text-white font-bold text-[17px] mb-5",
                                    children: t('footer.getInTouch')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center flex-shrink-0 mr-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-[#ec3137]",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            fillRule: "evenodd",
                                                            d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",
                                                            clipRule: "evenodd"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-900 dark:text-white font-medium text-[17px] mb-0.5",
                                                            children: t('footer.location')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600 dark:text-gray-400 text-[17px]",
                                                            children: t('footer.address')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 150,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center flex-shrink-0 mr-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-[#ec3137]",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 164,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-900 dark:text-white font-medium text-[17px] mb-0.5",
                                                            children: t('footer.phone')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 168,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "tel:+8809613244200",
                                                            className: "text-gray-600 dark:text-gray-400 text-[17px] hover:text-[#ec3137] transition-colors",
                                                            children: t('footer.phoneNumber')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 161,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center flex-shrink-0 mr-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-[#ec3137]",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                                lineNumber: 177,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                                lineNumber: 178,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-900 dark:text-white font-medium text-[17px] mb-0.5",
                                                            children: t('footer.email')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 182,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "mailto:Support@hooknhunt.com",
                                                            className: "text-gray-600 dark:text-gray-400 text-[17px] hover:text-[#ec3137] transition-colors break-all",
                                                            children: t('footer.emailAddress')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 183,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Footer.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Footer.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-gray-300 dark:border-gray-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[1192px] mx-auto px-4 py-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row justify-between items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[17px] text-gray-600 dark:text-gray-400",
                                children: [
                                    "© ",
                                    t('footer.copyright')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Footer.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[17px] text-gray-600 dark:text-gray-400",
                                        children: t('footer.weAccept')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white px-3 py-1.5 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#1434CB] font-bold text-sm",
                                                    children: "VISA"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white px-3 py-1.5 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#EB001B] font-bold text-sm",
                                                    children: "MASTER"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 206,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white px-3 py-1.5 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[#016FD0] font-bold text-sm",
                                                    children: "AMEX"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 209,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/Footer.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Footer.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Footer.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Footer.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Footer.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Footer.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_s(Footer, "zlIdU9EjM2llFt74AbE2KsUJXyM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/AnimatedCounter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnimatedCounter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function AnimatedCounter({ value, duration = 800, className = '', prefix = '', suffix = '' }) {
    _s();
    const [displayValue, setDisplayValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    const [isAnimating, setIsAnimating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const prevValueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(value);
    const frameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const startTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedCounter.useEffect": ()=>{
            // If value hasn't changed, don't animate
            if (prevValueRef.current === value) {
                return;
            }
            setIsAnimating(true);
            const startValue = prevValueRef.current;
            const endValue = value;
            const difference = endValue - startValue;
            // Easing function (ease-out-cubic)
            const easeOutCubic = {
                "AnimatedCounter.useEffect.easeOutCubic": (t)=>{
                    return 1 - Math.pow(1 - t, 3);
                }
            }["AnimatedCounter.useEffect.easeOutCubic"];
            const animate = {
                "AnimatedCounter.useEffect.animate": (currentTime)=>{
                    if (!startTimeRef.current) {
                        startTimeRef.current = currentTime;
                    }
                    const elapsed = currentTime - startTimeRef.current;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = easeOutCubic(progress);
                    const currentValue = startValue + difference * easedProgress;
                    setDisplayValue(Math.round(currentValue));
                    if (progress < 1) {
                        frameRef.current = requestAnimationFrame(animate);
                    } else {
                        setDisplayValue(endValue);
                        setIsAnimating(false);
                        startTimeRef.current = undefined;
                        prevValueRef.current = endValue;
                    }
                }
            }["AnimatedCounter.useEffect.animate"];
            frameRef.current = requestAnimationFrame(animate);
            return ({
                "AnimatedCounter.useEffect": ()=>{
                    if (frameRef.current) {
                        cancelAnimationFrame(frameRef.current);
                    }
                }
            })["AnimatedCounter.useEffect"];
        }
    }["AnimatedCounter.useEffect"], [
        value,
        duration
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-block ${className}`,
        style: {
            transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
            color: isAnimating ? '#FFD700' : 'inherit',
            transition: 'all 0.2s ease-out',
            display: 'inline-block'
        },
        children: [
            prefix,
            displayValue.toLocaleString(),
            suffix
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/AnimatedCounter.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(AnimatedCounter, "rsnyBe0H2A/Xttza3BSOrUwDbF4=");
_c = AnimatedCounter;
var _c;
__turbopack_context__.k.register(_c, "AnimatedCounter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/cart/CartSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CartSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AnimatedCounter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/AnimatedCounter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function CartSidebar() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isCartOpen, closeCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const [mounted, setMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    // Fix hydration mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartSidebar.useEffect": ()=>{
            setMounted(true);
        }
    }["CartSidebar.useEffect"], []);
    // Prevent body scroll when cart is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartSidebar.useEffect": ()=>{
            if (isCartOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
            return ({
                "CartSidebar.useEffect": ()=>{
                    document.body.style.overflow = 'unset';
                }
            })["CartSidebar.useEffect"];
        }
    }["CartSidebar.useEffect"], [
        isCartOpen
    ]);
    if (!mounted) {
        return null;
    }
    const handleCheckout = ()=>{
        closeCart();
        router.push('/checkout');
    };
    const handleViewCart = ()=>{
        closeCart();
        router.push('/cart');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: closeCart,
                className: "jsx-5e5e6d7b6aabb1c" + " " + `fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
            }, void 0, false, {
                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-5e5e6d7b6aabb1c" + " " + `fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] bg-white dark:bg-[#0a0a0a] shadow-2xl z-[101] transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-5e5e6d7b6aabb1c" + " " + "bg-gradient-to-r from-[#ec3137] to-[#8a0f12] text-white p-5 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-5e5e6d7b6aabb1c" + " " + "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                className: "jsx-5e5e6d7b6aabb1c" + " " + "w-7 h-7",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                                                    className: "jsx-5e5e6d7b6aabb1c"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                lineNumber: 76,
                                                columnNumber: 15
                                            }, this),
                                            getCartCount() > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-5e5e6d7b6aabb1c" + " " + "absolute -top-2 -right-2 bg-white text-[#ec3137] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse",
                                                children: getCartCount()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                lineNumber: 85,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-5e5e6d7b6aabb1c",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-5e5e6d7b6aabb1c" + " " + "text-xl font-bold",
                                                children: t('cart.sidebar.title')
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                lineNumber: 91,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-5e5e6d7b6aabb1c" + " " + "text-xs text-white/90",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AnimatedCounter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        value: getCartCount(),
                                                        duration: 400
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 17
                                                    }, this),
                                                    ' ',
                                                    getCartCount() === 1 ? t('cart.sidebar.item') : t('cart.sidebar.items')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: closeCart,
                                "aria-label": "Close cart",
                                className: "jsx-5e5e6d7b6aabb1c" + " " + "p-2 hover:bg-white/20 rounded-full transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "w-6 h-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12",
                                        className: "jsx-5e5e6d7b6aabb1c"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-5e5e6d7b6aabb1c" + " " + "flex-1 overflow-y-auto p-1.5 space-y-3",
                        children: cartItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-5e5e6d7b6aabb1c" + " " + "flex flex-col items-center justify-center h-full text-center py-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "w-12 h-12 text-gray-400",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                                            className: "jsx-5e5e6d7b6aabb1c"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                            lineNumber: 131,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "text-xl font-bold text-gray-900 dark:text-white mb-2",
                                    children: t('cart.sidebar.empty')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "text-gray-600 dark:text-gray-400 mb-6",
                                    children: t('cart.sidebar.emptyMessage')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeCart,
                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "px-6 py-3 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-semibold transition-colors",
                                    children: t('common.continueShopping')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                    lineNumber: 145,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: cartItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        animationDelay: `${index * 50}ms`
                                    },
                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "flex gap-4 bg-gray-50 dark:bg-[#0f0f0f] p-4 border border-gray-200 dark:border-gray-800 animate-slideIn",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/products/${item.product.slug}`,
                                            onClick: closeCart,
                                            className: "flex-shrink-0 relative w-18 h-18",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: item.product.image || '/placeholder-image.jpg',
                                                alt: item.product.name || 'Product',
                                                fill: true,
                                                className: "object-cover hover:opacity-80 transition-opacity",
                                                sizes: "80px"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                lineNumber: 166,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                            lineNumber: 161,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-5e5e6d7b6aabb1c" + " " + "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "flex justify-between items-start mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/products/${item.product.slug}`,
                                                            onClick: closeCart,
                                                            className: "flex-1 mr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-[#ec3137] transition-colors",
                                                                    children: item.product.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 183,
                                                                    columnNumber: 25
                                                                }, this),
                                                                item.product.variant_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "text-xs text-gray-600 dark:text-gray-400",
                                                                    children: [
                                                                        "Variant: ",
                                                                        item.product.variant_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 187,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-5e5e6d7b6aabb1c" + " " + "flex items-center gap-2 flex-shrink-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "text-[#ec3137] font-bold text-base whitespace-nowrap",
                                                                    children: [
                                                                        "৳",
                                                                        (item.product.price || 0).toLocaleString()
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 195,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>removeFromCart(item.id),
                                                                    "aria-label": "Remove item",
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "w-4 h-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M6 18L18 6M6 6l12 12",
                                                                            className: "jsx-5e5e6d7b6aabb1c"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                            lineNumber: 204,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                        lineNumber: 203,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 198,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                            lineNumber: 194,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "flex items-center justify-between mt-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-5e5e6d7b6aabb1c" + " " + "flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>updateQuantity(item.id, item.quantity - 1),
                                                                    "aria-label": "Decrease quantity",
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors rounded",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "w-3 h-3",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2.5,
                                                                            d: "M20 12H4",
                                                                            className: "jsx-5e5e6d7b6aabb1c"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                            lineNumber: 225,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                        lineNumber: 224,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 219,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "w-8 text-center font-semibold text-gray-900 dark:text-white text-sm",
                                                                    children: item.quantity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 229,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>updateQuantity(item.id, item.quantity + 1),
                                                                    disabled: item.quantity >= (item.product.stock || 999),
                                                                    "aria-label": "Increase quantity",
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "w-3 h-3",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2.5,
                                                                            d: "M12 4v16m8-8H4",
                                                                            className: "jsx-5e5e6d7b6aabb1c"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                            lineNumber: 240,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                        lineNumber: 239,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 233,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                            lineNumber: 218,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-5e5e6d7b6aabb1c" + " " + "text-right",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "text-xs text-gray-600 dark:text-gray-400",
                                                                    children: "Subtotal"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "text-sm font-bold text-gray-900 dark:text-white",
                                                                    children: [
                                                                        "৳",
                                                                        ((item.product.price || 0) * item.quantity).toLocaleString()
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                                    lineNumber: 253,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 21
                                                }, this),
                                                item.quantity >= (item.product.stock || 999) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-5e5e6d7b6aabb1c" + " " + "text-xs text-orange-600 dark:text-orange-400 mt-1",
                                                    children: t('cart.sidebar.maxStock')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                            lineNumber: 176,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                    lineNumber: 155,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false)
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    cartItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-5e5e6d7b6aabb1c" + " " + "border-t border-gray-200 dark:border-gray-800 p-5 space-y-4 bg-gray-50 dark:bg-[#0f0f0f]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-5e5e6d7b6aabb1c" + " " + "flex justify-between items-center text-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "font-semibold text-gray-700 dark:text-gray-300",
                                        children: "Subtotal:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 277,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "font-bold text-2xl text-[#ec3137]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AnimatedCounter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            value: getCartTotal(),
                                            prefix: "৳",
                                            duration: 600
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                            lineNumber: 279,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-5e5e6d7b6aabb1c" + " " + "text-xs text-gray-600 dark:text-gray-400 text-center",
                                children: t('cart.sidebar.shippingNote')
                            }, void 0, false, {
                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                lineNumber: 288,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleViewCart,
                                className: "jsx-5e5e6d7b6aabb1c" + " " + "w-full py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "w-5 h-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                                                className: "jsx-5e5e6d7b6aabb1c"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                lineNumber: 298,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                                                className: "jsx-5e5e6d7b6aabb1c"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                                lineNumber: 304,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this),
                                    t('cart.sidebar.viewCart')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCheckout,
                                className: "jsx-5e5e6d7b6aabb1c" + " " + "w-full py-3 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-5e5e6d7b6aabb1c",
                                        children: t('cart.sidebar.proceedToCheckout')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 319,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        className: "jsx-5e5e6d7b6aabb1c" + " " + "w-5 h-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M9 5l7 7-7 7",
                                            className: "jsx-5e5e6d7b6aabb1c"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                            lineNumber: 321,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/cart/CartSidebar.tsx",
                        lineNumber: 274,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/cart/CartSidebar.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "5e5e6d7b6aabb1c",
                children: "@keyframes slideIn{0%{opacity:0;transform:translate(20px)}to{opacity:1;transform:translate(0)}}.animate-slideIn.jsx-5e5e6d7b6aabb1c{animation:.3s ease-out forwards slideIn}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
_s(CartSidebar, "GCQfqBhKl48xLDFbZ9Tk6/wqI5U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c = CartSidebar;
var _c;
__turbopack_context__.k.register(_c, "CartSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ErrorBoundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorBoundary",
    ()=>ErrorBoundary,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
        // Filter out third-party script errors
        if (error.message.includes('page-events') || error.message.includes('Cannot read properties of undefined (reading \'length\')')) {
            console.warn('Ignoring third-party script error:', error.message);
            this.setState({
                hasError: false,
                error: null
            });
            return;
        }
    }
    reset = ()=>{
        this.setState({
            hasError: false,
            error: null
        });
    };
    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FallbackComponent, {
                error: this.state.error,
                reset: this.reset
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorBoundary.tsx",
                lineNumber: 47,
                columnNumber: 14
            }, this);
        }
        return this.props.children;
    }
}
function DefaultErrorFallback({ error, reset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-[400px] flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "mx-auto h-12 w-12 text-red-500",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ErrorBoundary.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ErrorBoundary.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-medium text-gray-900 dark:text-white mb-2",
                    children: "Something went wrong"
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600 dark:text-gray-400 mb-4",
                    children: ("TURBOPACK compile-time truthy", 1) ? error?.message || 'An unexpected error occurred' : "TURBOPACK unreachable"
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: reset,
                    className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
                    children: "Try again"
                }, void 0, false, {
                    fileName: "[project]/src/components/ErrorBoundary.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ErrorBoundary.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ErrorBoundary.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c = DefaultErrorFallback;
const __TURBOPACK__default__export__ = ErrorBoundary;
var _c;
__turbopack_context__.k.register(_c, "DefaultErrorFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_6f003476._.js.map