// Payment Types for SSL Commerz Integration

/**
 * Customer address for payment
 */
export interface CustomerAddress {
  address_line1: string;
  address_line2?: string;
  city?: string;
  district?: string;
  country: string;
  postal_code?: string;
}

/**
 * Request payload for initiating payment
 */
export interface InitiatePaymentRequest {
  sales_order_id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address: CustomerAddress;
  emi_option?: number;
}

/**
 * Response from payment initiation
 */
export interface InitiatePaymentResponse {
  payment_id: number;
  gateway_url: string;
  tran_id: string;
  amount: number;
  currency: string;
  sandbox: boolean;
}

/**
 * Payment status values
 */
export type PaymentStatusType = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';

/**
 * Response from payment status check
 */
export interface PaymentStatusResponse {
  payment_id: number;
  tran_id: string;
  amount: number;
  status: PaymentStatusType;
  paid_at?: string;
  order_id: number;
  order_invoice: string;
  order_payment_status: 'unpaid' | 'paid' | 'partial';
}

/**
 * EMI option details
 */
export interface EmiOption {
  tenure: number;
  interest_rate: number;
  monthly_payment: number;
  total_amount: number;
  total_interest: number;
}

/**
 * Response from EMI options endpoint
 */
export interface EmiOptionsResponse {
  amount: number;
  currency: string;
  emi_enabled: boolean;
  min_amount: number;
  options: EmiOption[];
  banks: Record<number | string, string>;
}

/**
 * Payment callback response
 */
export interface PaymentCallbackResponse {
  payment_id: number;
  tran_id: string;
  order_id: number;
  order_invoice: string;
  amount: number;
  status: string;
  callback_type: 'success' | 'fail' | 'cancel';
}

/**
 * Error types for payment errors
 */
export enum PaymentErrorType {
  VALIDATION_ERROR = 'validation_error',
  ORDER_NOT_FOUND = 'order_not_found',
  ORDER_ALREADY_PAID = 'order_already_paid',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_CANCELLED = 'payment_cancelled',
  NETWORK_ERROR = 'network_error',
  INVALID_CALLBACK = 'invalid_callback',
}

/**
 * Custom payment error class
 */
export class PaymentError extends Error {
  constructor(
    public type: PaymentErrorType,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}
