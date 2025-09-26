
'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowConsent(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    setShowConsent(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showSettings ? (
          // Main consent dialog
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <i className="ri-shield-check-line text-white text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Vi bruger cookies</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Vi bruger cookies for at forbedre din oplevelse på vores hjemmeside, 
              analysere trafik og tilpasse indhold. Ved at klikke &quot;Accepter alle&quot; 
              giver du samtykke til alle cookies.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-500 text-lg mt-1 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Nødvendige cookies</strong> er altid aktiveret for grundlæggende funktionalitet.
                  </p>
                  <p className="text-sm text-gray-600">
                    Du kan tilpasse dine præferencer ved at klikke på &quot;Indstillinger&quot;.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                Accepter alle
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                Indstillinger
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
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
                <i className="ri-close-line text-gray-500"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Nødvendige cookies</h4>
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Altid aktiv
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Disse cookies er nødvendige for, at hjemmesiden fungerer korrekt. 
                  De kan ikke deaktiveres.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Funktionelle cookies</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        functional: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Disse cookies husker dine præferencer og forbedrer din brugeroplevelse.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Analytiske cookies</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        analytics: e.target.checked
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Disse cookies hjælper os med at forstå, hvordan du bruger hjemmesiden.
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
                  Disse cookies bruges til at vise dig relevante annoncer på andre hjemmesider og spore affiliate links for at sikre korrekt provision når du køber produkter.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={acceptSelected}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                Gem indstillinger
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                Accepter alle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
