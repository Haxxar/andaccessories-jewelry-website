# Multi-Site Cron Job Setup Guide

This guide explains how to set up a single cron job that updates multiple websites, allowing you to work within Vercel's 2 cron job limit.

## 🏗️ Architecture Overview

The multi-site system allows you to:
- **Single Cron Job**: Update all your websites with one cron job
- **Multiple Databases**: Each site can have its own Supabase database
- **Independent Feeds**: Each site can have different product feeds
- **Centralized Management**: Monitor and manage all sites from one place

## 🚀 Quick Setup

### 1. Environment Variables

Add these environment variables to your Vercel project for each additional site:

#### For Site 2:
```env
SITE2_SUPABASE_URL=https://your-site2-project.supabase.co
SITE2_SUPABASE_SERVICE_KEY=your_site2_service_role_key
```

#### For Site 3:
```env
SITE3_SUPABASE_URL=https://your-site3-project.supabase.co
SITE3_SUPABASE_SERVICE_KEY=your_site3_service_role_key
```

#### For Site 4:
```env
SITE4_SUPABASE_URL=https://your-site4-project.supabase.co
SITE4_SUPABASE_SERVICE_KEY=your_site4_service_role_key
```

### 2. Update Site Configuration

Edit `lib/multiSiteManager.ts` to add your additional sites:

```typescript
// Site 2: Your second website
if (process.env.SITE2_SUPABASE_URL && process.env.SITE2_SUPABASE_SERVICE_KEY) {
  this.sites.push({
    id: 'site-2',
    name: 'Your Second Website',
    domain: 'your-second-site.com',
    supabaseUrl: process.env.SITE2_SUPABASE_URL,
    supabaseServiceKey: process.env.SITE2_SUPABASE_SERVICE_KEY,
    feedUrls: [
      'https://your-second-site.com/feed1.xml',
      'https://your-second-site.com/feed2.xml',
      // Add all your feed URLs here
    ],
    categories: ['category1', 'category2', 'category3'],
    brands: ['brand1', 'brand2', 'brand3'],
    materials: ['material1', 'material2'],
    enabled: true
  });
}
```

### 3. Deploy Changes

```bash
git add .
git commit -m "Add multi-site support"
git push
```

## 📊 Monitoring

### Check All Sites Status
```bash
curl https://your-domain.com/api/cron/multi-site-status
```

### Manual Update All Sites
```bash
curl -X GET "https://your-domain.com/api/cron/update-all-sites" \
     -H "Authorization: Bearer cron_secret_jewelry_2025"
```

## 🔧 Configuration Options

### Site Configuration Properties

Each site can be configured with:

- **id**: Unique identifier for the site
- **name**: Display name for the site
- **domain**: The website domain
- **supabaseUrl**: Supabase project URL
- **supabaseServiceKey**: Supabase service role key
- **feedUrls**: Array of product feed URLs
- **categories**: Array of product categories
- **brands**: Array of product brands
- **materials**: Array of product materials
- **enabled**: Whether the site is active

### Enabling/Disabling Sites

You can temporarily disable sites by setting `enabled: false` in the configuration, or by removing the environment variables.

## 🎯 Benefits

### ✅ Advantages
- **Cost Effective**: Use only 1 of your 2 Vercel cron jobs
- **Centralized Management**: Monitor all sites from one dashboard
- **Consistent Updates**: All sites update at the same time
- **Scalable**: Easy to add more sites
- **Independent**: Each site has its own database and feeds

### ⚠️ Considerations
- **Sequential Processing**: Sites are updated one at a time (not parallel)
- **Total Time**: All sites must complete within Vercel's 10-minute limit
- **Error Handling**: If one site fails, others continue processing

## 🔄 Cron Job Schedule

The default schedule is daily at 6 AM UTC:
```json
{
  "path": "/api/cron/update-all-sites",
  "schedule": "0 6 * * *"
}
```

You can modify this in `vercel.json` to run at different times or frequencies.

## 🛠️ Advanced Configuration

### Custom Feed Processing

If you need different processing logic for different sites, you can:

1. Create site-specific feed fetchers
2. Add conditional logic in the update function
3. Use different normalization rules per site

### Database Schema Variations

Each site can have different database schemas as long as they're compatible with the product structure.

## 📈 Performance Optimization

### Batch Size Tuning
Adjust the `batchSize` in the update function based on your needs:
- Smaller batches (25-50): Better for memory-constrained environments
- Larger batches (100-200): Better for high-performance environments

### Timeout Configuration
Adjust feed timeouts based on your feed sources:
- Fast feeds: 10-15 seconds
- Slow feeds: 30-60 seconds

## 🆘 Troubleshooting

### Common Issues

1. **Site Not Updating**: Check environment variables are set correctly
2. **Timeout Errors**: Reduce batch size or increase timeouts
3. **Memory Issues**: Process fewer sites simultaneously
4. **Feed Errors**: Check feed URLs are accessible

### Debugging

Enable detailed logging by checking the Vercel function logs:
```bash
vercel logs --follow
```

## 📋 Example: Adding a Third Site

1. **Set Environment Variables**:
   ```env
   SITE3_SUPABASE_URL=https://site3-project.supabase.co
   SITE3_SUPABASE_SERVICE_KEY=site3_service_key
   ```

2. **Add Site Configuration**:
   ```typescript
   // In lib/multiSiteManager.ts
   if (process.env.SITE3_SUPABASE_URL && process.env.SITE3_SUPABASE_SERVICE_KEY) {
     this.sites.push({
       id: 'site-3',
       name: 'Third Website',
       domain: 'third-site.com',
       supabaseUrl: process.env.SITE3_SUPABASE_URL,
       supabaseServiceKey: process.env.SITE3_SUPABASE_SERVICE_KEY,
       feedUrls: [
         'https://third-site.com/products.xml',
         'https://third-site.com/accessories.xml',
       ],
       categories: ['jewelry', 'accessories', 'watches'],
       brands: ['brand1', 'brand2'],
       materials: ['gold', 'silver'],
       enabled: true
     });
   }
   ```

3. **Deploy and Test**:
   ```bash
   git add .
   git commit -m "Add third site"
   git push
   ```

## 🎉 You're Done!

Your multi-site cron job is now set up and will update all your websites with a single cron job, saving you precious Vercel cron job slots!
