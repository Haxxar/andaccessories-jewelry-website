# 🍪 Cookiebot Setup Guide for &Accessories

## ✅ What I've Implemented

### 1. **Cookiebot Integration**
- Added Cookiebot script to `app/layout.tsx`
- Created `CookiebotProvider` component for consent management
- Updated affiliate tracking to respect cookie consent
- Removed old custom cookie consent component

### 2. **Google Analytics Integration**
- Added Google Analytics with consent-based loading
- Analytics only loads when user consents to "statistics" cookies
- Proper anonymization and cookie flags

### 3. **Affiliate Tracking Updates**
- Updated `lib/affiliateTracker.ts` to check Cookiebot consent
- Marketing cookies only set when user consents
- Fallback to localStorage for backward compatibility

---

## 🔧 Setup Steps (You Need to Do)

### **Step 1: Get Cookiebot Account**
1. Go to [cookiebot.com](https://cookiebot.com)
2. Sign up for a free account
3. Add your domain: `andaccessories.dk`
4. Get your **Cookiebot ID** (starts with letters/numbers)

### **Step 2: Update Configuration**
Replace these placeholders in `app/layout.tsx`:

```typescript
// Replace this line:
data-cbid="YOUR_COOKIEBOT_ID"

// With your actual Cookiebot ID:
data-cbid="abc12345-6789-def0-1234-567890abcdef"
```

### **Step 3: Add Google Analytics**
Replace this placeholder in `app/layout.tsx`:

```typescript
// Replace this line:
src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"

// With your actual GA4 Measurement ID:
src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
```

And update the config:
```typescript
// Replace this line:
gtag('config', 'GA_MEASUREMENT_ID', {

// With your actual GA4 Measurement ID:
gtag('config', 'G-XXXXXXXXXX', {
```

### **Step 4: Configure Cookiebot**
In your Cookiebot dashboard:

1. **Cookie Declaration**: Add these cookies:
   - `_ga`, `_ga_*` (Google Analytics)
   - `jewelry_partner_id` (Your affiliate tracking)
   - Any other cookies you use

2. **Cookie Categories**:
   - **Necessary**: Always active (site functionality)
   - **Preferences**: User preferences, language settings
   - **Statistics**: Google Analytics, performance monitoring
   - **Marketing**: Affiliate tracking, advertising

3. **Languages**: Set to Danish (da)

4. **Styling**: Customize to match your pink/yellow theme

---

## 🎯 Cookie Categories Explained

### **Necessary Cookies** ✅ Always Active
- Session management
- Security tokens
- Basic site functionality

### **Preferences Cookies** 🔧 Optional
- Language preferences
- User interface settings
- Remember login state

### **Statistics Cookies** 📊 Optional
- Google Analytics
- Performance monitoring
- User behavior analysis

### **Marketing Cookies** 🎯 Optional
- Affiliate tracking (`jewelry_partner_id`)
- Advertising networks
- Social media pixels

---

## 🚀 Benefits of This Setup

### **Legal Compliance**
- ✅ GDPR compliant
- ✅ CCPA compliant
- ✅ Cookie Law compliant
- ✅ Automatic consent management

### **User Experience**
- ✅ Clear cookie categories
- ✅ Granular consent options
- ✅ Easy to understand language
- ✅ Professional appearance

### **Technical Benefits**
- ✅ Automatic cookie blocking
- ✅ Consent-based script loading
- ✅ Easy consent withdrawal
- ✅ Audit trail for compliance

---

## 🔍 Testing Your Setup

### **1. Test Cookiebot Banner**
- Visit your site in incognito mode
- You should see the Cookiebot consent banner
- Test all consent options

### **2. Test Analytics**
- Accept "Statistics" cookies
- Check browser dev tools → Network tab
- You should see Google Analytics requests

### **3. Test Affiliate Tracking**
- Accept "Marketing" cookies
- Click on a product link
- Check browser dev tools → Application → Cookies
- You should see `jewelry_partner_id` cookie

### **4. Test Consent Withdrawal**
- Use Cookiebot's "Cookie Declaration" link
- Withdraw consent for marketing cookies
- Affiliate tracking should stop working

---

## 📋 Next Steps

1. **Get Cookiebot account** and update the ID
2. **Set up Google Analytics** and update the measurement ID
3. **Configure cookie categories** in Cookiebot dashboard
4. **Test everything** in incognito mode
5. **Deploy to production**

---

## 🆘 Troubleshooting

### **Banner Not Showing**
- Check if Cookiebot ID is correct
- Verify domain is added in Cookiebot dashboard
- Clear browser cache

### **Analytics Not Working**
- Check if GA4 measurement ID is correct
- Verify "Statistics" consent is given
- Check browser console for errors

### **Affiliate Tracking Not Working**
- Check if "Marketing" consent is given
- Verify cookie is being set in browser dev tools
- Check console for consent messages

---

## 📞 Support

- **Cookiebot Support**: [support.cookiebot.com](https://support.cookiebot.com)
- **Google Analytics**: [support.google.com/analytics](https://support.google.com/analytics)
- **GDPR Compliance**: [gdpr.eu](https://gdpr.eu)

---

**🎉 Once set up, your site will be fully GDPR compliant with professional cookie management!**
