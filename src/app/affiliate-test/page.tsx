'use client';

import { useState } from 'react';

export default function AffiliateTestPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState('F9JMT');
  const [loading, setLoading] = useState(false);

  const addLog = (message: string, type: string = 'info', data: any = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ message, type, data, timestamp }, ...prev]);
  };

  const testTracking = async () => {
    if (loading) return;
    
    setLoading(true);
    addLog('Starting affiliate tracking test', 'info', { referralCode });

    try {
      addLog('Making API call to tracking endpoint', 'info');
      
      const response = await fetch('https://hooknhunt-api.test/api/v2/store/affiliate/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          referral_code: referralCode.toUpperCase(),
          landing_page: '/test',
          user_agent: navigator.userAgent,
        }),
      });

      addLog('Response received', 'info', {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-credentials': response.headers.get('access-control-allow-credentials'),
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      addLog('API response data', 'success', data);

      if (data.success && data.data) {
        addLog('Tracking successful! Storing in localStorage', 'success', {
          referralCode: referralCode.toUpperCase(),
          referralId: data.data.referralId,
        });

        localStorage.setItem('affiliate_referral', referralCode.toUpperCase());
        localStorage.setItem('affiliate_referral_id', String(data.data.referralId || ''));
        localStorage.setItem('affiliate_tracked_at', String(Date.now()));

        addLog('✅ AFFILIATE TRACKING COMPLETED SUCCESSFULLY!', 'success');
      }
    } catch (error: any) {
      addLog('Failed to track affiliate referral', 'error', {
        error: error.message,
        errorType: error.constructor.name,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const affiliateReferral = localStorage.getItem('affiliate_referral');
    const affiliateReferralId = localStorage.getItem('affiliate_referral_id');
    const affiliateTrackedAt = localStorage.getItem('affiliate_tracked_at');
    
    addLog('Current localStorage status', 'info', {
      affiliateReferral,
      affiliateReferralId,
      affiliateTrackedAt,
    });
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('affiliate_referral');
    localStorage.removeItem('affiliate_referral_id');
    localStorage.removeItem('affiliate_tracked_at');
    addLog('Cleared localStorage', 'warning');
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-500';
      case 'error': return 'bg-red-100 border-red-500';
      case 'warning': return 'bg-yellow-100 border-yellow-500';
      default: return 'bg-blue-100 border-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎯 Affiliate Tracking Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="Referral code"
            />
            <button
              onClick={testTracking}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Tracking'}
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setReferralCode('F9JMT')} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Test F9JMT
            </button>
            <button onClick={() => setReferralCode('TEST123')} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Test TEST123
            </button>
            <button onClick={checkLocalStorage} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Check LocalStorage
            </button>
            <button onClick={clearLocalStorage} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Clear Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className={`p-3 border-l-4 rounded ${getLogColor(log.type)}`}>
                <div className="font-semibold">[{log.timestamp}] {log.message}</div>
                {log.data && (
                  <pre className="mt-2 text-xs overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>API Base URL:</strong> https://hooknhunt-api.test/api/v2</p>
            <p><strong>Tracking Endpoint:</strong> /store/affiliate/track</p>
            <p><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}