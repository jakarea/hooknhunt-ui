'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  variantId?: number;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
  totalPrice?: number;
  total_price?: number;
  productName?: string;
  product_name?: string;
  variantName?: string;
  variant_name?: string;
  sku?: string;
  product_sku?: string;
  productSku?: string;
  product_code?: string;
  product_slug?: string;
  productSlug?: string;
  originalPrice?: number;
  original_price?: number;
  // Standardized image field
  image_url: string;
  image_id?: number;
  imageUrl?: string;
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
        orderNumber: order.invoice_no || order.orderNumber,
        subTotal: order.sub_total || order.subTotal,
        totalAmount: order.total_amount || order.totalAmount,
        deliveryCharge: order.delivery_charge || order.deliveryCharge,
        paidAmount: order.paid_amount || order.paidAmount,
        dueAmount: order.due_amount || order.dueAmount,
        createdAt: order.created_at || order.createdAt,
        items: (order.items || []).map((item: any) => ({
          ...item,
          unitPrice: item.unit_price ?? item.unitPrice,
          originalPrice: item.original_price ?? item.originalPrice,
          totalPrice: item.total_price ?? item.totalPrice,
          productName: item.product_name ?? item.productName,
          variantName: item.variant_name ?? item.variantName,
          productSku: item.product_sku ?? item.sku,
          productSlug: item.product_slug,
          imageUrl: item.image_url ?? item.imageUrl ?? item.thumbnailUrl,
        })),
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
    <>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              আমার অর্ডারসমূহ
            </h1>
            <p className="text-gray-600 mt-2">
              মোট অর্ডার: {orders.length}
            </p>
          </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    স্ট্যাটাস:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                  >
                    <option value="">সকল অর্ডার</option>
                    <option value="completed">সম্পন্ন</option>
                    <option value="shipped">পাঠানো হয়েছে</option>
                    <option value="processing">প্রক্রিয়াধীন</option>
                    <option value="pending">পেন্ডিং</option>
                    <option value="cancelled">বাতিল</option>
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
                          অর্ডার আইডি: <span className="text-red-700">#{order.orderNumber}</span> ({order.items?.length || 0} টি আইটেম)
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          অর্ডার তারিখ: {formatDate(order.createdAt)} | মোট: {formatCurrency(order.totalAmount)}
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
                          বিস্তারিত দেখুন
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="text-left px-4 py-3 font-semibold text-gray-900">Product</th>
                              <th className="text-left px-4 py-3 font-semibold text-gray-900">Variant</th>
                              <th className="text-left px-4 py-3 font-semibold text-gray-900">SKU</th>
                              <th className="text-center px-4 py-3 font-semibold text-gray-900">Qty</th>
                              <th className="text-right px-4 py-3 font-semibold text-gray-900">Price</th>
                              <th className="text-right px-4 py-3 font-semibold text-gray-900">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                {/* Product with Thumbnail */}
                                <td className="px-4 py-4">
                                  <a
                                    href={`/products/${item.productSlug || item.productName?.toLowerCase().replace(/\s+/g, '-')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 hover:opacity-80 transition"
                                  >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={
                                          item.imageUrl ||
                                          item.image_url ||
                                          item.thumbnailUrl ||
                                          item.thumbnail_url ||
                                          item.product_image ||
                                          item.productImage ||
                                          item.image ||
                                          '/placeholder-image.jpg'
                                        }
                                        alt={item.productName || item.product_name || 'Product'}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="font-medium text-gray-900 hover:text-[#bc1215]">
                                      {item.productName || item.product_name}
                                    </span>
                                  </a>
                                </td>

                                {/* Variant Name */}
                                <td className="px-4 py-4 text-gray-600">
                                  {item.variantName || item.variant_name || '-'}
                                </td>

                                {/* SKU */}
                                <td className="px-4 py-4 text-gray-600 font-mono text-xs">
                                  {item.productSku || item.product_sku || item.sku || item.product_code || '-'}
                                </td>

                                {/* Quantity */}
                                <td className="px-4 py-4 text-center font-medium">
                                  {item.quantity}
                                </td>

                                {/* Price (Unit Price & Offer Price merged) */}
                                <td className="px-4 py-4 text-right">
                                  <div className="flex flex-col items-end gap-1">
                                    {item.originalPrice && item.originalPrice !== item.unitPrice ? (
                                      <>
                                        <del className="text-xs text-gray-400">
                                          {formatCurrency(item.unitPrice)}
                                        </del>
                                        <span className="text-[#bc1215] font-semibold">
                                          {formatCurrency(item.originalPrice)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="font-medium text-gray-900">
                                        {formatCurrency(item.unitPrice)}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Total */}
                                <td className="px-4 py-4 text-right font-bold text-[#bc1215]">
                                  {formatCurrency(item.totalPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                      {order.status === 'completed' && (
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors">
                          রিভিউ দিন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">কোনো অর্ডার পাওয়া যায়নি</h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus
                    ? `"${selectedStatus}" স্ট্যাটাসে কোনো অর্ডার পাওয়া যায়নি`
                    : 'আপনি এখনো কোনো অর্ডার করেননি'
                  }
                </p>
                <Link
                  href="/products"
                  className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block"
                >
                পণ্য দেখুন
                </Link>
              </div>
            )}
      </>
    );
}
