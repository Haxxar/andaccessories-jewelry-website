# 🔧 Cron Job Fix Guide

## 🚨 **Problem Identified**

Your Supabase database was last updated 3 days ago, which means the cron job isn't working properly.

---

## 🔍 **Root Causes**

### **1. Missing Environment Variable**
The cron job requires a `CRON_SECRET` environment variable that needs to be set in your Vercel deployment.

### **2. Authorization Check**
The cron job has an authorization check that prevents it from running without the proper secret.

### **3. Schedule Configuration**
The cron job is scheduled to run daily at 6 AM UTC (`0 6 * * *`).

---

## ✅ **Solutions I've Implemented**

### **1. Manual Update Endpoint**
Created `/api/cron/update-feeds-manual` - You can trigger this manually to update your database immediately.

### **2. Status Checker**
Created `/api/cron/status` - Check the current status of your cron job and database.

### **3. Better Error Handling**
Improved error messages and logging for easier debugging.

---

## 🚀 **Immediate Fix (Manual Update)**

### **Step 1: Trigger Manual Update**
Visit this URL to update your database right now:
```
https://andaccessories.dk/api/cron/update-feeds-manual
```

This will:
- ✅ Fetch all product feeds
- ✅ Update your Supabase database
- ✅ Show you detailed results

### **Step 2: Check Status**
Visit this URL to see the current status:
```
https://andaccessories.dk/api/cron/status
```

This will show you:
- ✅ Last update time
- ✅ Total products in database
- ✅ Environment variable status
- ✅ Cron job configuration

---

## 🔧 **Permanent Fix (Vercel Configuration)**

### **Step 1: Set Environment Variable**
In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: `your-secret-key-here` (use a random string)
   - **Environment**: Production

### **Step 2: Update Vercel Configuration**
Your `vercel.json` is already configured correctly:
```json
{
  "crons": [
    {
      "path": "/api/cron/update-feeds",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### **Step 3: Redeploy**
After setting the environment variable, redeploy your project.

---

## 📋 **Alternative Solutions**

### **Option 1: Remove Authorization (Less Secure)**
If you want to remove the authorization check, update `app/api/cron/update-feeds/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Remove or comment out this section:
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    console.log('🚀 Starting automated feed update...');
    // ... rest of the code
```

### **Option 2: Use Manual Trigger Only**
You can remove the automatic cron job and just use the manual endpoint when needed.

### **Option 3: Different Schedule**
Change the schedule in `vercel.json` to run more frequently:
```json
{
  "crons": [
    {
      "path": "/api/cron/update-feeds",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

---

## 🔍 **Testing Your Fix**

### **1. Test Manual Update**
```bash
curl https://andaccessories.dk/api/cron/update-feeds-manual
```

### **2. Check Status**
```bash
curl https://andaccessories.dk/api/cron/status
```

### **3. Verify in Supabase**
Check your Supabase dashboard to see if products were updated.

---

## 📊 **Expected Results**

### **Successful Manual Update Response:**
```json
{
  "success": true,
  "message": "Manual feed update completed successfully",
  "localResult": {
    "success": 1500,
    "errors": 0,
    "total": 1500
  },
  "supabaseResult": {
    "inserted": 1500,
    "deleted": 1500,
    "errors": 0
  },
  "duration": 45000,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **Status Check Response:**
```json
{
  "success": true,
  "data": {
    "supabase": {
      "totalProducts": 1500,
      "lastUpdate": "2024-01-15T10:30:00.000Z",
      "timeSinceUpdateHours": 0,
      "hasRecentUpdate": true
    },
    "environment": {
      "cronSecretSet": true,
      "supabaseUrlSet": true,
      "supabaseKeySet": true
    }
  }
}
```

---

## 🆘 **Troubleshooting**

### **Manual Update Fails**
- Check your Supabase credentials
- Verify your product feed URLs are accessible
- Check the browser console for errors

### **Status Shows Old Data**
- The manual update might have failed
- Check the error messages in the response
- Verify your Supabase connection

### **Cron Job Still Not Working**
- Verify the `CRON_SECRET` environment variable is set
- Check Vercel's function logs
- Ensure the cron job is enabled in Vercel

---

## 🎯 **Quick Action Plan**

1. **Immediate**: Visit `/api/cron/update-feeds-manual` to update your database now
2. **Check**: Visit `/api/cron/status` to verify the update worked
3. **Fix**: Set the `CRON_SECRET` environment variable in Vercel
4. **Deploy**: Redeploy your project
5. **Monitor**: Check tomorrow if the automatic cron job runs

---

## 📞 **Need Help?**

If you're still having issues:
1. Check the Vercel function logs
2. Verify all environment variables are set
3. Test the manual endpoint first
4. Check your Supabase connection

**Your database should be updated within minutes using the manual endpoint!** 🚀
