import cron from 'node-cron';
import { productFeedFetcher } from './productFeedFetcher';

class CronJobManager {
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private isRunning = false;

  constructor() {
    this.setupJobs();
  }

  private setupJobs() {
    // Daily feed update at 6 AM
    const dailyFeedUpdate = cron.schedule('0 6 * * *', async () => {
      console.log('🕕 Starting daily feed update...');
      await this.runFeedUpdate();
    }, {
      scheduled: false,
      timezone: 'Europe/Copenhagen'
    });

    // Weekly cleanup on Sundays at 2 AM
    const weeklyCleanup = cron.schedule('0 2 * * 0', async () => {
      console.log('🧹 Starting weekly cleanup...');
      productFeedFetcher.cleanupOldData();
    }, {
      scheduled: false,
      timezone: 'Europe/Copenhagen'
    });

    // Health check every hour
    const healthCheck = cron.schedule('0 * * * *', async () => {
      console.log('💓 Health check - Database is accessible');
      try {
        const count = productFeedFetcher.getProductCount();
        console.log(`📊 Current product count: ${count}`);
      } catch (error) {
        console.error('❌ Health check failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'Europe/Copenhagen'
    });

    this.jobs.set('dailyFeedUpdate', dailyFeedUpdate);
    this.jobs.set('weeklyCleanup', weeklyCleanup);
    this.jobs.set('healthCheck', healthCheck);
  }

  async runFeedUpdate(): Promise<void> {
    if (this.isRunning) {
      console.log('⏳ Feed update already running, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log('🚀 Starting product feed update...');
      const result = await productFeedFetcher.fetchAndStoreAllFeeds();
      
      const duration = Date.now() - startTime;
      console.log(`✅ Feed update completed in ${duration}ms`);
      console.log(`📊 Results: ${result.success} products stored, ${result.errors} errors, ${result.total} total fetched`);
      
      // Log success
      console.log('🎉 Daily feed update successful');
    } catch (error) {
      console.error('❌ Feed update failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  start(): void {
    console.log('🔄 Starting cron jobs...');
    
    this.jobs.forEach((job, name) => {
      job.start();
      console.log(`✅ Started cron job: ${name}`);
    });

    console.log('🎉 All cron jobs started successfully');
  }

  stop(): void {
    console.log('⏹️ Stopping cron jobs...');
    
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`⏹️ Stopped cron job: ${name}`);
    });

    console.log('✅ All cron jobs stopped');
  }

  getStatus(): { [key: string]: boolean } {
    const status: { [key: string]: boolean } = {};
    this.jobs.forEach((job, name) => {
      status[name] = job.getStatus() === 'scheduled';
    });
    return status;
  }

  // Manual trigger methods for testing
  async triggerDailyUpdate(): Promise<void> {
    console.log('🔧 Manually triggering daily feed update...');
    await this.runFeedUpdate();
  }

  triggerCleanup(): void {
    console.log('🔧 Manually triggering cleanup...');
    productFeedFetcher.cleanupOldData();
  }

  // Get job information
  getJobInfo(): Array<{ name: string; schedule: string; description: string; running: boolean }> {
    return [
      {
        name: 'dailyFeedUpdate',
        schedule: '0 6 * * *',
        description: 'Daily product feed update at 6 AM',
        running: this.jobs.get('dailyFeedUpdate')?.getStatus() === 'scheduled'
      },
      {
        name: 'weeklyCleanup',
        schedule: '0 2 * * 0',
        description: 'Weekly cleanup of old data on Sundays at 2 AM',
        running: this.jobs.get('weeklyCleanup')?.getStatus() === 'scheduled'
      },
      {
        name: 'healthCheck',
        schedule: '0 * * * *',
        description: 'Hourly health check and product count',
        running: this.jobs.get('healthCheck')?.getStatus() === 'scheduled'
      }
    ];
  }
}

// Export singleton instance
export const cronJobManager = new CronJobManager();

// Auto-start cron jobs when this module is imported
if (process.env.NODE_ENV === 'production') {
  cronJobManager.start();
} else {
  console.log('🔧 Development mode: Cron jobs not auto-started. Use cronJobManager.start() to start manually.');
}

