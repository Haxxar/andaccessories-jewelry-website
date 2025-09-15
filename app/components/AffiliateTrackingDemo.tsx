'use client';

import { useState, useEffect } from 'react';
import { useAffiliateTracking } from '../../lib/affiliateTracker';

/**
 * Demo component to test affiliate tracking functionality
 * This can be used for testing and debugging affiliate tracking
 */
export default function AffiliateTrackingDemo() {
  const { trackClick, setCookie, getCookie, isEnabled, removeCookie } = useAffiliateTracking();
  const [cookieValue, setCookieValue] = useState<string | null>(null);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);

  useEffect(() => {
    setCookieValue(getCookie());
    setIsTrackingEnabled(isEnabled());
  }, []);

  const handleSetCookie = () => {
    setCookie();
    setCookieValue(getCookie());
    setIsTrackingEnabled(isEnabled());
  };

  const handleRemoveCookie = () => {
    removeCookie();
    setCookieValue(getCookie());
  };

  const handleTestClick = () => {
    const testUrl = 'https://www.partner-ads.com/dk/test?product=123';
    const trackedUrl = trackClick(testUrl);
    console.log('Original URL:', testUrl);
    console.log('Tracked URL:', trackedUrl);
    alert(`Tracked URL: ${trackedUrl}`);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Affiliate Tracking Demo</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Tracking Enabled:</span>
          <span className={`px-2 py-1 rounded text-sm ${isTrackingEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isTrackingEnabled ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Cookie Value:</span>
          <span className="text-sm text-gray-600 font-mono">
            {cookieValue || 'Not set'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSetCookie}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Set Cookie
          </button>
          
          <button
            onClick={handleRemoveCookie}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Remove Cookie
          </button>
          
          <button
            onClick={handleTestClick}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Test Click Tracking
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>How it works:</strong></p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Click "Set Cookie" to set the affiliate tracking cookie</li>
            <li>Click "Test Click Tracking" to see how URLs are modified</li>
            <li>The cookie will persist for 30 days</li>
            <li>Only works if user has consented to marketing cookies</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
