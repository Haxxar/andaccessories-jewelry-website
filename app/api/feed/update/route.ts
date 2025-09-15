import { NextRequest, NextResponse } from 'next/server';
import { cronJobManager } from '@/lib/cronJobs';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in development mode or have proper authorization
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      const expectedToken = process.env.FEED_UPDATE_TOKEN;
      
      if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Trigger manual feed update
    await cronJobManager.triggerDailyUpdate();

    return NextResponse.json({
      success: true,
      message: 'Feed update triggered successfully'
    });

  } catch (error) {
    console.error('Error triggering feed update:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to trigger feed update',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

