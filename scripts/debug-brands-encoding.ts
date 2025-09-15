import { dbStatements } from '../lib/database';

console.log('🔍 Debugging brand encoding issues...');

try {
  // Get all brands with their counts
  const brands = dbStatements.db.prepare(`
    SELECT 
      brand,
      COUNT(*) as count
    FROM products 
    GROUP BY brand 
    ORDER BY count DESC
  `).all();

  console.log('\n📊 All brands in database:');
  brands.forEach((brand, index) => {
    console.log(`${index + 1}. "${brand.brand}" (${brand.count} products)`);
    // Check for special characters
    if (brand.brand && /[øæåØÆÅ]/.test(brand.brand)) {
      console.log(`   ⚠️  Contains Danish special characters!`);
    }
  });

  // Check specifically for Abelstedt variations
  const abelstedtVariations = [
    'Abelstedt',
    'abelstedt', 
    'ABELSTEDT',
    'Abelstadt', // Common misspelling
    'Abelstædt', // With æ
    'Abelstødt'  // With ø
  ];

  console.log('\n🔍 Checking for Abelstedt variations:');
  abelstedtVariations.forEach(variation => {
    const products = dbStatements.db.prepare(`
      SELECT COUNT(*) as count
      FROM products 
      WHERE brand = ? OR shop = ?
    `).get(variation, variation);
    
    if (products && products.count > 0) {
      console.log(`✅ Found ${products.count} products with brand/shop: "${variation}"`);
    } else {
      console.log(`❌ No products found with brand/shop: "${variation}"`);
    }
  });

  // Check for products that might contain "Abelstedt" in any field
  const abelstedtInAnyField = dbStatements.db.prepare(`
    SELECT id, title, brand, shop, category
    FROM products 
    WHERE title LIKE '%Abelstedt%' 
       OR brand LIKE '%Abelstedt%' 
       OR shop LIKE '%Abelstedt%'
       OR category LIKE '%Abelstedt%'
    LIMIT 5
  `).all();

  console.log('\n🔍 Products containing "Abelstedt" in any field:');
  if (abelstedtInAnyField.length > 0) {
    abelstedtInAnyField.forEach(product => {
      console.log(`- ID: ${product.id}`);
      console.log(`  Title: "${product.title}"`);
      console.log(`  Brand: "${product.brand}"`);
      console.log(`  Shop: "${product.shop}"`);
      console.log(`  Category: "${product.category}"`);
      console.log('');
    });
  } else {
    console.log('❌ No products found containing "Abelstedt" in any field');
  }

  // Check for products from the Abelstedt feed URL
  const abelstedtFeedProducts = dbStatements.db.prepare(`
    SELECT id, title, brand, shop, feed_url
    FROM products 
    WHERE feed_url LIKE '%bannerid=100221%'
    LIMIT 5
  `).all();

  console.log('\n🔍 Products from Abelstedt feed (bannerid=100221):');
  if (abelstedtFeedProducts.length > 0) {
    abelstedtFeedProducts.forEach(product => {
      console.log(`- ID: ${product.id}`);
      console.log(`  Title: "${product.title}"`);
      console.log(`  Brand: "${product.brand}"`);
      console.log(`  Shop: "${product.shop}"`);
      console.log('');
    });
  } else {
    console.log('❌ No products found from Abelstedt feed');
  }

  // Check for encoding issues in brand names
  console.log('\n🔍 Checking for encoding issues:');
  const allBrands = dbStatements.db.prepare(`
    SELECT DISTINCT brand
    FROM products 
    WHERE brand IS NOT NULL
  `).all();

  allBrands.forEach(brand => {
    if (brand.brand) {
      const hasSpecialChars = /[øæåØÆÅ]/.test(brand.brand);
      const hasQuestionMarks = brand.brand.includes('?');
      const hasReplacementChars = brand.brand.includes('');
      
      if (hasSpecialChars || hasQuestionMarks || hasReplacementChars) {
        console.log(`⚠️  Potential encoding issue: "${brand.brand}"`);
        if (hasSpecialChars) console.log(`   - Contains Danish characters`);
        if (hasQuestionMarks) console.log(`   - Contains question marks`);
        if (hasReplacementChars) console.log(`   - Contains replacement characters`);
      }
    }
  });

} catch (error) {
  console.error('❌ Error checking brands:', error);
}

process.exit(0);


