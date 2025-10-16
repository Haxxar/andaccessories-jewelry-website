# 🔧 Fix 500 Internal Server Error Guide

## 🚨 **Problem Identified**
You're getting a **500 Internal Server Error** when trying to update the database. This means there's a server-side issue in the API endpoint.

## ✅ **Solution: Enhanced Debugging Tools**

I've created multiple debugging endpoints to isolate the exact issue:

### **🔍 New Debugging Endpoints:**

#### **1. Basic API Test**
```
https://andaccessories.dk/api/test-simple
```
- ✅ **Tests basic API connectivity**
- ✅ **No dependencies**
- ✅ **Should always work**

#### **2. Database Connection Test**
```
https://andaccessories.dk/api/test-database
```
- ✅ **Tests Supabase connection**
- ✅ **Tests local database**
- ✅ **Shows environment variables**
- ✅ **Detailed error information**

#### **3. Simple Update Test**
```
https://andaccessories.dk/api/cron/update-feeds-simple
```
- ✅ **Tests Supabase without full update**
- ✅ **Shows current product count**
- ✅ **Minimal operations**

---

## 🎯 **Step-by-Step Debugging Process**

### **Step 1: Use Enhanced Admin Panel**
1. Go to `/admin/update-database`
2. **Click "Test API"** - This will test all connections
3. **Click "Test Simple"** - This will test Supabase specifically
4. **Check the debug information** - Shows exactly what's failing

### **Step 2: Check Debug Information**
The admin panel now shows:
- ✅ **Environment variable status**
- ✅ **Supabase connection details**
- ✅ **Local database status**
- ✅ **Specific error messages**

### **Step 3: Try Direct API Calls**
Test these URLs directly in your browser:

**Basic Test:**
```
https://andaccessories.dk/api/test-simple
```
*Expected: `{"success":true,"message":"Simple test endpoint working"}`*

**Database Test:**
```
https://andaccessories.dk/api/test-database
```
*Expected: Detailed connection information*

**Simple Update:**
```
https://andaccessories.dk/api/cron/update-feeds-simple
```
*Expected: Supabase connection test results*

---

## 🐛 **Most Likely Causes & Fixes**

### **Cause 1: Missing Environment Variables**
**Symptoms:** `Supabase client not available`
**Fix:** Check Vercel environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### **Cause 2: Supabase Connection Issues**
**Symptoms:** Database query errors
**Fix:** 
1. Verify Supabase credentials
2. Check database permissions
3. Ensure database is accessible

### **Cause 3: Product Feed Issues**
**Symptoms:** Timeout during feed fetching
**Fix:** Check if product feed URLs are accessible

### **Cause 4: Memory/Timeout Issues**
**Symptoms:** Function timeout or memory errors
**Fix:** Check Vercel function limits

---

## 📊 **Expected Debug Output**

### **Successful Database Test:**
```json
{
  "success": true,
  "tests": {
    "environment": {
      "supabaseUrl": true,
      "supabaseKey": true,
      "nodeEnv": "production"
    },
    "localDatabase": {
      "exists": false,
      "path": "/vercel/path0/data/products.db"
    },
    "supabase": {
      "connected": true,
      "sampleData": [{"id": 1}]
    },
    "productFeedFetcher": {
      "available": true
    }
  }
}
```

### **Failed Database Test:**
```json
{
  "success": true,
  "tests": {
    "environment": {
      "supabaseUrl": false,
      "supabaseKey": false
    },
    "supabase": {
      "connected": false,
      "error": "Invalid API key"
    }
  }
}
```

---

## 🚀 **Quick Fixes**

### **Fix 1: Check Environment Variables**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Verify these are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### **Fix 2: Test Supabase Connection**
1. Go to your Supabase dashboard
2. Check if the database is accessible
3. Verify the service role key is correct

### **Fix 3: Redeploy Application**
1. After fixing environment variables
2. Trigger a new deployment
3. Test the endpoints again

---

## 🎯 **Next Steps**

### **1. Test the Debug Endpoints**
Use the enhanced admin panel to identify the exact issue:
- `/admin/update-database` → Click "Test API"
- Check the debug information
- Try "Test Simple" for Supabase-specific testing

### **2. Fix the Root Cause**
Based on the debug output:
- **Environment variables** → Set them in Vercel
- **Supabase connection** → Check credentials
- **Database permissions** → Verify access rights

### **3. Test the Fix**
Once the issue is resolved:
- Try the simple update endpoint
- Then try the full update
- Set up automation

---

## 🆘 **Still Having Issues?**

### **Check Vercel Logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Functions tab
4. Check logs for `/api/cron/update-feeds-simple`

### **Common Error Messages:**
- **"Supabase client not available"** → Missing environment variables
- **"Invalid API key"** → Wrong Supabase credentials
- **"Database connection failed"** → Network or permission issues
- **"Function timeout"** → Request taking too long

### **Emergency Fallback:**
If all else fails, you can manually update your database by:
1. Going to Supabase dashboard
2. Using the SQL editor
3. Manually inserting/updating products

---

## 🎉 **Expected Results**

Once fixed, you should see:
- ✅ **Test API** returns success
- ✅ **Test Simple** shows Supabase connection
- ✅ **Update Database** works without 500 errors
- ✅ **Database gets updated** with latest products

The enhanced debugging tools will show you exactly what's wrong and how to fix it! 🚀

