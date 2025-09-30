import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdminClient = supabaseAdmin();
    
    const debugInfo = {
      hasClient: !!supabaseAdminClient,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'missing',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing',
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      urlStartsWith: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) || 'none'
    };

    if (!supabaseAdminClient) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not initialized',
        debug: debugInfo
      });
    }

    // Test a simple query
    const { data, error, count } = await supabaseAdminClient
      .from('products')
      .select('*', { count: 'exact' })
      .limit(5);

    // Also test if the table exists by trying to get table info
    const { data: tableInfo, error: tableError } = await supabaseAdminClient
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Supabase query failed',
        errorDetails: error,
        tableTest: {
          tableInfo,
          tableError
        },
        debug: debugInfo
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        productCount: count,
        sampleProducts: data?.length || 0,
        firstProduct: data?.[0] || null
      },
      tableTest: {
        tableInfo,
        tableError
      },
      debug: debugInfo
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Exception occurred',
      errorDetails: error instanceof Error ? error.message : String(error),
      debug: {
        hasClient: !!supabaseAdmin(),
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
  }
}
