import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { productFeedFetcher } from '@/lib/productFeedFetcher';

// Test endpoint to verify the update-supabase functionality
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing update-supabase functionality...');
    
    // Test 1: Supabase connection
    const supabase = supabaseAdmin();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not available',
        test: 'supabase-connection',
        timestamp: new Date().toISOString()
      });
    }

    // Test 2: Single feed fetch
    const testFeedUrl = 'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=90897&feedid=2357';
    console.log(`🔄 Testing feed: ${testFeedUrl}`);
    
    const rawProducts = await productFeedFetcher.fetchSingleFeed(testFeedUrl);
    console.log(`✅ Fetched ${rawProducts.length} products from test feed`);

    // Test 3: Product normalization
    let normalizedCount = 0;
    for (const rawProduct of rawProducts.slice(0, 5)) { // Test first 5 products
      const normalized = productFeedFetcher.normalizeProduct(rawProduct, testFeedUrl);
      if (normalized) {
        normalizedCount++;
      }
    }

    // Test 4: Supabase query
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Supabase query failed',
        errorDetails: error,
        test: 'supabase-query',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'All tests passed',
      results: {
        supabaseConnection: true,
        feedFetch: {
          url: testFeedUrl,
          productCount: rawProducts.length,
          normalizedCount: normalizedCount
        },
        supabaseQuery: {
          success: true,
          productCount: count
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
