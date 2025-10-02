/**
 * Self-hosted cookie management utility
 * GDPR compliant without external dependencies
 */

export interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

export interface ConsentData {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

/**
 * Get stored cookie consent preferences
 */
export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('cookie-consent');
    if (stored) {
      const parsed: ConsentData = JSON.parse(stored);
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
}

/**
 * Save cookie consent preferences
 */
export function saveCookieConsent(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  
  const consentData: ConsentData = {
    ...preferences,
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
  
  localStorage.setItem('cookie-consent', JSON.stringify(consentData));
  
  // Set actual cookies based on preferences
  setCookiesBasedOnConsent(preferences);
  
  console.log('Cookie consent saved:', preferences);
}

/**
 * Set cookies based on user consent
 */
export function setCookiesBasedOnConsent(preferences: CookiePreferences): void {
  if (typeof document === 'undefined') return;
  
  const domain = window.location.hostname;
  const isLocalhost = domain === 'localhost' || domain === '127.0.0.1';
  
  // Necessary cookies (always set)
  setCookie('necessary_cookies', 'true', 365, isLocalhost ? undefined : domain);
  
  // Preferences cookies
  if (preferences.preferences) {
    setCookie('preferences_cookies', 'true', 365, isLocalhost ? undefined : domain);
  } else {
    deleteCookie('preferences_cookies', isLocalhost ? undefined : domain);
  }
  
  // Statistics cookies
  if (preferences.statistics) {
    setCookie('statistics_cookies', 'true', 365, isLocalhost ? undefined : domain);
    initializeAnalytics();
  } else {
    deleteCookie('statistics_cookies', isLocalhost ? undefined : domain);
    deleteCookie('_ga', isLocalhost ? undefined : domain);
    deleteCookie('_ga_*', isLocalhost ? undefined : domain);
  }
  
  // Marketing cookies
  if (preferences.marketing) {
    setCookie('marketing_cookies', 'true', 365, isLocalhost ? undefined : domain);
    initializeAffiliateTracking();
  } else {
    deleteCookie('marketing_cookies', isLocalhost ? undefined : domain);
    deleteCookie('jewelry_partner_id', isLocalhost ? undefined : domain);
  }
}

/**
 * Set a cookie with proper configuration
 */
export function setCookie(name: string, value: string, days: number, domain?: string): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  if (domain && !domain.includes('localhost')) {
    cookieString += `; domain=${domain}`;
  }
  
  document.cookie = cookieString;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, domain?: string): void {
  if (typeof document === 'undefined') return;
  
  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  if (domain && !domain.includes('localhost')) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

/**
 * Initialize Google Analytics if consent is given
 */
function initializeAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  // Only initialize if Google Analytics is configured
  if ((window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
}

/**
 * Initialize affiliate tracking if consent is given
 */
function initializeAffiliateTracking(): void {
  console.log('Affiliate tracking initialized with marketing consent');
}

/**
 * Check if user has given consent for a specific cookie type
 */
export function hasConsentFor(cookieType: keyof CookiePreferences): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  
  return consent[cookieType];
}

/**
 * Withdraw all consent and clear cookies
 */
export function withdrawConsent(): void {
  if (typeof window === 'undefined') return;
  
  // Clear consent data
  localStorage.removeItem('cookie-consent');
  
  // Delete all non-necessary cookies
  const domain = window.location.hostname;
  const isLocalhost = domain === 'localhost' || domain === '127.0.0.1';
  
  deleteCookie('preferences_cookies', isLocalhost ? undefined : domain);
  deleteCookie('statistics_cookies', isLocalhost ? undefined : domain);
  deleteCookie('marketing_cookies', isLocalhost ? undefined : domain);
  deleteCookie('_ga', isLocalhost ? undefined : domain);
  deleteCookie('jewelry_partner_id', isLocalhost ? undefined : domain);
  
  console.log('All consent withdrawn and cookies cleared');
}

/**
 * React hook for cookie consent management
 */
export function useCookieConsent() {
  const getConsent = () => getCookieConsent();
  const saveConsent = (preferences: CookiePreferences) => saveCookieConsent(preferences);
  const hasConsent = (type: keyof CookiePreferences) => hasConsentFor(type);
  const withdraw = () => withdrawConsent();
  
  return {
    getConsent,
    saveConsent,
    hasConsent,
    withdraw
  };
}
