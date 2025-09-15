import { NextResponse } from 'next/server';
import { productFeedFetcher } from '@/lib/productFeedFetcher';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    const dbExists = fs.existsSync(dbPath);
    
    if (!dbExists) {
      return NextResponse.json({
        success: false,
        error: 'Database file not found',
        dbPath,
        files: fs.readdirSync(path.join(process.cwd(), 'data')).join(', ')
      });
    }

    // Test database connection
    const productCount = productFeedFetcher.getProductCount();
    const recentLogs = productFeedFetcher.getRecentFeedLogs(3);
    
    // Test getting some products
    const products = productFeedFetcher.getAllProducts(5, 0);
    
    return NextResponse.json({
      success: true,
      dbPath,
      productCount,
      recentLogs,
      sampleProducts: products.map(p => ({
        id: p.id,
        title: p.title,
        brand: p.brand,
        category: p.category,
        price: p.price
      }))
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

