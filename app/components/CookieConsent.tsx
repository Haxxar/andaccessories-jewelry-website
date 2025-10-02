'use client';

import React, { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onConsentChange?: (preferences: CookiePreferences) => void;
}

export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = getStoredConsent();
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(consent);
      onConsentChange?.(consent);
    }
  }, [onConsentChange]);

  const getStoredConsent = (): CookiePreferences | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem('cookie-consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          necessary: true, // Always true
          preferences: parsed.preferences || false,
          statistics: parsed.statistics || false,
          marketing: parsed.marketing || false
        };
      }
    } catch (error) {
      console.error('Error reading cookie consent:', error);
    }
    return null;
  };

  const saveConsent = (newPreferences: CookiePreferences) => {
    if (typeof window === 'undefined') return;
    
    const consentData = {
      ...newPreferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    
    // Set actual cookies based on preferences
    setCookies(newPreferences);
    
    // Notify parent component
    onConsentChange?.(newPreferences);
    
    console.log('Cookie consent saved:', newPreferences);
  };

  const setCookies = (prefs: CookiePreferences) => {
    if (typeof document === 'undefined') return;
    
    const domain = window.location.hostname;
    const isLocalhost = domain === 'localhost' || domain === '127.0.0.1';
    
    // Necessary cookies (always set)
    setCookie('necessary_cookies', 'true', 365, isLocalhost ? undefined : domain);
    
    // Preferences cookies
    if (prefs.preferences) {
      setCookie('preferences_cookies', 'true', 365, isLocalhost ? undefined : domain);
    } else {
      deleteCookie('preferences_cookies', isLocalhost ? undefined : domain);
    }
    
    // Statistics cookies
    if (prefs.statistics) {
      setCookie('statistics_cookies', 'true', 365, isLocalhost ? undefined : domain);
      // Initialize Google Analytics if consent given
      initializeAnalytics();
    } else {
      deleteCookie('statistics_cookies', isLocalhost ? undefined : domain);
      deleteCookie('_ga', isLocalhost ? undefined : domain);
      deleteCookie('_ga_*', isLocalhost ? undefined : domain);
    }
    
    // Marketing cookies
    if (prefs.marketing) {
      setCookie('marketing_cookies', 'true', 365, isLocalhost ? undefined : domain);
      // Initialize affiliate tracking
      initializeAffiliateTracking();
    } else {
      deleteCookie('marketing_cookies', isLocalhost ? undefined : domain);
      deleteCookie('jewelry_partner_id', isLocalhost ? undefined : domain);
    }
  };

  const setCookie = (name: string, value: string, days: number, domain?: string) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    if (domain && !domain.includes('localhost')) {
      cookieString += `; domain=${domain}`;
    }
    
    document.cookie = cookieString;
  };

  const deleteCookie = (name: string, domain?: string) => {
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    if (domain && !domain.includes('localhost')) {
      cookieString += `; domain=${domain}`;
    }
    document.cookie = cookieString;
  };

  const initializeAnalytics = () => {
    // Only initialize if Google Analytics is configured
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const initializeAffiliateTracking = () => {
    // Initialize affiliate tracking if consent given
    console.log('Affiliate tracking initialized with marketing consent');
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleWithdrawConsent = () => {
    // Clear all consent data
    localStorage.removeItem('cookie-consent');
    
    // Delete all non-necessary cookies
    const domain = window.location.hostname;
    const isLocalhost = domain === 'localhost' || domain === '127.0.0.1';
    
    deleteCookie('preferences_cookies', isLocalhost ? undefined : domain);
    deleteCookie('statistics_cookies', isLocalhost ? undefined : domain);
    deleteCookie('marketing_cookies', isLocalhost ? undefined : domain);
    deleteCookie('_ga', isLocalhost ? undefined : domain);
    deleteCookie('jewelry_partner_id', isLocalhost ? undefined : domain);
    
    // Reset preferences
    const resetPrefs: CookiePreferences = {
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false
    };
    setPreferences(resetPrefs);
    onConsentChange?.(resetPrefs);
    
    // Show banner again
    setShowBanner(true);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {!showSettings ? (
          // Main consent banner
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Vi bruger cookies</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Vi bruger cookies for at forbedre din oplevelse på vores hjemmeside, 
              analysere trafik og tilpasse indhold. Nødvendige cookies er altid aktive, 
              men du kan vælge at acceptere eller afvise andre typer cookies.
            </p>

            <div className="bg-gradient-to-r from-yellow-50 to-pink-50 rounded-lg p-4 mb-6 border border-yellow-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Nødvendige cookies</strong> er altid aktiveret for grundlæggende funktionalitet.
                  </p>
                  <p className="text-sm text-gray-600">
                    Du kan tilpasse dine præferencer ved at klikke på "Indstillinger".
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Accepter alle
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Indstillinger
              </button>
              <button
                onClick={handleRejectAll}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Afvis alle
              </button>
            </div>
          </div>
        ) : (
          // Settings dialog
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Cookie indstillinger</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Nødvendige cookies</h4>
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Altid aktiv
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Disse cookies er nødvendige for, at hjemmesiden fungerer korrekt. 
                  De kan ikke deaktiveres og inkluderer session management og sikkerhed.
                </p>
              </div>

              {/* Preferences Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Præference cookies</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        preferences: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Disse cookies husker dine præferencer som sprog, region og brugerindstillinger.
                </p>
              </div>

              {/* Statistics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Statistik cookies</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.statistics}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        statistics: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Disse cookies hjælper os med at forstå, hvordan du bruger hjemmesiden via Google Analytics.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Marketing cookies</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        marketing: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Disse cookies bruges til affiliate tracking og at vise dig relevante annoncer.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Gem indstillinger
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Accepter alle
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleWithdrawConsent}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Tilbagetræk samtykke
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
