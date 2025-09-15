import { ProductFeedFetcher } from '../lib/productFeedFetcher';
import fs from 'fs';
import path from 'path';

async function debugXmlFeeds() {
  console.log('🔍 Debugging XML feed structure...');
  
  const fetcher = new ProductFeedFetcher();
  
  // Test multiple feeds
  const feedUrls = [
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=90897&feedid=2357', // Julie Sandlau
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=100221&feedid=2878', // Feed 2
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=75785&feedid=1728', // Feed 3
  ];
  
  const allDebugData = [];
  
  for (const feedUrl of feedUrls) {
    try {
      console.log(`\n📥 Fetching sample data from: ${feedUrl}`);
      
      // Fetch raw products
      const rawProducts = await fetcher.fetchSingleFeed(feedUrl);
      console.log(`✅ Fetched ${rawProducts.length} products`);
      
      if (rawProducts.length === 0) {
        console.log('⚠️ No products found in this feed');
        continue;
      }
      
      // Take first 3 products and show their structure
      const sampleProducts = rawProducts.slice(0, 3);
      
      console.log('\n📋 Sample product structures:');
      sampleProducts.forEach((product, index) => {
        console.log(`\n--- Product ${index + 1} ---`);
        console.log('Raw product keys:', Object.keys(product));
        console.log('Brand field:', product.brand);
        console.log('Forhandler field:', product.forhandler);
        console.log('Produktnavn field:', product.produktnavn);
        console.log('Beskrivelse field:', Array.isArray(product.beskrivelse) ? product.beskrivelse[0]?.substring(0, 100) + '...' : product.beskrivelse);
        console.log('Vareurl field:', product.vareurl);
        
        // Test our brand categorization
        const normalizedProduct = fetcher.normalizeProduct(product, feedUrl);
        console.log('Normalized brand:', normalizedProduct?.brand);
      });
      
      // Collect debug data
      allDebugData.push({
        feedUrl,
        totalProducts: rawProducts.length,
        sampleProducts: sampleProducts.map(p => ({
          keys: Object.keys(p),
          brand: p.brand,
          forhandler: p.forhandler,
          produktnavn: p.produktnavn,
          beskrivelse: Array.isArray(p.beskrivelse) ? p.beskrivelse[0]?.substring(0, 200) : p.beskrivelse,
          vareurl: p.vareurl
        }))
      });
      
    } catch (error) {
      console.error(`❌ Error debugging feed ${feedUrl}:`, error);
    }
  }
  
  // Save all debug data to file
  const debugPath = path.join(process.cwd(), 'debug-feed-data.json');
  fs.writeFileSync(debugPath, JSON.stringify(allDebugData, null, 2));
  console.log(`\n💾 Debug data saved to: ${debugPath}`);
}

// Run the debug
debugXmlFeeds().then(() => {
  console.log('\n✅ Debug completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
});
