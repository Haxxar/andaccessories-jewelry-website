import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Get total product count
    const { count: productCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get product count',
        message: countError.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Get the latest product update time
    const { data: latestProductData, error: latestError } = await supabase
      .from('products')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (latestError && latestError.code !== 'PGRST116') {
      console.error('Error getting latest product:', latestError);
    }

    // Get products updated in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentUpdates, error: recentError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', twentyFourHoursAgo);

    if (recentError) {
      console.error('Error getting recent updates:', recentError);
    }

    const latestProduct = latestProductData as { updated_at: string } | null;
    const lastUpdateTime = latestProduct?.updated_at
      ? new Date(latestProduct.updated_at) 
      : null;
    
    const hoursSinceLastUpdate = lastUpdateTime 
      ? Math.floor((Date.now() - lastUpdateTime.getTime()) / (1000 * 60 * 60))
      : null;

    // Determine cron job health status
    let cronStatus = 'unknown';
    let cronMessage = '';
    
    if (!lastUpdateTime) {
      cronStatus = 'never_run';
      cronMessage = 'No products found or database never updated';
    } else if (hoursSinceLastUpdate !== null) {
      if (hoursSinceLastUpdate < 25) {
        cronStatus = 'healthy';
        cronMessage = 'Cron job ran within the last 24 hours';
      } else if (hoursSinceLastUpdate < 48) {
        cronStatus = 'warning';
        cronMessage = 'Cron job may have missed last run (24-48 hours ago)';
      } else {
        cronStatus = 'error';
        cronMessage = `Cron job has not run in ${hoursSinceLastUpdate} hours`;
      }
    }

    return NextResponse.json({
      success: true,
      cronJob: {
        status: cronStatus,
        message: cronMessage,
        endpoint: '/api/cron/update-supabase',
        schedule: '0 6 * * * (Daily at 6:00 AM UTC)',
        lastUpdate: lastUpdateTime?.toISOString() || 'Never',
        hoursSinceLastUpdate,
      },
      database: {
        totalProducts: productCount || 0,
        recentUpdates: recentUpdates || 0,
        lastProductUpdate: lastUpdateTime?.toISOString() || 'Never',
      },
      environment: {
        hasCronSecret: !!process.env.CRON_SECRET,
        hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV,
      },
      recommendations: getRecommendations(cronStatus, productCount, hoursSinceLastUpdate),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Status check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Status check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function getRecommendations(
  cronStatus: string, 
  productCount: number | null, 
  hoursSinceLastUpdate: number | null
): string[] {
  const recommendations: string[] = [];

  if (cronStatus === 'never_run' || cronStatus === 'error') {
    recommendations.push('⚠️ Check that CRON_SECRET environment variable is set in Vercel');
    recommendations.push('⚠️ Verify cron job is configured in vercel.json');
    recommendations.push('⚠️ Check Vercel deployment logs for errors');
  }

  if (cronStatus === 'warning') {
    recommendations.push('⚠️ Cron job may have failed - check Vercel logs');
  }

  if (!productCount || productCount === 0) {
    recommendations.push('⚠️ No products in database - run manual feed update: npm run update-feeds-supabase');
  }

  if (productCount && productCount < 1000) {
    recommendations.push('ℹ️ Low product count - consider checking feed sources');
  }

  if (hoursSinceLastUpdate && hoursSinceLastUpdate > 48) {
    recommendations.push('⚠️ Consider running manual update: /api/cron/update-feeds-manual');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Everything looks good!');
  }

  return recommendations;
}
