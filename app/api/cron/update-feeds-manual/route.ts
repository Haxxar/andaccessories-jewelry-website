import { NextRequest, NextResponse } from 'next/server';
import { productFeedFetcher } from '@/lib/productFeedFetcher';
import { supabaseAdmin } from '@/lib/supabase';
import { dbStatements } from '@/lib/database';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting MANUAL feed update...');
    const startTime = Date.now();

    // Step 1: Update local SQLite database (if available)
    let localResult = { success: 0, errors: 0, total: 0 };
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    
    if (fs.existsSync(dbPath)) {
      console.log('📥 Fetching and storing feeds in local database...');
      localResult = await productFeedFetcher.fetchAndStoreAllFeeds();
      console.log(`✅ Local update completed: ${localResult.success} products stored, ${localResult.errors} errors`);
    } else {
      console.log('⚠️ Local database not found, skipping local update');
    }

    // Step 2: Update Supabase database
    console.log('📤 Updating Supabase database...');
    const supabase = supabaseAdmin();
    
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    // Get products from local database or fetch directly
    let products: any[];
    if (fs.existsSync(dbPath)) {
      products = dbStatements.getAllProducts.all();
    } else {
      console.log('📥 Fetching feeds directly for Supabase...');
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

    console.log(`📊 Found ${products.length} products to sync to Supabase`);

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products to update',
        localResult,
        supabaseResult: { inserted: 0, deleted: 0 },
        duration: Date.now() - startTime
      });
    }

    // Delete existing products
    console.log('🗑️ Deleting existing products from Supabase...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all products

    if (deleteError) {
      console.error('❌ Error deleting existing products:', deleteError);
      throw deleteError;
    }

    console.log('✅ Existing products deleted from Supabase');

    // Insert products in batches
    const batchSize = 100;
    let insertedCount = 0;
    let batchErrors = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
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
        discount: product.discount ? Math.round(product.discount) : null,
        image_url: product.image_url,
        product_url: product.product_url,
        shop: product.shop,
        in_stock: product.in_stock,
        stock_count: product.stock_count ? Math.round(product.stock_count) : null,
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
        batchErrors++;
      } else {
        insertedCount += batch.length;
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} inserted: ${batch.length} products`);
      }
    }

    const duration = Date.now() - startTime;
    const supabaseResult = { inserted: insertedCount, deleted: products.length, errors: batchErrors };

    console.log(`🎉 Manual update completed in ${duration}ms`);
    console.log(`📊 Results: ${insertedCount} products inserted, ${batchErrors} batch errors`);

    return NextResponse.json({
      success: true,
      message: 'Manual feed update completed successfully',
      localResult,
      supabaseResult,
      duration,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Manual feed update failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
