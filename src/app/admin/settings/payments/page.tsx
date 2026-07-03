'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentSettings {
  active_gateway: string;
  available_gateways: string[];
  sslcommerz: {
    mode: string;
    sandbox_configured: boolean;
    live_configured: boolean;
    sandbox_store_id?: string;
    live_store_id?: string;
  };
  eps: {
    mode: string;
    sandbox_configured: boolean;
    live_configured: boolean;
    sandbox_store_id?: string;
    live_store_id?: string;
    callbacks_configured: {
      success: boolean;
      fail: boolean;
      cancel: boolean;
      ipn: boolean;
    };
  };
}

export default function PaymentSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch payment settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/system/settings/payment`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      } else {
        throw new Error('Failed to fetch payment settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', 'Failed to load payment settings');
    } finally {
      setLoading(false);
    }
  };

  // Switch active gateway
  const switchGateway = async (gateway: string) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/system/settings/payment/gateway`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gateway }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
        showMessage('success', `Switched to ${gateway.toUpperCase()} successfully`);
      } else {
        throw new Error('Failed to switch gateway');
      }
    } catch (error) {
      console.error('Error switching gateway:', error);
      showMessage('error', 'Failed to switch payment gateway');
    } finally {
      setSaving(false);
    }
  };

  // Test EPS connection
  const testEPS = async (mode: 'sandbox' | 'live') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/system/settings/payment/eps/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode }),
      });

      if (response.ok) {
        const data = await response.json();
        showMessage('success', `EPS ${mode} connection test successful`);
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      console.error('Error testing EPS:', error);
      showMessage('error', `EPS ${mode} connection test failed`);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Payment Gateway Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-200 mt-2">
          Manage and configure your payment gateways
        </p>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Active Gateway Selector */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Active Payment Gateway
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SSLCommerz Card */}
          <div
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              settings?.active_gateway === 'sslcommerz'
                ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-400 hover:border-gray-300'
            }`}
            onClick={() => settings?.active_gateway !== 'sslcommerz' && switchGateway('sslcommerz')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">SSLCommerz</h3>
              {settings?.active_gateway === 'sslcommerz' && (
                <span className="bg-[#ec3137] text-white text-xs px-2 py-1 rounded">ACTIVE</span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>Mode:</span>
                <span className="font-medium">{settings?.sslcommerz.mode}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Sandbox:</span>
                <span className={`font-medium ${settings?.sslcommerz.sandbox_configured ? 'text-green-600' : 'text-red-600'}`}>
                  {settings?.sslcommerz.sandbox_configured ? '✓ Configured' : '✗ Not Configured'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Live:</span>
                <span className={`font-medium ${settings?.sslcommerz.live_configured ? 'text-green-600' : 'text-red-600'}`}>
                  {settings?.sslcommerz.live_configured ? '✓ Configured' : '✗ Not Configured'}
                </span>
              </div>
            </div>
            {settings?.active_gateway !== 'sslcommerz' && (
              <button className="mt-4 w-full bg-[#ec3137] text-white py-2 rounded hover:bg-[#c9282e] transition-colors">
                Switch to SSLCommerz
              </button>
            )}
          </div>

          {/* EPS Card */}
          <div
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              settings?.active_gateway === 'eps'
                ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-400 hover:border-gray-300'
            }`}
            onClick={() => settings?.active_gateway !== 'eps' && switchGateway('eps')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">EPS Payment</h3>
              {settings?.active_gateway === 'eps' && (
                <span className="bg-[#ec3137] text-white text-xs px-2 py-1 rounded">ACTIVE</span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>Mode:</span>
                <span className="font-medium">{settings?.eps.mode}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Sandbox:</span>
                <span className={`font-medium ${settings?.eps.sandbox_configured ? 'text-green-600' : 'text-red-600'}`}>
                  {settings?.eps.sandbox_configured ? '✓ Configured' : '✗ Not Configured'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Live:</span>
                <span className={`font-medium ${settings?.eps.live_configured ? 'text-green-600' : 'text-red-600'}`}>
                  {settings?.eps.live_configured ? '✓ Configured' : '✗ Not Configured'}
                </span>
              </div>
            </div>
            {settings?.active_gateway !== 'eps' && (
              <button className="mt-4 w-full bg-[#ec3137] text-white py-2 rounded hover:bg-[#c9282e] transition-colors">
                Switch to EPS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EPS Configuration Details */}
      {settings?.active_gateway === 'eps' && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            EPS Configuration Details
          </h2>

          {/* Credentials Status */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-100">Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-2">Sandbox</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Store ID:</span>
                    <span className="font-mono">{settings.eps.sandbox_store_id || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Password:</span>
                    <span>••••••••</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base URL:</span>
                    <span className="text-xs text-gray-500">sandbox.sslcommerz.com</span>
                  </div>
                </div>
                <button
                  onClick={() => testEPS('sandbox')}
                  className="mt-3 w-full bg-gray-100 dark:bg-[#1a1a1a] py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Test Sandbox Connection
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="font-medium mb-2">Live</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Store ID:</span>
                    <span className="font-mono">{settings.eps.live_store_id || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Password:</span>
                    <span>••••••••</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base URL:</span>
                    <span className="text-xs text-gray-500">securepay.sslcommerz.com</span>
                  </div>
                </div>
                <button
                  onClick={() => testEPS('live')}
                  className="mt-3 w-full bg-gray-100 dark:bg-[#1a1a1a] py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Test Live Connection
                </button>
              </div>
            </div>
          </div>

          {/* Callback URLs Status */}
          <div>
            <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-100">Callback URLs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`border rounded-lg p-3 text-center ${settings.eps.callbacks_configured.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <div className="font-medium text-sm">Success</div>
                <div className="text-xs mt-1">{settings.eps.callbacks_configured.success ? '✓ Configured' : '✗ Missing'}</div>
              </div>
              <div className={`border rounded-lg p-3 text-center ${settings.eps.callbacks_configured.fail ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <div className="font-medium text-sm">Fail</div>
                <div className="text-xs mt-1">{settings.eps.callbacks_configured.fail ? '✓ Configured' : '✗ Missing'}</div>
              </div>
              <div className={`border rounded-lg p-3 text-center ${settings.eps.callbacks_configured.cancel ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <div className="font-medium text-sm">Cancel</div>
                <div className="text-xs mt-1">{settings.eps.callbacks_configured.cancel ? '✓ Configured' : '✗ Missing'}</div>
              </div>
              <div className={`border rounded-lg p-3 text-center ${settings.eps.callbacks_configured.ipn ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <div className="font-medium text-sm">IPN</div>
                <div className="text-xs mt-1">{settings.eps.callbacks_configured.ipn ? '✓ Configured' : '✗ Missing'}</div>
              </div>
            </div>
          </div>

          {/* Configuration Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              How to Configure EPS
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Get your EPS sandbox credentials from your EPS account</li>
              <li>Add them to your <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env</code> file:
                <ul className="ml-6 mt-1 space-y-1 list-disc">
                  <li><code className="text-xs">EPS_STORE_ID_SANDBOX=your_id</code></li>
                  <li><code className="text-xs">EPS_STORE_PASSWORD_SANDBOX=your_password</code></li>
                </ul>
              </li>
              <li>For production, add live credentials and set <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">EPS_MODE=live</code></li>
              <li>Ensure all callback URLs are publicly accessible</li>
            </ol>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                Only one payment gateway can be active at a time. When you switch gateways,
                customers will only see the selected payment method during checkout.
                Make sure to test the gateway in sandbox mode before switching to live.
              </p>
            </div>
          </div>
        </div>
      </div>

      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ec3137]"></div>
            <span>Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  );
}
