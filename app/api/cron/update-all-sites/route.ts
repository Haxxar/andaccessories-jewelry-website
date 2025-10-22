import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseFeedFetcher } from '@/lib/supabaseFeedFetcher';
import { multiSiteManager, SiteUpdateResult } from '@/lib/multiSiteManager';

// Set maximum execution time to 5 minutes (for Vercel Hobby plan)
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 Starting multi-site feed update...');
    const startTime = Date.now();

    const enabledSites = multiSiteManager.getEnabledSites();
    
    if (enabledSites.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No enabled sites found',
        message: 'Please configure at least one site in the multi-site manager',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log(`📊 Found ${enabledSites.length} enabled sites to update`);

    const results: SiteUpdateResult[] = [];

    // Process each site sequentially to avoid overwhelming external APIs
    for (const site of enabledSites) {
      console.log(`\n🏢 Processing site: ${site.name} (${site.domain})`);
      const siteStartTime = Date.now();
      
      try {
        const siteResult = await updateSite(site);
        results.push(siteResult);
        
        const siteDuration = Date.now() - siteStartTime;
        console.log(`✅ Site ${site.name} completed in ${siteDuration}ms`);
        
      } catch (error) {
        const siteDuration = Date.now() - siteStartTime;
        console.error(`❌ Site ${site.name} failed:`, error);
        
        results.push({
          siteId: site.id,
          siteName: site.name,
          success: false,
          productsFetched: 0,
          productsInserted: 0,
          errors: 1,
          duration: siteDuration,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          feedResults: []
        });
      }
    }

    const totalDuration = Date.now() - startTime;
    const successfulSites = results.filter(r => r.success).length;
    const totalProductsFetched = results.reduce((sum, r) => sum + r.productsFetched, 0);
    const totalProductsInserted = results.reduce((sum, r) => sum + r.productsInserted, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);

    console.log(`\n🎉 Multi-site update completed in ${totalDuration}ms`);
    console.log(`📊 Results: ${successfulSites}/${results.length} sites successful`);
    console.log(`📦 Products: ${totalProductsInserted} inserted from ${totalProductsFetched} fetched`);
    console.log(`❌ Errors: ${totalErrors} total errors`);

    return NextResponse.json({
      success: true,
      message: 'Multi-site feed update completed',
      results: {
        totalSites: results.length,
        successfulSites,
        totalProductsFetched,
        totalProductsInserted,
        totalErrors,
        duration: totalDuration
      },
      siteResults: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Multi-site feed update failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Multi-site feed update failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to update a single site
async function updateSite(site: any): Promise<SiteUpdateResult> {
  const startTime = Date.now();
  const feedResults: Array<{ url: string; success: boolean; productCount: number; error?: string }> = [];
  
  try {
    // Create Supabase client for this site
    const supabase = createClient(site.supabaseUrl, site.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Step 1: Fetch products from all feed sources for this site
    console.log(`📥 Fetching products for ${site.name}...`);
    const allProducts: any[] = [];

    for (const feedUrl of site.feedUrls) {
      try {
        console.log(`🔄 Processing feed: ${feedUrl}`);
        
        // Add individual feed timeout
        const feedPromise = supabaseFeedFetcher.fetchSingleFeed(feedUrl);
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Feed timeout')), 15000) // 15 second timeout per feed
        );
        
        const rawProducts = await Promise.race([feedPromise, timeoutPromise]);
        
        // Normalize products with error handling
        let normalizedCount = 0;
        for (const rawProduct of rawProducts) {
          try {
            const normalized = supabaseFeedFetcher.normalizeProduct(rawProduct, feedUrl);
            if (normalized) {
              allProducts.push(normalized);
              normalizedCount++;
            }
          } catch (normalizeError) {
            console.warn(`⚠️ Error normalizing product from ${feedUrl}:`, normalizeError);
          }
        }
        
        feedResults.push({
          url: feedUrl,
          success: true,
          productCount: normalizedCount
        });
        
        console.log(`✅ Processed ${normalizedCount} products from feed`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error fetching feed ${feedUrl}:`, errorMessage);
        
        feedResults.push({
          url: feedUrl,
          success: false,
          productCount: 0,
          error: errorMessage
        });
      }
    }

    if (allProducts.length === 0) {
      throw new Error('No products fetched from any feeds');
    }

    console.log(`✅ Fetched ${allProducts.length} products for ${site.name}`);

    // Step 2: Update Supabase for this site
    console.log(`☁️ Updating Supabase for ${site.name}...`);
    
    // Clear existing products in Supabase
    console.log(`🗑️ Clearing existing products for ${site.name}...`);
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all products

    if (deleteError) {
      throw new Error(`Failed to clear products: ${deleteError.message}`);
    }

    // Insert products in batches
    const batchSize = 50;
    let insertedCount = 0;
    let errorCount = 0;
    const totalBatches = Math.ceil(allProducts.length / batchSize);

    console.log(`📦 Starting batch insertion for ${site.name}: ${totalBatches} batches`);

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      try {
        // Transform products for Supabase with error handling
        const supabaseProducts = batch.map((product: any) => {
          try {
            return {
              external_id: product.external_id,
              title: product.title,
              description: product.description,
              brand: product.brand,
              category: product.category,
              material: product.material,
              price: product.price,
              old_price: product.old_price,
              discount: product.discount != null ? Math.round(Number(product.discount)) : null,
              image_url: product.image_url,
              product_url: product.product_url,
              shop: product.shop,
              in_stock: product.in_stock,
              stock_count: product.stock_count != null ? Math.trunc(Number(product.stock_count)) : null,
              sku: product.sku,
              keywords: Array.isArray(product.keywords) ? product.keywords : JSON.parse(product.keywords || '[]'),
              path: product.path,
              feed_source: product.feed_source
            };
          } catch (transformError) {
            console.warn(`⚠️ Error transforming product in batch ${batchNumber}:`, transformError);
            return null;
          }
        }).filter(Boolean); // Remove null entries

        if (supabaseProducts.length === 0) {
          console.warn(`⚠️ Batch ${batchNumber} has no valid products after transformation`);
          errorCount++;
          continue;
        }

        const { error: insertError } = await supabase
          .from('products')
          .insert(supabaseProducts as any);

        if (insertError) {
          console.error(`❌ Error inserting batch ${batchNumber}/${totalBatches}:`, insertError);
          errorCount++;
        } else {
          insertedCount += supabaseProducts.length;
          console.log(`✅ Batch ${batchNumber}/${totalBatches}: ${supabaseProducts.length} products inserted`);
        }
      } catch (batchError) {
        console.error(`❌ Exception in batch ${batchNumber}:`, batchError);
        errorCount++;
      }
    }

    const duration = Date.now() - startTime;
    
    return {
      siteId: site.id,
      siteName: site.name,
      success: true,
      productsFetched: allProducts.length,
      productsInserted: insertedCount,
      errors: errorCount,
      duration,
      feedResults
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    throw new Error(`Site ${site.name} update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
