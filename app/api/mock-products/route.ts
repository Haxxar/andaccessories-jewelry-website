import { NextRequest, NextResponse } from 'next/server';

// Mock product data for Vercel deployment
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
  },
  {
    id: 2,
    external_id: 'mock-2',
    title: 'Guld Halskæde',
    description: 'Elegant guldhalskæde med fin kæde og smuk pendant.',
    brand: 'Danish Gold',
    category: 'Halskæder',
    material: 'Guld',
    price: 899,
    old_price: 1199,
    discount: 25,
    image_url: 'https://readdy.ai/api/search-image?query=Gold%20necklace%20with%20pendant%20on%20white%20background%2C%20jewelry%20photography&width=400&height=400&seq=2&orientation=square',
    product_url: 'https://example.com/product/2',
    shop: 'Danish Gold',
    in_stock: true,
    stock_count: 3,
    sku: 'DG-NECK-001',
    keywords: ['guld', 'halskæde', 'pendant', 'elegant'],
    path: '/produkt/2',
    feed_source: 'mock',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    external_id: 'mock-3',
    title: 'Sølv Øreringe',
    description: 'Smukke sølvøreringe med moderne design, perfekt til enhver anledning.',
    brand: 'Modern Silver',
    category: 'Øreringe',
    material: 'Sølv',
    price: 199,
    old_price: 249,
    discount: 20,
    image_url: 'https://readdy.ai/api/search-image?query=Silver%20earrings%20on%20white%20background%2C%20modern%20jewelry%20photography&width=400&height=400&seq=3&orientation=square',
    product_url: 'https://example.com/product/3',
    shop: 'Modern Silver',
    in_stock: true,
    stock_count: 8,
    sku: 'MS-EAR-001',
    keywords: ['sølv', 'øreringe', 'moderne', 'design'],
    path: '/produkt/3',
    feed_source: 'mock',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    external_id: 'mock-4',
    title: 'Guld Armbånd',
    description: 'Elegant guldarmbånd med fin kæde og smuk finish.',
    brand: 'Luxury Gold',
    category: 'Armbånd',
    material: 'Guld',
    price: 699,
    old_price: 899,
    discount: 22,
    image_url: 'https://readdy.ai/api/search-image?query=Gold%20bracelet%20on%20white%20background%2C%20luxury%20jewelry%20photography&width=400&height=400&seq=4&orientation=square',
    product_url: 'https://example.com/product/4',
    shop: 'Luxury Gold',
    in_stock: true,
    stock_count: 4,
    sku: 'LG-BRAC-001',
    keywords: ['guld', 'armbånd', 'luxury', 'elegant'],
    path: '/produkt/4',
    feed_source: 'mock',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    external_id: 'mock-5',
    title: 'Sølv Vedhæng',
    description: 'Smukt sølvvedhæng med symbolsk design, perfekt til halskæder.',
    brand: 'Symbolic Silver',
    category: 'Vedhæng',
    material: 'Sølv',
    price: 149,
    old_price: 199,
    discount: 25,
    image_url: 'https://readdy.ai/api/search-image?query=Silver%20pendant%20on%20white%20background%2C%20symbolic%20jewelry%20photography&width=400&height=400&seq=5&orientation=square',
    product_url: 'https://example.com/product/5',
    shop: 'Symbolic Silver',
    in_stock: true,
    stock_count: 6,
    sku: 'SS-PEND-001',
    keywords: ['sølv', 'vedhæng', 'symbolsk', 'design'],
    path: '/produkt/5',
    feed_source: 'mock',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    external_id: 'mock-6',
    title: 'Guld Ørestikker',
    description: 'Klassiske guldørestikker med elegant finish, perfekt til hverdag.',
    brand: 'Classic Gold',
    category: 'Ørestikker',
    material: 'Guld',
    price: 399,
    old_price: 499,
    discount: 20,
    image_url: 'https://readdy.ai/api/search-image?query=Gold%20stud%20earrings%20on%20white%20background%2C%20classic%20jewelry%20photography&width=400&height=400&seq=6&orientation=square',
    product_url: 'https://example.com/product/6',
    shop: 'Classic Gold',
    in_stock: true,
    stock_count: 7,
    sku: 'CG-STUD-001',
    keywords: ['guld', 'ørestikker', 'klassisk', 'elegant'],
    path: '/produkt/6',
    feed_source: 'mock',
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
    
    let filteredProducts = [...mockProducts];
    
    // Apply filters
    if (category && category !== 'alle') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (brand && brand !== 'alle') {
      filteredProducts = filteredProducts.filter(p => p.brand === brand);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.keywords.some(k => k.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'price_low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'brand':
        filteredProducts.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      case 'random':
        filteredProducts.sort(() => Math.random() - 0.5);
        break;
      default: // newest
        filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
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
    console.error('Mock products API error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
