import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// Fallback sample data
const sampleProducts = [
  {
    id: 1,
    external_id: 'sample-1',
    title: 'Elegant Perle Øreringe',
    description: 'Elegante perle øreringe fra Julie Sandlau. Disse tidløse øreringe er perfekte til både hverdag og fest.',
    brand: 'Julie Sandlau',
    category: 'Øreringe',
    material: 'Sølv',
    price: 899,
    old_price: 1199,
    discount: 300,
    image_url: 'https://readdy.ai/api/search-image?query=Elegant%20pearl%20earrings%20on%20soft%20pastel%20background%2C%20minimalist%20jewelry%20photography%2C%20delicate%20and%20feminine%20design%2C%20simple%20clean%20backdrop%2C%20luxury%20jewelry%20styling%2C%20professional%20product%20photography%20with%20soft%20lighting&width=600&height=600&seq=7&orientation=squarish',
    product_url: 'https://example.com/affiliate/1',
    shop: 'Sample Shop',
    in_stock: true,
    stock_count: 12,
    sku: 'JS-PE-001',
    keywords: ['perle', 'øreringe', 'elegant'],
    path: 'elegant-perle-oreringe',
    feed_source: 'sample',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    external_id: 'sample-2',
    title: 'Forgyldt Halskæde',
    description: 'Smuk forgyldt halskæde fra Pandora. En klassisk og elegant halskæde der passer til enhver garderobe.',
    brand: 'Pandora',
    category: 'Halskæder',
    material: 'Guld',
    price: 1299,
    old_price: 1599,
    discount: 300,
    image_url: 'https://readdy.ai/api/search-image?query=Gold%20plated%20necklace%20on%20soft%20pastel%20background%2C%20elegant%20chain%20jewelry%2C%20minimalist%20jewelry%20photography%2C%20delicate%20feminine%20design%2C%20clean%20simple%20backdrop%2C%20luxury%20jewelry%20styling%20with%20professional%20lighting&width=600&height=600&seq=10&orientation=squarish',
    product_url: 'https://example.com/affiliate/2',
    shop: 'Pandora',
    in_stock: true,
    stock_count: 8,
    sku: 'PD-GN-002',
    keywords: ['forgyldt', 'halskæde', 'elegant'],
    path: 'forgyldt-halskaede',
    feed_source: 'sample',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    external_id: 'sample-3',
    title: 'Sølv Ring Set',
    description: 'Elegant sølv ring set med moderne design. Perfekt til hverdagsbrug eller særlige lejligheder.',
    brand: 'Maria Black',
    category: 'Ringe',
    material: 'Sølv',
    price: 599,
    old_price: 799,
    discount: 200,
    image_url: 'https://readdy.ai/api/search-image?query=Silver%20ring%20set%20on%20soft%20pastel%20background%2C%20stackable%20rings%20jewelry%20photography%2C%20minimalist%20elegant%20design%2C%20clean%20simple%20backdrop%2C%20luxury%20jewelry%20styling%20with%20professional%20lighting&width=600&height=600&seq=3&orientation=squarish',
    product_url: 'https://example.com/affiliate/3',
    shop: 'Maria Black',
    in_stock: true,
    stock_count: 15,
    sku: 'MB-SR-003',
    keywords: ['sølv', 'ringe', 'set'],
    path: 'solv-ring-set',
    feed_source: 'sample',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    
    const offset = (page - 1) * limit;

    // Check if database exists and has data
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    const dbExists = fs.existsSync(dbPath);
    
    let products: { id: number; title: string; price: number; old_price?: number; image_url: string; product_url: string; brand: string; category: string; material: string; shop: string; in_stock: boolean }[] = [];
    let totalCount = 0;

    // Try Supabase first (for production)
    const supabaseAdminClient = supabaseAdmin();
    console.log('Supabase admin client:', supabaseAdminClient ? 'initialized' : 'null');
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
    
    if (supabaseAdminClient) {
      try {
        let query = supabaseAdminClient
          .from('products')
          .select('*', { count: 'exact' })
          .eq('in_stock', true);

        // Apply filters
        if (category && category !== 'alle') {
          query = query.eq('category', category);
        }
        
        if (brand && brand !== 'alle') {
          query = query.eq('brand', brand);
        }
        
        if (search) {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
        }

        // Apply sorting
        switch (sort) {
          case 'price_low':
            query = query.order('price', { ascending: true });
            break;
          case 'price_high':
            query = query.order('price', { ascending: false });
            break;
          case 'discount':
            query = query.order('discount', { ascending: false });
            break;
          case 'brand':
            query = query.order('brand', { ascending: true });
            break;
          case 'random':
            query = query.order('id', { ascending: true }); // Will randomize in application
            break;
          default: // newest
            query = query.order('updated_at', { ascending: false });
        }

        // Apply pagination
        const { data: supabaseProducts, error, count } = await query
          .range(offset, offset + limit - 1);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        // Randomize if random sort was requested
        if (sort === 'random' && supabaseProducts) {
          supabaseProducts.sort(() => Math.random() - 0.5);
        }

        const totalCount = count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
          success: true,
          data: {
            products: supabaseProducts || [],
            pagination: {
              page,
              limit,
              totalCount,
              totalPages,
              hasNext: page < totalPages,
              hasPrev: page > 1
            },
            filters: {
              category,
              brand,
              search,
              sort
            }
          }
        });

      } catch (error) {
        console.error('Supabase query error:', error);
        console.error('Supabase error details:', JSON.stringify(error, null, 2));
        // Fall back to local database or mock data
      }
    }

    // For Vercel deployment, use mock data if database doesn't exist
    if (!dbExists) {
      // Redirect to mock API
      const mockResponse = await fetch(`${request.nextUrl.origin}/api/mock-products?${searchParams.toString()}`);
      if (mockResponse.ok) {
        return NextResponse.json(await mockResponse.json());
      }
    }

    if (dbExists) {
      try {
        const { productFeedFetcher } = await import('@/lib/productFeedFetcher');
        const { dbStatements } = await import('@/lib/database');
        // Try to get real data from database
        if (search) {
          products = productFeedFetcher.searchProducts(search, limit, offset, sort);
          totalCount = productFeedFetcher.getProductCount();
        } else {
          // Build custom query for multiple filters
          const whereConditions: string[] = [];
          const queryParams: string[] = [];

          // Category filter
          if (category) {
            whereConditions.push('category = ?');
            queryParams.push(category);
          }

          // Brand filter
          if (brand) {
            whereConditions.push('brand = ?');
            queryParams.push(brand);
          }

          // Base condition for in-stock products
          whereConditions.push('in_stock = 1');

          // Build the complete query
          const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
          
          // Sort options
          let orderBy = '';
          switch (sort) {
            case 'newest':
              orderBy = 'ORDER BY updated_at DESC';
              break;
            case 'oldest':
              orderBy = 'ORDER BY updated_at ASC';
              break;
            case 'price-low':
              orderBy = 'ORDER BY price ASC';
              break;
            case 'price-high':
              orderBy = 'ORDER BY price DESC';
              break;
            case 'brand':
              orderBy = 'ORDER BY brand ASC';
              break;
            case 'discount':
              orderBy = 'ORDER BY discount DESC NULLS LAST';
              break;
            default:
              orderBy = 'ORDER BY updated_at DESC';
          }

          // Get products with filters
          const productsQuery = `
            SELECT * FROM products 
            ${whereClause}
            ${orderBy}
            LIMIT ? OFFSET ?
          `;

          const countQuery = `
            SELECT COUNT(*) as count FROM products 
            ${whereClause}
          `;

          const allParams = [...queryParams, limit, offset];
          const countParams = [...queryParams];

          products = dbStatements.db.prepare(productsQuery).all(...allParams) as { id: number; title: string; price: number; old_price?: number; image_url: string; product_url: string; brand: string; category: string; material: string; shop: string; in_stock: boolean }[];
          const countResult = dbStatements.db.prepare(countQuery).get(...countParams) as { count: number };
          totalCount = countResult.count;
        }

        // Parse keywords from JSON string
        products = products.map(product => ({
          ...product,
          keywords: (product as any).keywords ? JSON.parse((product as any).keywords) : []
        }));

        console.log(`✅ Using real database data: ${products.length} products, total: ${totalCount}`);
      } catch (dbError) {
        console.log('Database error, using sample data:', dbError);
        products = sampleProducts;
        totalCount = sampleProducts.length;
      }
    } else {
      // Use sample data while database is being created
      console.log('Database not found, using sample data');
      products = sampleProducts;
      totalCount = sampleProducts.length;
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        products: products.slice(offset, offset + limit),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          category,
          brand,
          search,
          sort
        }
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
