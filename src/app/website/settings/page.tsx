'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface WebsiteSettings {
  facebookPixelId: string | null;
  facebookPixelCode: string | null;
  googleAnalyticsId: string | null;
  googleAnalyticsCode: string | null;
  googleTagManagerId: string | null;
  googleTagManagerCode: string | null;
  serviceChargeEnabled: boolean;
  serviceChargeAmount: number;
}

// Decode HTML entities to handle double-encoded content
function decodeHtmlEntities(text: string | null): string {
  if (!text) return '';
  if (typeof text !== 'string') return '';

  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export default function WebsiteSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<WebsiteSettings>({
    facebookPixelId: '',
    facebookPixelCode: '',
    googleAnalyticsId: '',
    googleAnalyticsCode: '',
    googleTagManagerId: '',
    googleTagManagerCode: '',
    serviceChargeEnabled: false,
    serviceChargeAmount: 0,
  });

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/website-admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);

        // Decode HTML entities if present
        const decodedData: WebsiteSettings = {
          ...data.data,
          facebookPixelCode: decodeHtmlEntities(data.data.facebookPixelCode),
          googleAnalyticsCode: decodeHtmlEntities(data.data.googleAnalyticsCode),
          googleTagManagerCode: decodeHtmlEntities(data.data.googleTagManagerCode),
        };

        setFormData(decodedData);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', 'Failed to load website settings');
    } finally {
      setLoading(false);
    }
  };

  // Show message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Save settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/website-admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showMessage('success', 'Website settings updated successfully');
        fetchSettings();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Website Settings</h1>

      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Facebook Pixel */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Facebook Pixel</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pixel ID
              </label>
              <input
                type="text"
                name="facebookPixelId"
                value={formData.facebookPixelId || ''}
                onChange={handleChange}
                placeholder="e.g., 123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pixel Code (Optional)
              </label>
              <textarea
                name="facebookPixelCode"
                value={formData.facebookPixelCode || ''}
                onChange={handleChange}
                placeholder="Paste your Meta Pixel tracking code here"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm resize-vertical"
              />
              <p className="text-xs text-gray-500 mt-2">
                Paste the complete &lt;script&gt; tag from Meta Pixel
              </p>
            </div>
          </div>
        </div>

        {/* Google Analytics */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Google Analytics</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Analytics ID
              </label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={formData.googleAnalyticsId || ''}
                onChange={handleChange}
                placeholder="e.g., G-XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Analytics Code (Optional)
              </label>
              <textarea
                name="googleAnalyticsCode"
                value={formData.googleAnalyticsCode || ''}
                onChange={handleChange}
                placeholder="Paste your Google Analytics tracking code here"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm resize-vertical"
              />
            </div>
          </div>
        </div>

        {/* Google Tag Manager */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Google Tag Manager</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Manager ID
              </label>
              <input
                type="text"
                name="googleTagManagerId"
                value={formData.googleTagManagerId || ''}
                onChange={handleChange}
                placeholder="e.g., GTM-XXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Manager Code (Optional)
              </label>
              <textarea
                name="googleTagManagerCode"
                value={formData.googleTagManagerCode || ''}
                onChange={handleChange}
                placeholder="Paste your Google Tag Manager tracking code here"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm resize-vertical"
              />
            </div>
          </div>
        </div>

        {/* Service Charge */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Service Charge</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="serviceChargeEnabled"
                id="serviceChargeEnabled"
                checked={formData.serviceChargeEnabled || false}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="serviceChargeEnabled" className="ml-2 text-sm font-medium text-gray-700">
                Enable Service Charge
              </label>
            </div>

            {formData.serviceChargeEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Charge Amount (%)
                </label>
                <input
                  type="number"
                  name="serviceChargeAmount"
                  value={formData.serviceChargeAmount || 0}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="e.g., 2.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 transition"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
