import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
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
  { brand: 'Julie Sandlau', count: 89 },
  { brand: 'Pandora', count: 67 },
  { brand: 'Maria Black', count: 45 },
  { brand: 'Dirks Jewellery', count: 34 },
  { brand: 'Maanesten', count: 28 }
];

const sampleMaterials = [
  { material: 'Guld', count: 234 },
  { material: 'Sølv', count: 189 },
  { material: 'Diamant', count: 67 },
  { material: 'Perle', count: 45 }
];

export async function GET() {
  try {
    // Check if database exists
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    const dbExists = fs.existsSync(dbPath);
    
    let categories: { category: string; product_count: number; min_price: number; max_price: number; avg_price: number }[] = [];
    let brands: { brand: string; count: number }[] = [];
    let materials: { material: string; count: number }[] = [];

    // Try Supabase first (for production)
    const supabaseAdminClient = supabaseAdmin();
    if (supabaseAdminClient) {
      try {
        // Get categories with product counts
        const { data: categories, error: categoriesError } = await supabaseAdminClient
          .from('products')
          .select('category, price')
          .eq('in_stock', true);

        if (categoriesError) {
          console.error('Supabase categories error:', categoriesError);
          throw categoriesError;
        }

        // Process categories data
        const categoryStats = categories?.reduce((acc: Record<string, { category: string; product_count: number; prices: number[] }>, product: { category: string; price: number }) => {
          const cat = product.category;
          if (!acc[cat]) {
            acc[cat] = { category: cat, product_count: 0, prices: [] };
          }
          acc[cat].product_count++;
          acc[cat].prices.push(product.price);
          return acc;
        }, {});

        const processedCategories = Object.values(categoryStats || {}).map((cat: { category: string; product_count: number; prices: number[] }) => ({
          category: cat.category,
          product_count: cat.product_count,
          min_price: Math.min(...cat.prices),
          max_price: Math.max(...cat.prices),
          avg_price: Math.round(cat.prices.reduce((a: number, b: number) => a + b, 0) / cat.prices.length)
        }));

        // Get brands with product counts
        const { data: brands, error: brandsError } = await supabaseAdminClient
          .from('products')
          .select('brand')
          .eq('in_stock', true);

        if (brandsError) {
          console.error('Supabase brands error:', brandsError);
          throw brandsError;
        }

        const brandStats = brands?.reduce((acc: Record<string, number>, product: { brand: string }) => {
          const brand = product.brand;
          acc[brand] = (acc[brand] || 0) + 1;
          return acc;
        }, {});

        const processedBrands = Object.entries(brandStats || {}).map(([brand, count]) => ({
          brand,
          product_count: count
        }));

        // Get materials with product counts
        const { data: materials, error: materialsError } = await supabaseAdminClient
          .from('products')
          .select('material')
          .eq('in_stock', true)
          .not('material', 'is', null);

        if (materialsError) {
          console.error('Supabase materials error:', materialsError);
          throw materialsError;
        }

        const materialStats = materials?.reduce((acc: Record<string, number>, product: { material: string }) => {
          const material = product.material;
          acc[material] = (acc[material] || 0) + 1;
          return acc;
        }, {});

        const processedMaterials = Object.entries(materialStats || {}).map(([material, count]) => ({
          material,
          product_count: count
        }));

        return NextResponse.json({
          success: true,
          data: {
            categories: processedCategories,
            brands: processedBrands,
            materials: processedMaterials
          }
        });

      } catch (error) {
        console.error('Supabase query error:', error);
        // Fall back to local database or sample data
      }
    }

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
        const { dbStatements } = await import('@/lib/database');
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
        `).all() as { category: string; product_count: number; min_price: number; max_price: number; avg_price: number }[];

        // Get all unique brands with product counts
        brands = dbStatements.db.prepare(`
          SELECT 
            brand,
            COUNT(*) as count
          FROM products 
          WHERE in_stock = 1
          GROUP BY brand 
          ORDER BY count DESC
        `).all() as { brand: string; count: number }[];

        // Get all unique materials with product counts
        materials = dbStatements.db.prepare(`
          SELECT 
            material,
            COUNT(*) as count
          FROM products 
          WHERE in_stock = 1
          GROUP BY material 
          ORDER BY count DESC
        `).all() as { material: string; count: number }[];
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
