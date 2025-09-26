import { NextRequest, NextResponse } from 'next/server';
import { dbStatements } from '../../../lib/database';

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

    // Build the search query
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
      queryParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      whereConditions.push('price <= ?');
      queryParams.push(parseFloat(maxPrice));
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




