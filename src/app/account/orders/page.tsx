'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserNavigation from '@/components/user/UserNavigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  variantId?: number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
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

interface ShippingInfo {
  address: string;
  city: string | null;
  district: string;
  division: string;
  thana: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subTotal: number;
  totalAmount: number;
  deliveryCharge: number;
  paidAmount: number;
  dueAmount: number;
  shipping: ShippingInfo;
  items: OrderItem[];
  createdAt: string;
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.getOrders();

      const ordersData = response.data || response;
      const ordersArray = Array.isArray(ordersData)
        ? ordersData
        : ((ordersData as Record<string, unknown>)?.data as Order[]) || [];

      // Map API field names to frontend expectations
      const transformedOrders = ordersArray.map((order: any) => ({
        ...order,
        orderNumber: order.invoiceNo || order.orderNumber,
      }));

      setOrders(transformedOrders);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase())
    : orders;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | undefined | null) => {
    const safeAmount = amount ?? 0;
    return `৳${safeAmount.toLocaleString()}`;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fcf8f6]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/account" className="hover:text-red-700 transition-colors">My Account</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">My Orders</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <UserNavigation />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Orders
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Total Orders: {orders.length}
                  </p>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                  >
                    <option value="">All Orders</option>
                    <option value="completed">Completed</option>
                    <option value="shipped">Shipped</option>
                    <option value="processing">Processing</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order ID: <span className="text-red-700">#{order.orderNumber}</span> ({order.items?.length || 0} items)
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Order Date: {formatDate(order.createdAt)} | Total: {formatCurrency(order.totalAmount)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <Link
                          href={`/account/orders/${order.orderNumber}`}
                          className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            {/* Product Image */}
                            <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                              <Image
                                src={
                                  item.image_url ||
                                  item.thumbnailUrl ||
                                  item.thumbnail_url ||
                                  item.product_image ||
                                  item.productImage ||
                                  item.image ||
                                  '/placeholder-image.jpg'
                                }
                                alt={item.productName || 'Product image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => {
                                  // Image failed to load - fallback will be shown
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                {item.productName}
                              </h3>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-red-700">
                                    {formatCurrency(item.unitPrice)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Subtotal: {formatCurrency(item.totalPrice)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                      {order.status === 'completed' && (
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors">
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus
                    ? `No orders with status "${selectedStatus}" found.`
                    : "You haven't placed any orders yet."
                  }
                </p>
                <Link
                  href="/products"
                  className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
