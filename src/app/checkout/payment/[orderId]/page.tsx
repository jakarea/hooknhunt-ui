'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import { Loader2, ShoppingBag, CreditCard, ArrowLeft, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { SalesOrder } from '@/types/api'

export default function PaymentInitiationPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = params.orderId

  const [order, setOrder] = useState<SalesOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [initiating, setInitiating] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Fetch order details
  const fetchOrder = useCallback(async () => {
    try {
      const api = (await import('@/lib/api')).default
      const response = await api.get(`/store/orders/${orderId}`)

      if (response.data) {
        const orderData = response.data as SalesOrder

        // Check if order is already paid
        if (orderData.paymentStatus === 'paid') {
          // Order already paid, redirect to success page
          router.push(`/order-success?invoice=${orderData.orderNumber}&payment=eps`)
          return
        }

        // Check if order is COD
        // Note: payment_method is not in the transformOrder response, so we check paymentStatus
        // For COD, paymentStatus would be 'unpaid' but user hasn't selected EPS
        // We'll need to fetch order details differently or handle this on backend
        // For now, proceed with payment page (COD orders shouldn't reach this page in normal flow)
        if (orderData.paymentStatus === 'paid') {
          router.push(`/order-success?invoice=${orderData.orderNumber}&payment=cod`)
          return
        }

        setOrder(orderData)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load order details',
        color: 'red',
      })
      // Redirect to home after delay
      setTimeout(() => router.push('/'), 3000)
    } finally {
      setLoading(false)
    }
  }, [orderId, router])

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId, fetchOrder])

  // Initiate payment with Pay Now button
  const handlePayNow = async () => {
    if (!order) return

    setInitiating(true)
    setPaymentError(null)

    try {
      const api = (await import('@/lib/api')).default

      // Initiate EPS payment
      const response = await api.post(`/store/payments/eps/initiate`, {
        sales_order_id: order.id,
        customer_name: order.customer?.name || '',
        customer_email: order.customer?.email || '',
        customer_phone: order.customer?.phone || '',
        customer_address: {
          address_line1: order.shipping?.address || '',
          address_line2: '', // Not available in transformOrder
          city: order.shipping?.city || '',
          postal_code: '', // Not available in transformOrder
          country: 'Bangladesh',
        },
        payment_method: 'eps',
      })

      if (response.data && response.data.gateway_url) {
        const gatewayUrl = response.data.gateway_url

        // Open payment gateway in new tab
        const paymentWindow = window.open(gatewayUrl, '_blank', 'noopener,noreferrer,width=1000,height=800')

        if (!paymentWindow) {
          // Popup blocked - show error with fallback
          setPaymentError('Popup was blocked. Please click the link below to open payment gateway.')
        } else {
          // Successfully opened - show notification
          notifications.show({
            title: 'Payment Gateway Opened',
            message: 'Complete your payment in the new tab. You will be redirected here after payment.',
            color: 'blue',
          })
        }
      } else {
        throw new Error('Payment gateway URL not received')
      }
    } catch (error: any) {
      console.error('Payment initiation failed:', error)
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Payment initiation failed'
      setPaymentError(errorMessage)
      notifications.show({
        title: 'Payment Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setInitiating(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#ec3137] mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  // No order found
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-[#ec3137] text-white rounded-lg hover:bg-[#c72b2f] transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <ShoppingBag className="h-8 w-8 text-[#ec3137] mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold">EPS Payment Gateway</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-lg text-[#ec3137]">
                ৳{order.totalAmount?.toFixed(2) || '0.00'} BDT
              </span>
            </div>
          </div>
        </div>

        {/* Payment Error */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Payment Error</h3>
                <p className="text-sm text-red-700">{paymentError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pay Now Button */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center mb-6">
            <CreditCard className="h-12 w-12 text-[#ec3137] mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Pay?</h2>
            <p className="text-gray-600">
              Click the button below to open the secure payment gateway. Complete your payment in the new tab.
            </p>
          </div>

          <button
            onClick={handlePayNow}
            disabled={initiating}
            className="w-full flex items-center justify-center gap-2 bg-[#ec3137] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#c72b2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initiating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Opening Payment Gateway...</span>
              </>
            ) : (
              <>
                <ExternalLink className="h-5 w-5" />
                <span>Pay Now ৳{order.totalAmount?.toFixed(2) || '0.00'} BDT</span>
              </>
            )}
          </button>

          {/* Fallback Link for Popup Blocker */}
          {paymentError && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Popup was blocked? Click here:</p>
              <button
                onClick={handlePayNow}
                className="inline-flex items-center text-[#ec3137] font-semibold hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Payment Gateway
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            You will be redirected to the secure EPS payment gateway. After payment, you will be returned to this page.
          </p>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact{' '}
            <a href="mailto:support@hooknhunt.com" className="text-[#ec3137] hover:underline">
              support@hooknhunt.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
