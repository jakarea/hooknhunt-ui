'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import type { SalesOrder } from '@/types/api'

// SVG Icons
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function CreditCard({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7m7-7V19" />
    </svg>
  )
}

function ExternalLink({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  )
}

function ShoppingBag({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export default function PaymentInitiationPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  // Handle the case where orderId could be string | string[] | undefined
  const orderId = typeof params.orderId === 'string' ? params.orderId : Array.isArray(params.orderId) ? params.orderId[0] : null

  const [order, setOrder] = useState<SalesOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [initiating, setInitiating] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Fetch order details
  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      router.push('/')
      return
    }

    try {
      const api = (await import('@/lib/api')).default
      const response = await api.getOrderByOrderNumber(orderId)

      if (response.data) {
        const orderData = response.data as SalesOrder

        // Check if order is already paid
        if (orderData.paymentStatus === 'paid') {
          // Order already paid, redirect to success page
          router.push(`/order-success?invoice=${orderData.orderNumber}&payment=eps`)
          return
        }

        setOrder(orderData)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
      toast.error('Failed to load order details')
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
      const response = await api.initiateEpsPayment({
        sales_order_id: order.id,
        customer_name: order.customer?.name || '',
        customer_email: order.customer?.email || '',
        customer_phone: order.customer?.phone || '',
        customer_address: {
          address_line1: order.shipping?.address || '',
          address_line2: '',
          city: order.shipping?.city || '',
          postal_code: '',
          country: 'Bangladesh',
        },
      })

      const gatewayUrl = (response.data as any)?.gatewayUrl as string | undefined

      if (gatewayUrl) {
        // Open payment gateway in new tab
        const paymentWindow = window.open(gatewayUrl, '_blank', 'noopener,noreferrer,width=1000,height=800')

        if (!paymentWindow) {
          // Popup blocked - auto fallback to same window redirect
          window.location.href = gatewayUrl
        } else {
          // Successfully opened - show notification
          toast.success('Payment gateway opened. Complete your payment in the new tab.')
        }
      } else {
        throw new Error('Payment gateway URL not received')
      }
    } catch (error: any) {
      console.error('Payment initiation failed:', error)
      const errorMessage = error?.message || 'Payment initiation failed'
      setPaymentError(errorMessage)
      toast.error(errorMessage)
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
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-md p-6 mb-6">
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
                ৳{order.total?.toFixed(2) || '0.00'} BDT
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
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-md p-6">
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
                <span>Pay Now ৳{order.total?.toFixed(2) || '0.00'} BDT</span>
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
