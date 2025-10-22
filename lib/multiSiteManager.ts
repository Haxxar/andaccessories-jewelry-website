// Multi-site configuration and management
export interface SiteConfig {
  id: string;
  name: string;
  domain: string;
  supabaseUrl: string;
  supabaseServiceKey: string;
  feedUrls: string[];
  categories: string[];
  brands: string[];
  materials: string[];
  enabled: boolean;
}

export interface SiteUpdateResult {
  siteId: string;
  siteName: string;
  success: boolean;
  productsFetched: number;
  productsInserted: number;
  errors: number;
  duration: number;
  errorMessage?: string;
  feedResults: Array<{
    url: string;
    success: boolean;
    productCount: number;
    error?: string;
  }>;
}

export class MultiSiteManager {
  private sites: SiteConfig[] = [];

  constructor() {
    this.loadSiteConfigurations();
  }

  private loadSiteConfigurations(): void {
    // Load site configurations from environment variables
    // You can expand this to load from a database or config file
    
    // Site 1: Jewelry website (current)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      this.sites.push({
        id: 'jewelry-site',
        name: 'Jewelry by Readdy',
        domain: 'andaccessories.dk',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        feedUrls: [
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=90897&feedid=2357',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=100221&feedid=2878',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=107324&feedid=3381',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=99218&feedid=2803',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=112634&feedid=3858',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=102133&feedid=3003',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=106164&feedid=3290',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=81998&feedid=1965',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=112943&feedid=3880',
          'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=111261&feedid=3711',
        ],
        categories: ['øreringe', 'ringe', 'armbånd', 'vedhæng', 'halskæder', 'ørestikker'],
        brands: ['Pandora', 'Julie Sandlau', 'Maria Black', 'Georg Jensen'],
        materials: ['guld', 'sølv', 'diamant', 'perle'],
        enabled: true
      });
    }

    // Site 2: Second website (example - you'll need to add your actual config)
    if (process.env.SITE2_SUPABASE_URL && process.env.SITE2_SUPABASE_SERVICE_KEY) {
      this.sites.push({
        id: 'site-2',
        name: 'Your Second Website',
        domain: 'your-second-site.com',
        supabaseUrl: process.env.SITE2_SUPABASE_URL,
        supabaseServiceKey: process.env.SITE2_SUPABASE_SERVICE_KEY,
        feedUrls: [
          // Add your second site's feed URLs here
          'https://example.com/feed1.xml',
          'https://example.com/feed2.xml',
        ],
        categories: ['category1', 'category2', 'category3'],
        brands: ['brand1', 'brand2', 'brand3'],
        materials: ['material1', 'material2'],
        enabled: true
      });
    }

    // Add more sites as needed...
  }

  getEnabledSites(): SiteConfig[] {
    return this.sites.filter(site => site.enabled);
  }

  getSiteById(siteId: string): SiteConfig | undefined {
    return this.sites.find(site => site.id === siteId);
  }

  getAllSites(): SiteConfig[] {
    return this.sites;
  }

  // Method to add a new site configuration
  addSite(siteConfig: SiteConfig): void {
    const existingIndex = this.sites.findIndex(site => site.id === siteConfig.id);
    if (existingIndex >= 0) {
      this.sites[existingIndex] = siteConfig;
    } else {
      this.sites.push(siteConfig);
    }
  }

  // Method to update site configuration
  updateSite(siteId: string, updates: Partial<SiteConfig>): boolean {
    const siteIndex = this.sites.findIndex(site => site.id === siteId);
    if (siteIndex >= 0) {
      this.sites[siteIndex] = { ...this.sites[siteIndex], ...updates };
      return true;
    }
    return false;
  }

  // Method to enable/disable a site
  toggleSite(siteId: string, enabled: boolean): boolean {
    return this.updateSite(siteId, { enabled });
  }
}

// Export singleton instance
export const multiSiteManager = new MultiSiteManager();
