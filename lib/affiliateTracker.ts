/**
 * Affiliate tracking utility for setting cookies and tracking partner IDs
 */

export interface AffiliateConfig {
  partnerId: string;
  cookieName: string;
  cookieExpiryDays: number;
  domain?: string;
}

// Default affiliate configuration
const DEFAULT_CONFIG: AffiliateConfig = {
  partnerId: '50210', // Your partner ID from the feeds
  cookieName: 'jewelry_partner_id',
  cookieExpiryDays: 30, // Cookie expires in 30 days
  domain: undefined // Will use current domain
};

/**
 * Sets an affiliate tracking cookie with the partner ID
 * @param config - Affiliate configuration
 */
export function setAffiliateCookie(config: Partial<AffiliateConfig> = {}): void {
  if (typeof window === 'undefined') return; // Server-side check
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Check if user has consented to marketing cookies
  const consent = localStorage.getItem('cookie-consent');
  if (consent) {
    const consentData = JSON.parse(consent);
    if (!consentData.marketing) {
      console.log('User has not consented to marketing cookies, skipping affiliate tracking');
      return;
    }
  }
  
  // Calculate expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + finalConfig.cookieExpiryDays);
  
  // Set the cookie
  const cookieValue = `${finalConfig.partnerId}_${Date.now()}`;
  const cookieString = `${finalConfig.cookieName}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax${finalConfig.domain ? `; domain=${finalConfig.domain}` : ''}`;
  
  document.cookie = cookieString;
  
  console.log(`Affiliate cookie set: ${finalConfig.cookieName}=${cookieValue}`);
}

/**
 * Gets the current affiliate cookie value
 * @param cookieName - Name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export function getAffiliateCookie(cookieName: string = DEFAULT_CONFIG.cookieName): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

/**
 * Tracks a click on an affiliate link and sets the cookie
 * @param productUrl - The original product URL
 * @param config - Affiliate configuration
 * @returns The URL with tracking parameters (if applicable)
 */
export function trackAffiliateClick(productUrl: string, config: Partial<AffiliateConfig> = {}): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Set the affiliate cookie
  setAffiliateCookie(finalConfig);
  
  // Add tracking parameters to the URL if it's a supported affiliate network
  try {
    const url = new URL(productUrl);
    
    // Check if this is a partner-ads.com URL (your current affiliate network)
    if (url.hostname.includes('partner-ads.com')) {
      // Add or update the partner ID parameter
      url.searchParams.set('partnerid', finalConfig.partnerId);
      
      // Add a timestamp for tracking
      url.searchParams.set('click_time', Date.now().toString());
      
      // Add referrer information
      url.searchParams.set('ref', 'jewelry_site');
      
      return url.toString();
    }
    
    // For other affiliate networks, you can add similar logic here
    // Example for other networks:
    // if (url.hostname.includes('other-affiliate-network.com')) {
    //   url.searchParams.set('affiliate_id', finalConfig.partnerId);
    //   return url.toString();
    // }
    
  } catch (error) {
    console.error('Error processing affiliate URL:', error);
  }
  
  // Return original URL if we can't process it
  return productUrl;
}

/**
 * Checks if affiliate tracking is enabled (user has consented)
 * @returns boolean indicating if tracking is enabled
 */
export function isAffiliateTrackingEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  const consent = localStorage.getItem('cookie-consent');
  if (!consent) return false;
  
  try {
    const consentData = JSON.parse(consent);
    return consentData.marketing === true;
  } catch {
    return false;
  }
}

/**
 * Removes the affiliate tracking cookie
 * @param cookieName - Name of the cookie to remove
 */
export function removeAffiliateCookie(cookieName: string = DEFAULT_CONFIG.cookieName): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log(`Affiliate cookie removed: ${cookieName}`);
}

/**
 * React hook for affiliate tracking
 */
export function useAffiliateTracking() {
  const trackClick = (productUrl: string, config?: Partial<AffiliateConfig>) => {
    return trackAffiliateClick(productUrl, config);
  };
  
  const setCookie = (config?: Partial<AffiliateConfig>) => {
    setAffiliateCookie(config);
  };
  
  const getCookie = (cookieName?: string) => {
    return getAffiliateCookie(cookieName);
  };
  
  const isEnabled = () => {
    return isAffiliateTrackingEnabled();
  };
  
  const removeCookie = (cookieName?: string) => {
    removeAffiliateCookie(cookieName);
  };
  
  return {
    trackClick,
    setCookie,
    getCookie,
    isEnabled,
    removeCookie
  };
}
