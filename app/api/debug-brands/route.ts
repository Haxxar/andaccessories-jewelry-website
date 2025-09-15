import { NextResponse } from 'next/server';
import { dbStatements } from '@/lib/database';

export async function GET() {
  try {
    // Get all unique brands with their counts
    const allBrands = dbStatements.db.prepare(`
      SELECT 
        brand,
        COUNT(*) as count
      FROM products 
      GROUP BY brand 
      ORDER BY count DESC
    `).all();

    // Get some sample products to see what the raw data looks like
    const sampleProducts = dbStatements.db.prepare(`
      SELECT 
        id, title, brand, shop, feed_source
      FROM products 
      ORDER BY updated_at DESC 
      LIMIT 20
    `).all();

    // Get products by feed source to see which feeds are working
    const productsByFeed = dbStatements.db.prepare(`
      SELECT 
        feed_source,
        COUNT(*) as count,
        COUNT(DISTINCT brand) as unique_brands
      FROM products 
      GROUP BY feed_source 
      ORDER BY count DESC
    `).all();

    return NextResponse.json({
      success: true,
      data: {
        allBrands,
        sampleProducts,
        productsByFeed
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

