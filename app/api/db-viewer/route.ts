import { NextResponse } from 'next/server';
import { dbStatements } from '@/lib/database';

export async function GET() {
  try {
    // Get all products with their details
    const allProducts = dbStatements.db.prepare(`
      SELECT 
        id, title, brand, category, material, price, old_price, 
        in_stock, shop, updated_at
      FROM products 
      ORDER BY updated_at DESC 
      LIMIT 100
    `).all();

    // Get brand statistics
    const brandStats = dbStatements.db.prepare(`
      SELECT 
        brand,
        COUNT(*) as product_count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price
      FROM products 
      WHERE in_stock = 1
      GROUP BY brand 
      ORDER BY product_count DESC
    `).all();

    // Get category statistics
    const categoryStats = dbStatements.db.prepare(`
      SELECT 
        category,
        COUNT(*) as product_count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price
      FROM products 
      WHERE in_stock = 1
      GROUP BY category 
      ORDER BY product_count DESC
    `).all();

    // Get total counts
    const totalProducts = dbStatements.db.prepare('SELECT COUNT(*) as count FROM products').get();
    const inStockProducts = dbStatements.db.prepare('SELECT COUNT(*) as count FROM products WHERE in_stock = 1').get();

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalProducts: totalProducts?.count || 0,
          inStockProducts: inStockProducts?.count || 0,
          outOfStockProducts: (totalProducts?.count || 0) - (inStockProducts?.count || 0)
        },
        brands: brandStats,
        categories: categoryStats,
        recentProducts: allProducts
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

