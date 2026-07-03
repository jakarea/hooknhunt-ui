'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const OTP_LENGTH = 5;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const from = searchParams.get('from') || 'register';
  const { verifyOtp, sendOtp } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no phone
  useEffect(() => {
    if (!phone) {
      const fallback = from === 'reset' ? '/forgot-password' : from === 'login' ? '/login' : '/registration';
      router.push(fallback);
    }
  }, [phone, from, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = useCallback(async (otpCode: string) => {
    if (otpCode.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setError('');

    try {
      await verifyOtp(phone, otpCode);
      router.push('/account');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || 'Invalid or expired OTP. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [phone, verifyOtp, router]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(d => d) && index === OTP_LENGTH - 1) {
      handleVerify(newOtp.join(''));
    }
  }, [otp, handleVerify]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newOtp = pastedData.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH);
    setOtp(newOtp);
    setError('');

    if (pastedData.length === OTP_LENGTH) {
      handleVerify(pastedData);
    }
  }, [handleVerify]);

  const handleResend = async () => {
    if (!canResend) return;

    setError('');
    setCountdown(120);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));

    try {
      await sendOtp(phone);
    } catch {
      setError('Failed to resend OTP. Please try again.');
      setCanResend(true);
      setCountdown(0);
    }
  };

  if (!phone) return null;

  return (
    <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#ec3137] to-[#8a0f12] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Phone</h2>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve sent a {OTP_LENGTH}-digit code to <span className="font-semibold">{phone}</span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center mb-6">
              {error}
            </div>
          )}

          {/* OTP Input */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className="w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#ec3137] focus:ring-2 focus:ring-[#ec3137]/20 bg-white dark:bg-[#2a2a2a] text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-6 w-6 text-[#ec3137]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={() => handleVerify(otp.join(''))}
            disabled={isLoading || otp.some(d => !d)}
            className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify & Continue
          </button>

          {/* Resend */}
          <div className="text-center mt-4">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-medium text-[#ec3137] hover:text-[#9a0f12] transition-colors"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-semibold text-[#ec3137]">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Check your SMS messages for the {OTP_LENGTH}-digit code</li>
                  <li>The code will expire in 2 minutes</li>
                  <li>If you don&apos;t receive it, click &quot;Resend OTP&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href={from === 'reset' ? '/forgot-password' : from === 'login' ? '/login' : '/registration'}
            className="text-sm text-gray-600 hover:text-red-700 transition-colors"
          >
            ← {from === 'reset' ? 'Back to Forgot Password' : from === 'login' ? 'Back to Login' : 'Change Phone Number'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
