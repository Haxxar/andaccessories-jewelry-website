import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting SIMPLE feed update...');
    const startTime = Date.now();

    // Step 1: Test Supabase connection
    console.log('🔍 Testing Supabase connection...');
    const supabase = supabaseAdmin();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not available',
        message: 'Check SUPABASE_SERVICE_ROLE_KEY environment variable'
      }, { status: 500 });
    }

    // Step 2: Test basic Supabase query
    console.log('🔍 Testing Supabase query...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (testError) {
      return NextResponse.json({
        success: false,
        error: 'Supabase query failed',
        message: testError.message,
        details: {
          code: testError.code,
          details: testError.details,
          hint: testError.hint
        }
      }, { status: 500 });
    }

    // Step 3: Get current product count
    console.log('📊 Getting current product count...');
    const { count: currentCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to count products',
        message: countError.message
      }, { status: 500 });
    }

    // Step 4: For now, just return status without updating
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: 'Simple update test completed successfully',
      results: {
        supabaseConnected: true,
        currentProductCount: currentCount,
        testQueryWorked: true
      },
      duration,
      timestamp: new Date().toISOString(),
      note: 'This is a simplified test. Full update will be implemented once connection is confirmed.'
    });

  } catch (error) {
    console.error('❌ Simple update failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Simple update failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

