# 📊 Vercel Cron Job Monitoring Guide

## Quick Status Check

### Option 1: Status Endpoint (Easiest)
Visit this URL in your browser:
```
https://andaccessories.dk/api/cron/status
```

You'll see a JSON response like:
```json
{
  "success": true,
  "cronJob": {
    "status": "healthy",
    "message": "Cron job ran within the last 24 hours",
    "schedule": "0 6 * * * (Daily at 6:00 AM UTC)",
    "lastUpdate": "2025-10-16T06:00:00.000Z",
    "hoursSinceLastUpdate": 12
  },
  "database": {
    "totalProducts": 28779,
    "recentUpdates": 28779,
    "lastProductUpdate": "2025-10-16T06:00:00.000Z"
  },
  "environment": {
    "hasCronSecret": true,
    "hasSupabase": true,
    "nodeEnv": "production"
  },
  "recommendations": [
    "✅ Everything looks good!"
  ]
}
```

### Status Meanings:
- **✅ healthy** - Cron job ran within last 24 hours
- **⚠️ warning** - Cron job may have missed last run (24-48 hours)
- **❌ error** - Cron job hasn't run in 48+ hours
- **❓ never_run** - No products found or database never updated
- **❔ unknown** - Cannot determine status

---

## Option 2: Vercel Dashboard

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project: `jewelry-by-readdy`

2. **Navigate to Cron Jobs Tab**
   - Look for "Cron Jobs" in the left sidebar
   - If you don't see it, your cron job may not be properly configured

3. **Check Execution History**
   You should see:
   - ✅ Job name: `/api/cron/update-supabase`
   - ⏰ Schedule: `0 6 * * *` (Daily at 6:00 AM UTC)
   - 📅 Last run timestamp
   - 📊 Success/Failure status
   - 📝 Execution logs

4. **View Individual Executions**
   - Click on any execution to see detailed logs
   - Look for error messages if status is "Failed"

---

## Option 3: Vercel CLI (Real-Time Logs)

### Installation:
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login
```

### Watch Logs Live:
```bash
# Navigate to your project directory
cd "C:\Users\Ulrich\myWebsites\jewelry by readdy"

# Link to your Vercel project (first time only)
vercel link

# Watch logs in real-time
vercel logs --follow
```

### Check Recent Logs:
```bash
# Get last 100 log entries
vercel logs

# Filter for cron job executions
vercel logs | grep "cron"
```

---

## Option 4: Function Logs in Vercel Dashboard

### Step-by-Step:

1. Go to **Deployments** tab
2. Click on your **latest deployment**
3. Click on **Functions** tab
4. Look for `/api/cron/update-supabase`
5. Click on individual function invocations
6. Review execution logs and response

---

## Option 5: Manual Testing

### Test the Cron Job Manually:

You can trigger the cron job manually to test if it works:

```bash
# Use curl (replace YOUR_CRON_SECRET with your actual secret)
curl -X GET "https://andaccessories.dk/api/cron/update-supabase" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Or use the **manual update endpoint** (no auth required):
```bash
curl -X GET "https://andaccessories.dk/api/cron/update-feeds-manual"
```

Or just visit in your browser:
```
https://andaccessories.dk/api/cron/update-feeds-manual
```

---

## 🚨 Troubleshooting

### Problem: "hasCronSecret": false

**Solution:** Add `CRON_SECRET` to Vercel environment variables

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `CRON_SECRET`
   - **Value:** Generate a random string, e.g., `cron_secret_abc123xyz`
   - **Environment:** Production, Preview, Development
4. **Redeploy** your project

### Problem: Cron job not showing in Vercel Dashboard

**Check:**
1. Is `vercel.json` committed to your repository?
2. Does it contain the crons configuration?
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/update-supabase",
         "schedule": "0 6 * * *"
       }
     ]
   }
   ```
3. Have you deployed after adding `vercel.json`?

### Problem: Cron job runs but fails

**Debug steps:**
1. Check status endpoint: `/api/cron/status`
2. Look at error message in recommendations
3. Check Vercel function logs for detailed error
4. Common issues:
   - Missing `SUPABASE_SERVICE_ROLE_KEY`
   - Network timeout (increase function timeout)
   - Database connection issues

### Problem: "hoursSinceLastUpdate": null

This means no products have been updated yet.

**Solution:**
Run manual update:
```bash
# From your local machine
npm run update-feeds-supabase

# Or trigger via API
curl https://andaccessories.dk/api/cron/update-feeds-manual
```

---

## 📅 Cron Job Schedule

Your cron job is scheduled to run:
- **Schedule:** `0 6 * * *`
- **Time:** Daily at 6:00 AM UTC
- **Danish Time:** 07:00 AM (CET) or 08:00 AM (CEST)

### Cron Expression Breakdown:
```
0 6 * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23) - 6 AM UTC
└─────────── Minute (0-59) - At :00
```

---

## 📊 Monitoring Checklist

Daily/Weekly checks:
- [ ] Visit `/api/cron/status` to verify cron health
- [ ] Check `totalProducts` count is reasonable (20,000+)
- [ ] Verify `hoursSinceLastUpdate` is less than 24
- [ ] Check `recommendations` for any warnings

Monthly checks:
- [ ] Review Vercel cron job execution history
- [ ] Verify no failed executions
- [ ] Check database growth trends
- [ ] Validate data quality in Supabase

---

## 🔔 Setting Up Alerts (Optional)

### Option 1: Vercel Notifications
1. Go to Vercel Dashboard → Settings → Notifications
2. Enable "Deployment Failed" notifications
3. Add your email for alerts

### Option 2: Custom Monitoring Script
Create a simple monitoring script that checks the status endpoint:

```bash
#!/bin/bash
# check-cron.sh

STATUS=$(curl -s https://andaccessories.dk/api/cron/status | jq -r '.cronJob.status')

if [ "$STATUS" != "healthy" ]; then
  echo "⚠️ ALERT: Cron job status is $STATUS"
  # Add your notification logic here (email, Slack, etc.)
fi
```

Run this script daily with your own cron job or monitoring service.

---

## 📞 Support

If you encounter issues:

1. **Check status endpoint:** `/api/cron/status`
2. **Review Vercel logs:** `vercel logs`
3. **Test manually:** `/api/cron/update-feeds-manual`
4. **Check environment variables** in Vercel Dashboard
5. **Verify database connectivity** in Supabase dashboard

---

## 📝 Quick Reference URLs

- **Status Check:** https://andaccessories.dk/api/cron/status
- **Manual Trigger:** https://andaccessories.dk/api/cron/update-feeds-manual
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

