import { NextRequest, NextResponse } from 'next/server';
import { productFeedFetcher } from '@/lib/productFeedFetcher';
import { getSupabaseAdmin } from '@/lib/supabase';
import { dbStatements } from '@/lib/database';
import path from 'path';
import fs from 'fs';

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

    console.log('🚀 Starting automated feed update...');
    const startTime = Date.now();

    // Step 1: Update local SQLite database (if available)
    let localResult = { success: 0, errors: 0, total: 0 };
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    
    if (fs.existsSync(dbPath)) {
      console.log('📥 Fetching and storing feeds in local database...');
      localResult = await productFeedFetcher.fetchAndStoreAllFeeds();
      console.log(`✅ Local update completed: ${localResult.success} products stored, ${localResult.errors} errors`);
    } else {
      console.log('📥 No local database found, fetching feeds directly...');
      // Fetch feeds without storing locally
      const feeds = await productFeedFetcher.fetchAllFeeds();
      localResult.total = feeds.reduce((sum, feed) => sum + feed.length, 0);
      console.log(`📊 Fetched ${localResult.total} products from feeds`);
    }

    // Step 2: Update Supabase database directly
    console.log('☁️ Updating Supabase database...');
    const supabase = getSupabaseAdmin();
    
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    // Get all products from local database or fetch fresh
    let products;
    if (fs.existsSync(dbPath)) {
      // Get from local database
      products = dbStatements.getAllProducts.all();
    } else {
      // Fetch fresh and normalize
      const feeds = await productFeedFetcher.fetchAllFeeds();
      products = [];
      for (const feed of feeds) {
        for (const rawProduct of feed) {
          const normalized = productFeedFetcher.normalizeProduct(rawProduct, 'direct-fetch');
          if (normalized) {
            products.push(normalized);
          }
        }
      }
    }

    console.log(`📦 Processing ${products.length} products for Supabase...`);

    // Clear existing products in Supabase
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all products

    if (deleteError) {
      console.warn('⚠️ Warning: Could not clear existing products:', deleteError.message);
    } else {
      console.log('🗑️ Cleared existing products from Supabase');
    }

    // Insert products in batches
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Transform products for Supabase
      const supabaseProducts = batch.map(product => ({
        external_id: product.external_id,
        title: product.title,
        description: product.description,
        brand: product.brand,
        category: product.category,
        material: product.material,
        price: product.price,
        old_price: product.old_price,
        discount: product.discount ? Math.round(product.discount) : null,
        image_url: product.image_url,
        product_url: product.product_url,
        shop: product.shop,
        in_stock: product.in_stock,
        stock_count: product.stock_count ? Math.round(product.stock_count) : null,
        sku: product.sku,
        keywords: Array.isArray(product.keywords) ? product.keywords : JSON.parse(product.keywords || '[]'),
        path: product.path,
        feed_source: product.feed_source,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));

      const { error: insertError } = await supabase
        .from('products')
        .insert(supabaseProducts);

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, insertError);
        errorCount += batch.length;
      } else {
        insertedCount += batch.length;
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} products`);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`🎉 Automated feed update completed in ${duration}ms`);
    console.log(`📊 Supabase results: ${insertedCount} products inserted, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: 'Feed update completed successfully',
      results: {
        local: localResult,
        supabase: {
          inserted: insertedCount,
          errors: errorCount,
          total: products.length
        },
        duration: duration
      }
    });

  } catch (error) {
    console.error('❌ Automated feed update failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update feeds',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
