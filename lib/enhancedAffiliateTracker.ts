/**
 * Enhanced affiliate tracking utility that works across browser sessions and domains
 */

export interface EnhancedAffiliateConfig {
  partnerId: string;
  cookieName: string;
  cookieExpiryDays: number;
  domain?: string;
  // New: Support for cross-domain tracking
  useLocalStorage: boolean;
  useUrlParams: boolean;
  useReferrerTracking: boolean;
}

// Enhanced affiliate configuration
const ENHANCED_CONFIG: EnhancedAffiliateConfig = {
  partnerId: '50210',
  cookieName: 'jewelry_partner_id',
  cookieExpiryDays: 30,
  domain: undefined,
  useLocalStorage: true, // Fallback for cross-domain
  useUrlParams: true, // Add tracking to URLs
  useReferrerTracking: true // Track referrer information
};

/**
 * Enhanced affiliate tracking that works across browser sessions and domains
 */
export class EnhancedAffiliateTracker {
  private config: EnhancedAffiliateConfig;

  constructor(config: Partial<EnhancedAffiliateConfig> = {}) {
    this.config = { ...ENHANCED_CONFIG, ...config };
  }

  /**
   * Sets multiple tracking mechanisms for maximum persistence
   */
  setTracking(): void {
    if (typeof window === 'undefined') return;

    // Check consent
    if (!this.hasConsent()) {
      console.log('No marketing consent, skipping affiliate tracking');
      return;
    }

    const trackingId = `${this.config.partnerId}_${Date.now()}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.config.cookieExpiryDays);

    // 1. Set regular cookie (for same-domain tracking)
    const cookieString = `${this.config.cookieName}=${trackingId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = cookieString;

    // 2. Set localStorage (persists across sessions and domains)
    if (this.config.useLocalStorage) {
      try {
        localStorage.setItem(this.config.cookieName, trackingId);
        localStorage.setItem(`${this.config.cookieName}_expiry`, expiryDate.toISOString());
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
    }

    // 3. Set sessionStorage (for current session)
    try {
      sessionStorage.setItem(this.config.cookieName, trackingId);
    } catch (error) {
      console.warn('sessionStorage not available:', error);
    }

    // 4. Store in window object for immediate access
    (window as any).__affiliateTracking = {
      partnerId: this.config.partnerId,
      trackingId,
      timestamp: Date.now(),
      expiry: expiryDate.getTime()
    };

    console.log(`Enhanced affiliate tracking set: ${trackingId}`);
  }

  /**
   * Gets tracking ID from multiple sources
   */
  getTrackingId(): string | null {
    if (typeof window === 'undefined') return null;

    // Try localStorage first (most persistent)
    if (this.config.useLocalStorage) {
      try {
        const stored = localStorage.getItem(this.config.cookieName);
        const expiry = localStorage.getItem(`${this.config.cookieName}_expiry`);
        
        if (stored && expiry) {
          const expiryDate = new Date(expiry);
          if (expiryDate > new Date()) {
            return stored;
          } else {
            // Expired, clean up
            localStorage.removeItem(this.config.cookieName);
            localStorage.removeItem(`${this.config.cookieName}_expiry`);
          }
        }
      } catch (error) {
        console.warn('localStorage access failed:', error);
      }
    }

    // Try sessionStorage
    try {
      const sessionStored = sessionStorage.getItem(this.config.cookieName);
      if (sessionStored) return sessionStored;
    } catch (error) {
      console.warn('sessionStorage access failed:', error);
    }

    // Try regular cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.config.cookieName) {
        return value;
      }
    }

    // Try window object
    if ((window as any).__affiliateTracking) {
      const tracking = (window as any).__affiliateTracking;
      if (tracking.expiry > Date.now()) {
        return tracking.trackingId;
      }
    }

    return null;
  }

  /**
   * Enhanced URL tracking that works even for direct visits
   */
  trackClick(productUrl: string): string {
    // Set tracking if not already set
    if (!this.getTrackingId()) {
      this.setTracking();
    }

    try {
      const url = new URL(productUrl);
      
      // Add tracking parameters
      if (this.config.useUrlParams) {
        url.searchParams.set('partnerid', this.config.partnerId);
        url.searchParams.set('click_time', Date.now().toString());
        url.searchParams.set('ref', 'jewelry_site');
        
        // Add tracking ID for server-side verification
        const trackingId = this.getTrackingId();
        if (trackingId) {
          url.searchParams.set('tracking_id', trackingId);
        }
      }

      // Add referrer information
      if (this.config.useReferrerTracking && document.referrer) {
        url.searchParams.set('referrer', document.referrer);
      }

      return url.toString();
    } catch (error) {
      console.error('Error processing affiliate URL:', error);
      return productUrl;
    }
  }

  /**
   * Check if user has consented to marketing cookies
   */
  private hasConsent(): boolean {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) return false;
      
      const consentData = JSON.parse(consent);
      return consentData.marketing === true;
    } catch {
      return false;
    }
  }

  /**
   * Clean up expired tracking data
   */
  cleanup(): void {
    if (typeof window === 'undefined') return;

    try {
      const expiry = localStorage.getItem(`${this.config.cookieName}_expiry`);
      if (expiry && new Date(expiry) <= new Date()) {
        localStorage.removeItem(this.config.cookieName);
        localStorage.removeItem(`${this.config.cookieName}_expiry`);
        sessionStorage.removeItem(this.config.cookieName);
        delete (window as any).__affiliateTracking;
        console.log('Expired affiliate tracking data cleaned up');
      }
    } catch (error) {
      console.warn('Error cleaning up tracking data:', error);
    }
  }

  /**
   * Get tracking status
   */
  getStatus(): {
    hasTracking: boolean;
    trackingId: string | null;
    expiry: Date | null;
    sources: string[];
  } {
    const trackingId = this.getTrackingId();
    const sources: string[] = [];

    if (typeof window !== 'undefined') {
      // Check localStorage
      try {
        if (localStorage.getItem(this.config.cookieName)) {
          sources.push('localStorage');
        }
      } catch {}

      // Check sessionStorage
      try {
        if (sessionStorage.getItem(this.config.cookieName)) {
          sources.push('sessionStorage');
        }
      } catch {}

      // Check cookies
      if (document.cookie.includes(this.config.cookieName)) {
        sources.push('cookies');
      }

      // Check window object
      if ((window as any).__affiliateTracking) {
        sources.push('window');
      }
    }

    let expiry: Date | null = null;
    try {
      const expiryStr = localStorage.getItem(`${this.config.cookieName}_expiry`);
      if (expiryStr) {
        expiry = new Date(expiryStr);
      }
    } catch {}

    return {
      hasTracking: !!trackingId,
      trackingId,
      expiry,
      sources
    };
  }
}

// Export singleton instance
export const enhancedAffiliateTracker = new EnhancedAffiliateTracker();
