import { NextResponse } from 'next/server';

// Mock categories data for Vercel deployment
const mockCategories = [
  { category: 'Ringe', product_count: 15, min_price: 199, max_price: 1299, avg_price: 649 },
  { category: 'Halskæder', product_count: 12, min_price: 299, max_price: 1599, avg_price: 899 },
  { category: 'Øreringe', product_count: 18, min_price: 149, max_price: 899, avg_price: 449 },
  { category: 'Armbånd', product_count: 10, min_price: 199, max_price: 1199, avg_price: 699 },
  { category: 'Vedhæng', product_count: 8, min_price: 99, max_price: 599, avg_price: 349 },
  { category: 'Ørestikker', product_count: 14, min_price: 149, max_price: 699, avg_price: 399 }
];

const mockBrands = [
  { brand: 'Nordic Silver', product_count: 8 },
  { brand: 'Danish Gold', product_count: 6 },
  { brand: 'Modern Silver', product_count: 10 },
  { brand: 'Luxury Gold', product_count: 5 },
  { brand: 'Symbolic Silver', product_count: 7 },
  { brand: 'Classic Gold', product_count: 9 }
];

const mockMaterials = [
  { material: 'Sølv', product_count: 25 },
  { material: 'Guld', product_count: 20 },
  { material: 'Hvidguld', product_count: 8 },
  { material: 'Rosaguld', product_count: 5 }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        categories: mockCategories,
        brands: mockBrands,
        materials: mockMaterials
      }
    });
  } catch (error) {
    console.error('Mock categories API error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
