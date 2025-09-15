import { NextRequest, NextResponse } from 'next/server';
import { productFeedFetcher } from '@/lib/productFeedFetcher';
import { cronJobManager } from '@/lib/cronJobs';

export async function GET(request: NextRequest) {
  try {
    const productCount = productFeedFetcher.getProductCount();
    const recentLogs = productFeedFetcher.getRecentFeedLogs(5);
    const jobStatus = cronJobManager.getStatus();
    const jobInfo = cronJobManager.getJobInfo();

    return NextResponse.json({
      success: true,
      data: {
        productCount,
        recentLogs,
        cronJobs: {
          status: jobStatus,
          info: jobInfo
        },
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching feed status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch feed status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

