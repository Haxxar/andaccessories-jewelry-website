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
    const rawProducts = await fetchAllProducts();
    
    if (rawProducts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No products fetched from feeds',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log(`✅ Fetched ${rawProducts.length} products from feeds`);

    // Step 2: Update Supabase
    console.log('☁️ Updating Supabase database...');
    const supabase = supabaseAdmin();
    
    if (!supabase) {
      throw new Error('Supabase client not available. Check SUPABASE_SERVICE_ROLE_KEY');
    }

    // Clear existing products in Supabase
    console.log('🗑️ Clearing existing products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all products

    if (deleteError) {
      console.error('❌ Error clearing products:', deleteError);
      throw deleteError;
    }

    // Insert products in batches
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rawProducts.length; i += batchSize) {
      const batch = rawProducts.slice(i, i + batchSize);
      
      // Transform products for Supabase
      const supabaseProducts = batch.map((product: any) => ({
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
      }));

      const { error: insertError } = await supabase
        .from('products')
        .insert(supabaseProducts as any);

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError);
        errorCount++;
      } else {
        insertedCount += batch.length;
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(rawProducts.length / batchSize);
        console.log(`✅ Batch ${batchNumber}/${totalBatches}: ${batch.length} products`);
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

// Helper function to fetch all products from feeds
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

  for (const feedUrl of feedUrls) {
    try {
      const rawProducts = await productFeedFetcher.fetchSingleFeed(feedUrl);
      
      // Normalize products
      for (const rawProduct of rawProducts) {
        const normalized = productFeedFetcher.normalizeProduct(rawProduct, feedUrl);
        if (normalized) {
          allProducts.push(normalized);
        }
      }
      
      console.log(`✅ Processed ${rawProducts.length} products from feed`);
    } catch (error) {
      console.error(`❌ Error fetching feed ${feedUrl}:`, error);
      // Continue with other feeds even if one fails
    }
  }

  return allProducts;
}

