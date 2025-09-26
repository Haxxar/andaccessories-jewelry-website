#!/usr/bin/env tsx

import { productFeedFetcher } from '../lib/productFeedFetcher';

async function initializeDatabase() {
  console.log('🚀 Initializing jewelry database...');
  
  try {
    // Run initial feed fetch
    console.log('📥 Fetching initial product data...');
    const result = await productFeedFetcher.fetchAndStoreAllFeeds();
    
    console.log('✅ Database initialization completed!');
    console.log(`📊 Results: ${result.success} products stored, ${result.errors} errors, ${result.total} total fetched`);
    
    // Show some stats
    const productCount = productFeedFetcher.getProductCount();
    console.log(`📈 Total products in database: ${productCount}`);
    
    // Show recent logs
    const recentLogs = productFeedFetcher.getRecentFeedLogs(3);
    console.log('📋 Recent feed logs:');
    recentLogs.forEach(log => {
      console.log(`  - ${log.status}: ${(log as any).products_updated || log.products_fetched} products updated (${(log as any).execution_time_ms || 'N/A'}ms)`);
    });
    
    console.log('🎉 Database is ready! You can now start your Next.js application.');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };

