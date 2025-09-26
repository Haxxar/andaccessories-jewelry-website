import { dbStatements } from '../lib/database';

console.log('🔍 Checking brands in database...');

try {
  // Get all brands with their counts
  const brands = dbStatements.db.prepare(`
    SELECT 
      brand,
      COUNT(*) as count
    FROM products 
    WHERE in_stock = 1
    GROUP BY brand 
    ORDER BY count DESC
  `).all();

  console.log('\n📊 Brands in database:');
  brands.forEach((brand: any, index) => {
    console.log(`${index + 1}. ${brand.brand}: ${brand.count} products`);
  });

  // Check specifically for Abelstedt
  const abelstedtProducts = dbStatements.db.prepare(`
    SELECT id, title, brand, shop
    FROM products 
    WHERE brand LIKE '%Abelstedt%' OR shop LIKE '%Abelstedt%'
    LIMIT 5
  `).all() as any[];

  console.log('\n🔍 Abelstedt products:');
  if (abelstedtProducts.length > 0) {
    abelstedtProducts.forEach((product: any) => {
      console.log(`- ID: ${product.id}, Title: ${product.title}, Brand: ${product.brand}, Shop: ${product.shop}`);
    });
  } else {
    console.log('No Abelstedt products found');
  }

  // Check total products
  const totalProducts = dbStatements.db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  const inStockProducts = dbStatements.db.prepare('SELECT COUNT(*) as count FROM products WHERE in_stock = 1').get() as { count: number };
  
  console.log(`\n📈 Total products: ${totalProducts?.count}`);
  console.log(`📈 In stock products: ${inStockProducts?.count}`);

} catch (error) {
  console.error('❌ Error checking brands:', error);
}

process.exit(0);





