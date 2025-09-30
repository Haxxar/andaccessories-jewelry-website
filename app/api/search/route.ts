import { NextRequest, NextResponse } from 'next/server';
// Avoid static import of SQLite on serverless
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const material = searchParams.get('material');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const inStock = searchParams.get('inStock') === 'true';
    
    const offset = (page - 1) * limit;

    // Try Supabase first (works on Vercel)
    const supabaseAdminClient = supabaseAdmin();
    if (supabaseAdminClient) {
      try {
        let queryBuilder = supabaseAdminClient
          .from('products')
          .select('*', { count: 'exact' });

        // Base condition for in-stock products
        if (inStock) {
          queryBuilder = queryBuilder.eq('in_stock', true);
        }

        // Text search across fields
        if (query.trim()) {
          const term = query.trim();
          queryBuilder = queryBuilder.or(`title.ilike.%${term}%,description.ilike.%${term}%,brand.ilike.%${term}%`);
        }

        if (category && category !== 'alle') {
          queryBuilder = queryBuilder.eq('category', category);
        }
        if (brand && brand !== 'alle') {
          queryBuilder = queryBuilder.eq('brand', brand);
        }
        if (material && material !== 'alle') {
          queryBuilder = queryBuilder.eq('material', material);
        }
        if (minPrice) {
          queryBuilder = queryBuilder.gte('price', Number(minPrice));
        }
        if (maxPrice) {
          queryBuilder = queryBuilder.lte('price', Number(maxPrice));
        }

        // Sorting
        switch (sort) {
          case 'oldest':
            queryBuilder = queryBuilder.order('updated_at', { ascending: true });
            break;
          case 'price-low':
            queryBuilder = queryBuilder.order('price', { ascending: true });
            break;
          case 'price-high':
            queryBuilder = queryBuilder.order('price', { ascending: false });
            break;
          case 'brand':
            queryBuilder = queryBuilder.order('brand', { ascending: true });
            break;
          case 'discount':
            queryBuilder = queryBuilder.order('discount', { ascending: false, nullsFirst: false });
            break;
          default:
            queryBuilder = queryBuilder.order('updated_at', { ascending: false });
        }

        // Pagination
        const { data: supabaseProducts, count, error } = await queryBuilder
          .range(offset, offset + limit - 1);

        if (error) {
          throw error;
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
              query,
              category,
              brand,
              material,
              minPrice,
              maxPrice,
              sort,
              inStock
            },
            availableFilters: {
              categories: [],
              brands: [],
              materials: [],
              priceRange: { min: 0, max: 0 }
            }
          }
        });
      } catch (e) {
        // fallthrough to SQLite
      }
    }

    // Build the search query for local SQLite
    const { dbStatements } = await import('../../../lib/database');
    const whereConditions: string[] = [];
    const queryParams: string[] = [];

    // Base condition for in-stock products
    if (inStock) {
      whereConditions.push('in_stock = 1');
    }

    // Text search
    if (query.trim()) {
      const searchTerm = `%${query.trim()}%`;
      whereConditions.push('(title LIKE ? OR description LIKE ? OR brand LIKE ? OR keywords LIKE ?)');
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category && category !== 'alle') {
      whereConditions.push('category = ?');
      queryParams.push(category);
    }

    // Brand filter
    if (brand && brand !== 'alle') {
      whereConditions.push('brand = ?');
      queryParams.push(brand);
    }

    // Material filter
    if (material && material !== 'alle') {
      whereConditions.push('material = ?');
      queryParams.push(material);
    }

    // Price range filters
    if (minPrice) {
      whereConditions.push('price >= ?');
      queryParams.push(minPrice);
    }
    if (maxPrice) {
      whereConditions.push('price <= ?');
      queryParams.push(maxPrice);
    }

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

    // Get products
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

    const products = dbStatements.db.prepare(productsQuery).all(...allParams) as { id: number; title: string; price: number; old_price?: number; image_url: string; product_url: string; brand: string; category: string; material: string; shop: string; in_stock: boolean; keywords: string }[];
    const countResult = dbStatements.db.prepare(countQuery).get(...countParams) as { count: number };
    const totalCount = countResult.count;

    // Parse keywords from JSON string
    const processedProducts = products.map(product => ({
      ...product,
      keywords: product.keywords ? JSON.parse(product.keywords) : []
    }));

    // Get available filters for the search results
    const filtersQuery = `
      SELECT 
        category,
        brand,
        material,
        MIN(price) as min_price,
        MAX(price) as max_price,
        COUNT(*) as count
      FROM products 
      ${whereClause}
      GROUP BY category, brand, material
    `;

    const filterResults = dbStatements.db.prepare(filtersQuery).all(...queryParams) as { category: string; brand: string; material: string; min_price: number; max_price: number }[];
    
    // Process filter results
    const availableFilters = {
      categories: [...new Set(filterResults.map((f: { category: string; brand: string; material: string; min_price: number; max_price: number }) => f.category).filter(Boolean))],
      brands: [...new Set(filterResults.map((f: { category: string; brand: string; material: string; min_price: number; max_price: number }) => f.brand).filter(Boolean))],
      materials: [...new Set(filterResults.map((f: { category: string; brand: string; material: string; min_price: number; max_price: number }) => f.material).filter(Boolean))],
      priceRange: {
        min: Math.min(...filterResults.map((f: { category: string; brand: string; material: string; min_price: number; max_price: number }) => f.min_price).filter(Boolean)),
        max: Math.max(...filterResults.map((f: { category: string; brand: string; material: string; min_price: number; max_price: number }) => f.max_price).filter(Boolean))
      }
    };

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        products: processedProducts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          query,
          category,
          brand,
          material,
          minPrice,
          maxPrice,
          sort,
          inStock
        },
        availableFilters
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}




