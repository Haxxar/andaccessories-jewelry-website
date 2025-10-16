import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { dbStatements } from '@/lib/database';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing database connections...');
    
    const results: any = {
      success: true,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test 1: Check environment variables
    results.tests.environment = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV
    };

    // Test 2: Check local database
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    results.tests.localDatabase = {
      exists: fs.existsSync(dbPath),
      path: dbPath
    };

    if (fs.existsSync(dbPath)) {
      try {
        const localProducts = dbStatements.getAllProducts.all();
        results.tests.localDatabase.productCount = localProducts.length;
        results.tests.localDatabase.sampleProduct = localProducts[0] || null;
      } catch (error) {
        results.tests.localDatabase.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    // Test 3: Check Supabase connection
    try {
      const supabase = supabaseAdmin();
      if (!supabase) {
        results.tests.supabase = { error: 'Supabase client not available' };
      } else {
        // Try a simple query
        const { data, error } = await supabase
          .from('products')
          .select('id')
          .limit(1);
        
        if (error) {
          results.tests.supabase = { 
            connected: false, 
            error: error.message,
            code: error.code,
            details: error.details
          };
        } else {
          results.tests.supabase = { 
            connected: true,
            sampleData: data
          };
        }
      }
    } catch (error) {
      results.tests.supabase = { 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test 4: Check product feed fetcher
    try {
      const { productFeedFetcher } = await import('@/lib/productFeedFetcher');
      results.tests.productFeedFetcher = { available: true };
    } catch (error) {
      results.tests.productFeedFetcher = { 
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    console.log('✅ Database tests completed');
    return NextResponse.json(results);

  } catch (error) {
    console.error('❌ Database test failed:', error);
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

