import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { productFeedFetcher } from '@/lib/productFeedFetcher';

// Set maximum execution time to 5 minutes (for Vercel Pro)
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

    console.log('🚀 Starting Supabase feed update...');
    const startTime = Date.now();

    // Step 1: Fetch products from all feed sources
    console.log('📥 Fetching products from feed sources...');
    let rawProducts: any[] = [];
    
    try {
      rawProducts = await fetchAllProducts();
      console.log(`✅ Fetched ${rawProducts.length} products from feeds`);
    } catch (fetchError) {
      console.error('❌ Error in fetchAllProducts:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch products from feeds',
        message: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    if (rawProducts.length === 0) {
      console.warn('⚠️ No products fetched from feeds');
      return NextResponse.json({
        success: false,
        error: 'No products fetched from feeds',
        message: 'All feed sources returned empty or failed',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Step 2: Update Supabase
    console.log('☁️ Updating Supabase database...');
    const supabase = supabaseAdmin();
    
    if (!supabase) {
      throw new Error('Supabase client not available. Check SUPABASE_SERVICE_ROLE_KEY');
    }

    // Clear existing products in Supabase
    console.log('🗑️ Clearing existing products...');
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', 0); // Delete all products

      if (deleteError) {
        console.error('❌ Error clearing products:', deleteError);
        throw new Error(`Failed to clear products: ${deleteError.message}`);
      }
      console.log('✅ Successfully cleared existing products');
    } catch (clearError) {
      console.error('❌ Error during product clearing:', clearError);
      throw new Error(`Product clearing failed: ${clearError instanceof Error ? clearError.message : 'Unknown error'}`);
    }

    // Insert products in batches
    const batchSize = 50; // Reduced batch size to avoid memory issues
    let insertedCount = 0;
    let errorCount = 0;
    const totalBatches = Math.ceil(rawProducts.length / batchSize);

    console.log(`📦 Starting batch insertion: ${totalBatches} batches of ${batchSize} products each`);

    for (let i = 0; i < rawProducts.length; i += batchSize) {
      const batch = rawProducts.slice(i, i + batchSize);
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
    console.log(`🎉 Supabase update completed in ${duration}ms`);
    console.log(`📊 Results: ${insertedCount} inserted, ${errorCount} batch errors`);

    return NextResponse.json({
      success: true,
      message: 'Supabase feed update completed successfully',
      results: {
        fetched: rawProducts.length,
        inserted: insertedCount,
        errors: errorCount,
        duration: duration
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Supabase feed update failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Supabase feed update failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to fetch all products from feeds with better error handling
async function fetchAllProducts() {
  const feedUrls = [
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
  ];

  const allProducts: any[] = [];
  const feedResults: { url: string; success: boolean; productCount: number; error?: string }[] = [];

  // Process feeds with timeout and better error handling
  for (const feedUrl of feedUrls) {
    try {
      console.log(`🔄 Processing feed: ${feedUrl}`);
      
      // Add individual feed timeout
      const feedPromise = productFeedFetcher.fetchSingleFeed(feedUrl);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Feed timeout')), 15000) // 15 second timeout per feed
      );
      
      const rawProducts = await Promise.race([feedPromise, timeoutPromise]);
      
      // Normalize products with error handling
      let normalizedCount = 0;
      for (const rawProduct of rawProducts) {
        try {
          const normalized = productFeedFetcher.normalizeProduct(rawProduct, feedUrl);
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
      
      // Continue with other feeds even if one fails
    }
  }

  console.log(`📊 Feed processing summary:`, feedResults);
  return allProducts;
}

