# Supabase Setup Guide

This guide will help you set up Supabase for your jewelry website to enable live, updating data on Vercel.

## 🚀 Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project:
   - **Name**: `andaccessories-jewelry`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to Denmark (Europe)
   - **Plan**: Free tier

## 🔑 Step 2: Get Your Credentials

1. Go to your project dashboard
2. Click on **Settings** → **API**
3. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon Key** (public key)
   - **Service Role Key** (secret key - keep this private!)

## 🗄️ Step 3: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql` from your project
3. Paste and run the SQL to create the products table

## 🔧 Step 4: Configure Environment Variables

### For Local Development:
1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add the same three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 📦 Step 5: Upload Your Data

1. Make sure you have products in your local SQLite database:
   ```bash
   npm run update-feeds
   ```

2. Upload the data to Supabase:
   ```bash
   npm run update-feeds-supabase
   ```

## ✅ Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit your website and check that products are loading from Supabase

3. Deploy to Vercel and verify it works in production

## 🔄 Step 7: Set Up Automatic Updates

### Option A: Manual Updates
Run this command whenever you want to update your products:
```bash
npm run update-feeds-supabase
```

### Option B: Automated Updates (Advanced)
Set up a cron job or GitHub Actions to automatically update your Supabase database.

## 🎉 You're Done!

Your website now has:
- ✅ Live, updating data on Vercel
- ✅ Fast, scalable database
- ✅ Real-time capabilities (if needed)
- ✅ Automatic backups
- ✅ Free tier with generous limits

## 📊 Monitoring

- Check your Supabase dashboard for database usage
- Monitor API calls and storage usage
- Set up alerts for any issues

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check your environment variables
2. **"Table doesn't exist"**: Run the SQL schema setup
3. **"No products showing"**: Upload data with `npm run update-feeds-supabase`
4. **"CORS errors"**: Check your Supabase project settings

### Getting Help:
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
