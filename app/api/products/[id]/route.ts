import { NextRequest, NextResponse } from 'next/server';
import { productFeedFetcher } from '@/lib/productFeedFetcher';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if database exists
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    const dbExists = fs.existsSync(dbPath);
    
    let product = null;
    
    // Try Supabase first (for production)
    const supabaseAdminClient = supabaseAdmin();
    if (supabaseAdminClient) {
      try {
        // Try to get product by ID first, then by external_id
        let { data: supabaseProduct, error } = await supabaseAdminClient
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error || !supabaseProduct) {
          // Try by external_id
          const { data: supabaseProductByExternal, error: externalError } = await supabaseAdminClient
            .from('products')
            .select('*')
            .eq('external_id', productId)
            .single();

          if (externalError || !supabaseProductByExternal) {
            return NextResponse.json(
              { success: false, error: 'Product not found' },
              { status: 404 }
            );
          }
          product = supabaseProductByExternal;
        } else {
          product = supabaseProduct;
        }

        // Parse keywords from JSON if it's a string
        if (product && typeof product.keywords === 'string') {
          try {
            product.keywords = JSON.parse(product.keywords);
          } catch (e) {
            product.keywords = [];
          }
        }

        return NextResponse.json({
          success: true,
          data: product
        });

      } catch (error) {
        console.error('Supabase query error:', error);
        // Fall back to local database or mock data
      }
    }

    if (dbExists) {
      // Try to get product by internal ID first, then by external ID
      product = productFeedFetcher.getProductById(parseInt(productId));
      
      if (!product) {
        product = productFeedFetcher.getProductByExternalId(productId);
      }
    } else {
      // For Vercel deployment, use mock data
      const mockProducts = [
        {
          id: 1,
          external_id: 'mock-1',
          title: 'Elegant Sølv Ring',
          description: 'Smuk sølvring med klassisk design, perfekt til hverdag og særlige lejligheder.',
          brand: 'Nordic Silver',
          category: 'Ringe',
          material: 'Sølv',
          price: 299,
          old_price: 399,
          discount: 25,
          image_url: 'https://readdy.ai/api/search-image?query=Elegant%20silver%20ring%20on%20white%20background%2C%20jewelry%20photography%2C%20minimalist%20design&width=400&height=400&seq=1&orientation=square',
          product_url: 'https://example.com/product/1',
          shop: 'Nordic Silver',
          in_stock: true,
          stock_count: 5,
          sku: 'NS-RING-001',
          keywords: ['sølv', 'ring', 'elegant', 'klassisk'],
          path: '/produkt/1',
          feed_source: 'mock',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      product = mockProducts.find(p => p.id.toString() === productId || p.external_id === productId);
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse keywords from JSON string
    const processedProduct = {
      ...product,
      keywords: product.keywords ? JSON.parse(product.keywords) : []
    };

    return NextResponse.json({
      success: true,
      data: processedProduct
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
