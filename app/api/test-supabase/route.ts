import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdminClient = supabaseAdmin();
    
    const debugInfo = {
      hasClient: !!supabaseAdminClient,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing'
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

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Supabase query failed',
        errorDetails: error,
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
