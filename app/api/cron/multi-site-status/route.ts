import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { multiSiteManager } from '@/lib/multiSiteManager';

export async function GET(request: NextRequest) {
  try {
    const sites = multiSiteManager.getAllSites();
    const siteStatuses = [];

    for (const site of sites) {
      try {
        // Create Supabase client for this site
        const supabase = createClient(site.supabaseUrl, site.supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });

        // Test connection and get product count
        const { data, error, count } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .limit(1);

        if (error) {
          siteStatuses.push({
            siteId: site.id,
            siteName: site.name,
            domain: site.domain,
            enabled: site.enabled,
            status: 'error',
            productCount: 0,
            error: error.message,
            lastChecked: new Date().toISOString()
          });
        } else {
          siteStatuses.push({
            siteId: site.id,
            siteName: site.name,
            domain: site.domain,
            enabled: site.enabled,
            status: 'healthy',
            productCount: count || 0,
            error: null,
            lastChecked: new Date().toISOString()
          });
        }
      } catch (error) {
        siteStatuses.push({
          siteId: site.id,
          siteName: site.name,
          domain: site.domain,
          enabled: site.enabled,
          status: 'error',
          productCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          lastChecked: new Date().toISOString()
        });
      }
    }

    const healthySites = siteStatuses.filter(s => s.status === 'healthy').length;
    const totalProducts = siteStatuses.reduce((sum, s) => sum + s.productCount, 0);

    return NextResponse.json({
      success: true,
      message: 'Multi-site status check completed',
      summary: {
        totalSites: sites.length,
        enabledSites: sites.filter(s => s.enabled).length,
        healthySites,
        totalProducts
      },
      sites: siteStatuses,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Multi-site status check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Multi-site status check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
