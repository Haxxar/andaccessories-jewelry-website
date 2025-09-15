import { NextRequest, NextResponse } from 'next/server';
import { dbStatements } from '@/lib/database';
import fs from 'fs';
import path from 'path';

// Fallback sample data
const sampleCategories = [
  { category: 'Øreringe', product_count: 245, min_price: 199, max_price: 2999, avg_price: 899 },
  { category: 'Halskæder', product_count: 189, min_price: 299, max_price: 3999, avg_price: 1299 },
  { category: 'Ringe', product_count: 167, min_price: 399, max_price: 4999, avg_price: 1599 },
  { category: 'Armbånd', product_count: 134, min_price: 199, max_price: 1999, avg_price: 749 },
  { category: 'Vedhæng', product_count: 98, min_price: 149, max_price: 999, avg_price: 449 },
  { category: 'Ørestikker', product_count: 156, min_price: 99, max_price: 1499, avg_price: 599 }
];

const sampleBrands = [
  { brand: 'Julie Sandlau', product_count: 89 },
  { brand: 'Pandora', product_count: 67 },
  { brand: 'Maria Black', product_count: 45 },
  { brand: 'Dirks Jewellery', product_count: 34 },
  { brand: 'Maanesten', product_count: 28 }
];

const sampleMaterials = [
  { material: 'Guld', product_count: 234 },
  { material: 'Sølv', product_count: 189 },
  { material: 'Diamant', product_count: 67 },
  { material: 'Perle', product_count: 45 }
];

export async function GET(request: NextRequest) {
  try {
    // Check if database exists
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    const dbExists = fs.existsSync(dbPath);
    
    let categories: any[] = [];
    let brands: any[] = [];
    let materials: any[] = [];

    // For Vercel deployment, use mock data if database doesn't exist
    if (!dbExists) {
      return NextResponse.json({
        success: true,
        data: {
          categories: sampleCategories,
          brands: sampleBrands,
          materials: sampleMaterials
        }
      });
    }

    if (dbExists) {
      try {
        // Get all unique categories with product counts
        categories = dbStatements.db.prepare(`
          SELECT 
            category,
            COUNT(*) as product_count,
            MIN(price) as min_price,
            MAX(price) as max_price,
            AVG(price) as avg_price
          FROM products 
          WHERE in_stock = 1 
          GROUP BY category 
          ORDER BY product_count DESC
        `).all();

        // Get all unique brands with product counts
        brands = dbStatements.db.prepare(`
          SELECT 
            brand,
            COUNT(*) as product_count
          FROM products 
          WHERE in_stock = 1
          GROUP BY brand 
          ORDER BY product_count DESC
        `).all();

        // Get all unique materials with product counts
        materials = dbStatements.db.prepare(`
          SELECT 
            material,
            COUNT(*) as product_count
          FROM products 
          WHERE in_stock = 1
          GROUP BY material 
          ORDER BY product_count DESC
        `).all();
      } catch (dbError) {
        console.log('Database error, using sample data:', dbError);
        categories = sampleCategories;
        brands = sampleBrands;
        materials = sampleMaterials;
      }
    } else {
      // Use sample data while database is being created
      console.log('Database not found, using sample data');
      categories = sampleCategories;
      brands = sampleBrands;
      materials = sampleMaterials;
    }

    console.log(`✅ Categories API: ${categories.length} categories, ${brands.length} brands, ${materials.length} materials`);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        brands,
        materials
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
