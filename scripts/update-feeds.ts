import { productFeedFetcher } from '../lib/productFeedFetcher';

async function updateFeeds() {
  console.log('🚀 Starting product feed update...');
  
  try {
    const result = await productFeedFetcher.fetchAndStoreAllFeeds();
    
    console.log('✅ Feed update completed!');
    console.log(`📊 Results:`);
    console.log(`   - Total products fetched: ${result.total}`);
    console.log(`   - Products stored: ${result.success}`);
    console.log(`   - Errors: ${result.errors}`);
    
    if (result.errors > 0) {
      console.log('⚠️  Some feeds had errors. Check the logs above for details.');
    }
    
  } catch (error) {
    console.error('❌ Feed update failed:', error);
    process.exit(1);
  }
}

updateFeeds();

