import { NextRequest, NextResponse } from 'next/server';
import { ProductFeedFetcher } from '@/lib/productFeedFetcher';
import path from 'path';
import fs from 'fs';

const productFeedFetcher = new ProductFeedFetcher();

// Sample featured products for fallback
const sampleFeaturedProducts = [
  {
    id: 1,
    title: "Diamond Ring - 50% OFF",
    brand: "Julie Sandlau",
    category: "Ringe",
    price: 999,
    old_price: 1999,
    discount: 50,
    image_url: "/placeholder-jewelry.svg",
    product_url: "#",
    shop: "Julie Sandlau",
    in_stock: true
  },
  {
    id: 2,
    title: "Gold Necklace - 40% OFF",
    brand: "Pandora",
    category: "Halskæder",
    price: 599,
    old_price: 999,
    discount: 40,
    image_url: "/placeholder-jewelry.svg",
    product_url: "#",
    shop: "Pandora",
    in_stock: true
  },
  {
    id: 3,
    title: "Silver Earrings - 30% OFF",
    brand: "Maria Black",
    category: "Ørestikker",
    price: 299,
    old_price: 429,
    discount: 30,
    image_url: "/placeholder-jewelry.svg",
    product_url: "#",
    shop: "Maria Black",
    in_stock: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 20);
    
    // Check if database exists and has data
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    const dbExists = fs.existsSync(dbPath);
    
    let featuredProducts: { id: number; title: string; price: number; old_price?: number; image_url: string; product_url: string; brand: string; category: string }[] = [];

    if (dbExists) {
      try {
        // Try to get real featured products from database
        featuredProducts = productFeedFetcher.getFeaturedProducts(limit);
        
        // Parse keywords from JSON string
        featuredProducts = featuredProducts.map(product => ({
          ...product,
          keywords: product.keywords ? JSON.parse(product.keywords) : []
        }));

        console.log(`✅ Using real featured products: ${featuredProducts.length} products`);
      } catch (dbError) {
        console.log('Database error, using sample featured products:', dbError);
        featuredProducts = sampleFeaturedProducts.slice(0, limit);
      }
    } else {
      // Use sample data while database is being created
      console.log('Database not found, using sample featured products');
      featuredProducts = sampleFeaturedProducts.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        products: featuredProducts,
        count: featuredProducts.length
      }
    });

  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching featured products',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}





