import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not available'
      }, { status: 500 });
    }

    // Get latest product from Supabase
    const { data: latestProduct, error: productError } = await supabase
      .from('products')
      .select('updated_at, created_at')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (productError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch product data',
        details: productError.message
      }, { status: 500 });
    }

    // Get total product count
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to count products',
        details: countError.message
      }, { status: 500 });
    }

    // Check local database
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    const localDbExists = fs.existsSync(dbPath);
    
    let localProductCount = 0;
    if (localDbExists) {
      try {
        const { dbStatements } = await import('@/lib/database');
        const localProducts = dbStatements.getAllProducts.all();
        localProductCount = localProducts.length;
      } catch (error) {
        console.error('Error reading local database:', error);
      }
    }

    // Calculate time since last update
    let lastUpdate = null;
    let timeSinceUpdate = null;
    
    if (latestProduct && latestProduct.length > 0) {
      const product = latestProduct[0] as any;
      lastUpdate = product.updated_at;
      const lastUpdateTime = new Date(lastUpdate);
      const now = new Date();
      timeSinceUpdate = Math.floor((now.getTime() - lastUpdateTime.getTime()) / (1000 * 60 * 60)); // hours
    }

    // Check environment variables
    const cronSecretSet = !!process.env.CRON_SECRET;
    const supabaseUrlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKeySet = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    return NextResponse.json({
      success: true,
      data: {
        supabase: {
          totalProducts,
          lastUpdate,
          timeSinceUpdateHours: timeSinceUpdate,
          hasRecentUpdate: timeSinceUpdate !== null && timeSinceUpdate < 25 // Less than 25 hours
        },
        local: {
          databaseExists: localDbExists,
          productCount: localProductCount
        },
        environment: {
          cronSecretSet,
          supabaseUrlSet,
          supabaseKeySet,
          nodeEnv: process.env.NODE_ENV
        },
        cron: {
          schedule: '0 6 * * * (Daily at 6 AM UTC)',
          endpoint: '/api/cron/update-feeds',
          manualEndpoint: '/api/cron/update-feeds-manual'
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Status check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
