import { dbStatements } from '../lib/database';

console.log('🔍 Checking brands in database...');

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
  brands.forEach((brand: unknown, index) => {
    const brandData = brand as { brand: string; count: number };
    console.log(`${index + 1}. "${brandData.brand}" (${brandData.count} products)`);
  });

  // Check total products
  const totalProducts = dbStatements.db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  console.log(`\n📈 Total products: ${totalProducts?.count}`);

} catch (error) {
  console.error('❌ Error checking brands:', error);
}

process.exit(0);





