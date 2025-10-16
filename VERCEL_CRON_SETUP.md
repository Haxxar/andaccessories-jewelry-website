# ⚡ Vercel Cron Job Setup - Quick Guide

## What Changed?

✅ **Simplified to 1 Cron Job Only** (to stay within Vercel's free plan limit)

### Old Setup (Multiple Cron Jobs):
- ❌ `/api/cron/update-feeds` - Main cron
- ❌ Other cron jobs on your Vercel account

### New Setup (Single Optimized Cron):
- ✅ `/api/cron/update-supabase` - Updates Supabase directly
- ⏰ Runs daily at 6:00 AM UTC
- 📦 Fetches products from all feeds and updates database

---

## 🚀 Deployment Steps

### 1. **Remove Old Cron Jobs from Vercel** (Important!)

Before deploying the new cron job, you need to remove the old ones:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check **all your projects** for cron jobs
3. Delete or disable any existing cron jobs you don't need
4. Make sure you have **at least 1 cron job slot available**

### 2. **Set Environment Variable**

Add `CRON_SECRET` to your Vercel project:

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name:** `CRON_SECRET`
   - **Value:** `cron_secret_jewelry_2025` (or any secure random string)
   - **Environment:** ✅ Production, ✅ Preview, ✅ Development
4. Click **Save**

### 3. **Deploy to Vercel**

```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Simplify to single cron job for Supabase updates"

# Push to trigger deployment
git push
```

### 4. **Verify Deployment**

After deployment completes:

1. Visit: https://andaccessories.dk/api/cron/status
2. Check that:
   - `"hasCronSecret": true`
   - `"hasSupabase": true`

---

## 📊 How It Works

### Cron Job Flow:

```
Daily at 6:00 AM UTC
      ↓
/api/cron/update-supabase
      ↓
Fetch products from 10 feed sources
      ↓
Clear existing Supabase products
      ↓
Insert ~28,000+ products in batches
      ↓
Update complete ✅
```

### What Gets Updated:
- ✅ All products from Partner Ads feeds
- ✅ Prices, availability, descriptions
- ✅ Images, brands, categories
- ✅ Stock information

---

## 🔍 Monitoring

### Quick Status Check:
```
https://andaccessories.dk/api/cron/status
```

### Expected Response:
```json
{
  "success": true,
  "cronJob": {
    "status": "healthy",
    "endpoint": "/api/cron/update-supabase",
    "schedule": "0 6 * * * (Daily at 6:00 AM UTC)"
  },
  "database": {
    "totalProducts": 28779
  }
}
```

---

## 🧪 Manual Testing

### Test the Cron Job Without Waiting:

**Option 1:** With Auth (Same as automatic cron)
```bash
curl -X GET "https://andaccessories.dk/api/cron/update-supabase" \
  -H "Authorization: Bearer cron_secret_jewelry_2025"
```

**Option 2:** Manual Endpoint (No auth needed)
```
https://andaccessories.dk/api/cron/update-feeds-manual
```

Just visit the URL in your browser and it will update Supabase.

---

## ⚙️ Configuration Files

### vercel.json
```json
{
  "version": 2,
  "env": {
    "NODE_ENV": "production"
  },
  "crons": [
    {
      "path": "/api/cron/update-supabase",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### Cron Schedule Explained:
```
0 6 * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (any)
│ │ │ └─── Month (any)
│ │ └───── Day of month (any)
│ └─────── Hour (6 AM UTC = 7 AM CET / 8 AM CEST)
└───────── Minute (0)
```

---

## 🚨 Troubleshooting

### Error: "Your team currently has 2 cron jobs"

**Solution:**
1. Go to Vercel Dashboard
2. Check **all projects** in your account
3. Find and **delete** unused cron jobs
4. You need at least 1 slot free
5. Then redeploy this project

### Error: "Unauthorized" (401)

**Solution:**
- Make sure `CRON_SECRET` is set in Vercel
- Verify it matches the value in your code
- Redeploy after adding the variable

### Cron Job Not Running

**Check:**
1. Visit `/api/cron/status` - is `hasCronSecret` true?
2. Is Supabase configured? - is `hasSupabase` true?
3. Check Vercel Dashboard → Cron Jobs tab
4. Look at deployment logs for errors

### Products Not Updating

**Solutions:**
1. Check feed sources are accessible
2. Run manual update: `/api/cron/update-feeds-manual`
3. Check Supabase dashboard for connection issues
4. Review function logs in Vercel

---

## 📞 Quick Reference

| What | URL |
|------|-----|
| Status Check | https://andaccessories.dk/api/cron/status |
| Manual Update | https://andaccessories.dk/api/cron/update-feeds-manual |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Old cron jobs removed from Vercel
- [ ] `CRON_SECRET` environment variable set
- [ ] Project deployed successfully
- [ ] Status endpoint shows `"hasCronSecret": true`
- [ ] Status endpoint shows `"hasSupabase": true`
- [ ] Cron job appears in Vercel Dashboard
- [ ] Manual test successful
- [ ] Verified in Supabase that products exist

---

## 💡 Pro Tips

1. **Monitor Daily:** Check `/api/cron/status` once a day for the first week
2. **Set Reminders:** Add a calendar reminder to check status weekly
3. **Backup Plan:** If cron fails, run manual update via browser
4. **Logs:** Bookmark Vercel logs page for quick debugging
5. **Contact Support:** If you need more cron jobs, consider upgrading Vercel plan

---

Need help? Check the detailed monitoring guide: `CRON_JOB_MONITORING.md`

