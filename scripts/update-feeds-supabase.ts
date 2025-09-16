import { supabaseAdmin } from '../lib/supabase';
import { productFeedFetcher } from '../lib/productFeedFetcher';

async function updateFeedsToSupabase() {
  console.log('🔄 Starting feed update to Supabase...');

  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('❌ Supabase not configured. Please set environment variables.');
      return;
    }

    // Get all products from local database
    const localProducts = productFeedFetcher.getAllProducts();
    console.log(`📦 Found ${localProducts.length} products in local database`);

    if (localProducts.length === 0) {
      console.log('⚠️ No products found in local database. Run feed update first.');
      return;
    }

    // Clear existing products in Supabase
    console.log('🗑️ Clearing existing products in Supabase...');
    const { error: deleteError } = await supabaseAdmin
      .from('products')
      .delete()
      .neq('id', 0); // Delete all products

    if (deleteError) {
      console.error('❌ Error clearing products:', deleteError);
      return;
    }

    // Insert products in batches
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < localProducts.length; i += batchSize) {
      const batch = localProducts.slice(i, i + batchSize);
      
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
        discount: product.discount,
        image_url: product.image_url,
        product_url: product.product_url,
        shop: product.shop,
        in_stock: product.in_stock,
        stock_count: product.stock_count,
        sku: product.sku,
        keywords: Array.isArray(product.keywords) ? product.keywords : JSON.parse(product.keywords || '[]'),
        path: product.path,
        feed_source: product.feed_source,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));

      const { error: insertError } = await supabaseAdmin
        .from('products')
        .insert(supabaseProducts);

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError);
        continue;
      }

      insertedCount += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(localProducts.length / batchSize)} (${insertedCount}/${localProducts.length} products)`);
    }

    console.log(`🎉 Successfully updated Supabase with ${insertedCount} products!`);

    // Verify the data
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1);

    if (verifyError) {
      console.error('❌ Error verifying data:', verifyError);
    } else {
      console.log('✅ Data verification successful!');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
updateFeedsToSupabase();
