import { NextRequest, NextResponse } from 'next/server';
import { productFeedFetcher } from '@/lib/productFeedFetcher';

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

    // Try to get product by internal ID first, then by external ID
    let product = productFeedFetcher.getProductById(parseInt(productId));
    
    if (!product) {
      product = productFeedFetcher.getProductByExternalId(productId);
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
