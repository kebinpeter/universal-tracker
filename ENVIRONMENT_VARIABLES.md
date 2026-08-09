# 🔐 Environment Variables Guide

Complete guide for setting up environment variables for deployment.

---

## 📋 Overview

Your app has **TWO** parts that need environment variables:
1. **Frontend** (Netlify) - 7 variables
2. **Backend** (Railway/Render) - 7 variables

---

## 🎨 FRONTEND Environment Variables (Netlify)

### Where to Add:
1. Go to Netlify Dashboard
2. Click your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**

### Variables to Add:

```env
# Backend API URL (IMPORTANT: Update after deploying backend!)
VITE_API_BASE_URL=https://your-backend-url.railway.app

# Mock API (set to false for production)
VITE_USE_MOCK_API=false

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCx6VT1dGrXWIJir-yq_nfAm8pq5806Do0

VITE_FIREBASE_AUTH_DOMAIN=universal-tracker-f3fbd.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=universal-tracker-f3fbd

VITE_FIREBASE_MESSAGING_SENDER_ID=35511528568

VITE_FIREBASE_APP_ID=1:35511528568:web:074eed17458b76d220918d

VITE_FIREBASE_VAPID_KEY=BMa0RjGvFgvhscAgJmG_LR3bpL5Uf2QZCKbcy_oXknKMJJ6R0EUcfH97EeQ-Lt10MzmqRyqXVtpNyrRAWFO37y8
```

### ⚠️ IMPORTANT:
- **VITE_API_BASE_URL**: MUST be updated with your actual backend URL after deploying backend!
- Don't include trailing slash: ✅ `.railway.app` ❌ `.railway.app/`
- All Firebase values can stay the same as development

---

## ⚙️ BACKEND Environment Variables (Railway/Render)

### Where to Add:

**Railway**:
1. Go to Railway Dashboard
2. Click your project
3. Go to **"Variables"** tab
4. Click **"New Variable"**

**Render**:
1. Go to Render Dashboard
2. Click your web service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**

### Variables to Add:

```env
# Server Port (Railway auto-assigns, but good to have)
PORT=3000

# MongoDB Database
MONGODB_URI=mongodb+srv://kebinpeter45_db_user:9MXsurGzFK6iFZGc@cluster0.fzslwed.mongodb.net/universal-tracker?retryWrites=true&w=majority

# Gold API (Working ✅)
GOLD_API_KEY=goldapi-92cc1b2948e1219b0ece01fe63096ee7-io
GOLD_API_URL=https://www.goldapi.io/api

# ScraperAPI (For product price scraping)
SCRAPER_API_KEY=d96dd72231c0fdb4f930260dd19a2cf2
SCRAPER_API_URL=https://api.scraperapi.com

# OpenWebNinja API (Backup scraper)
OPENWEBNINJA_API_KEY=ak_vlrnv98wstn3hifxmxzf0fq6ofvru25dbkxugmec8e5yuhn
OPENWEBNINJA_API_URL=https://api.openwebninja.com

# Job API (Optional - add later if needed)
JOB_API_KEY=
```

### 🔒 Security Notes:
- ✅ These values are already in your local `.env` files
- ✅ Never commit `.env` files to Git
- ✅ Railway/Render/Netlify encrypt environment variables
- ✅ MongoDB Atlas already whitelists all IPs (0.0.0.0/0)

---

## 🚀 Deployment Workflow

### Step 1: Deploy Backend FIRST
1. Deploy to Railway/Render
2. Add ALL backend environment variables
3. Wait for deployment to complete
4. **COPY your backend URL**

Example URLs:
- Railway: `https://universal-tracker-backend-production.up.railway.app`
- Render: `https://universal-tracker-backend.onrender.com`

### Step 2: Update Frontend Environment
1. Go to Netlify dashboard
2. Update `VITE_API_BASE_URL` with your backend URL
3. Add all other frontend variables
4. Trigger redeploy (if already deployed)

### Step 3: Test Everything
1. Visit your Netlify site
2. Try logging in
3. Check Gold Tracker (should show real prices)
4. Try adding a product
5. Check all features work

---

## 📝 Quick Copy-Paste Format

### For Netlify (Frontend):

| Variable Name | Value |
|--------------|-------|
| `VITE_API_BASE_URL` | `https://YOUR-BACKEND-URL-HERE` |
| `VITE_USE_MOCK_API` | `false` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyCx6VT1dGrXWIJir-yq_nfAm8pq5806Do0` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `universal-tracker-f3fbd.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `universal-tracker-f3fbd` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `35511528568` |
| `VITE_FIREBASE_APP_ID` | `1:35511528568:web:074eed17458b76d220918d` |
| `VITE_FIREBASE_VAPID_KEY` | `BMa0RjGvFgvhscAgJmG_LR3bpL5Uf2QZCKbcy_oXknKMJJ6R0EUcfH97EeQ-Lt10MzmqRyqXVtpNyrRAWFO37y8` |

### For Railway/Render (Backend):

| Variable Name | Value |
|--------------|-------|
| `PORT` | `3000` |
| `MONGODB_URI` | `mongodb+srv://kebinpeter45_db_user:9MXsurGzFK6iFZGc@cluster0.fzslwed.mongodb.net/universal-tracker?retryWrites=true&w=majority` |
| `GOLD_API_KEY` | `goldapi-92cc1b2948e1219b0ece01fe63096ee7-io` |
| `GOLD_API_URL` | `https://www.goldapi.io/api` |
| `SCRAPER_API_KEY` | `d96dd72231c0fdb4f930260dd19a2cf2` |
| `SCRAPER_API_URL` | `https://api.scraperapi.com` |
| `OPENWEBNINJA_API_KEY` | `ak_vlrnv98wstn3hifxmxzf0fq6ofvru25dbkxugmec8e5yuhn` |
| `OPENWEBNINJA_API_URL` | `https://api.openwebninja.com` |

---

## 🔍 Verification

### Check Backend Variables:
After deploying backend, check logs for:
```
🔑 APIs:
   Gold API: ✅ Configured
   ScraperAPI (Primary): ✅ Configured
   OpenWebNinja (Backup): ✅ Configured
```

### Check Frontend Variables:
Open browser console on your deployed site:
```javascript
// Check if API URL is set correctly
console.log(import.meta.env.VITE_API_BASE_URL);
// Should show your backend URL, not localhost!
```

---

## ❓ Troubleshooting

### "Network Error" in Deployed App
**Problem**: Frontend can't reach backend
**Solution**: 
1. Check `VITE_API_BASE_URL` is correct
2. Ensure backend is deployed and running
3. Test backend URL in browser
4. Check CORS is enabled (already done in your backend)

### "Firebase Error"
**Problem**: Firebase not configured
**Solution**: 
1. Verify all Firebase env vars are added
2. Check no typos in Firebase config
3. Ensure Firebase project is active

### "MongoDB Connection Failed"
**Problem**: Backend can't connect to database
**Solution**:
1. Check MONGODB_URI is correct
2. Verify MongoDB Atlas allows all IPs (0.0.0.0/0)
3. Check database user has read/write permissions
4. Test connection string locally first

### "Gold API Not Working"
**Problem**: API key quota exceeded or invalid
**Solution**:
1. Check GOLD_API_KEY is correct
2. Login to goldapi.io and check quota
3. App will auto-fallback to mock data if API fails

---

## 🎯 Checklist

### Before Deploying:
- [ ] All environment variables documented ✅
- [ ] Backend .env file ready ✅
- [ ] Frontend .env file ready ✅
- [ ] MongoDB connection string tested ✅
- [ ] Gold API key tested ✅
- [ ] Firebase config verified ✅

### During Backend Deployment:
- [ ] Deploy backend to Railway/Render
- [ ] Add all backend environment variables
- [ ] Wait for successful deployment
- [ ] Test backend endpoints
- [ ] Copy backend URL

### During Frontend Deployment:
- [ ] Update VITE_API_BASE_URL with backend URL
- [ ] Add all frontend environment variables to Netlify
- [ ] Deploy frontend
- [ ] Test deployed site

### After Deployment:
- [ ] Test login/signup
- [ ] Test Gold Tracker
- [ ] Test Product Tracker
- [ ] Test notifications
- [ ] Check all pages load
- [ ] Verify real-time features work

---

## 💡 Pro Tips

1. **Always Deploy Backend First**: Frontend needs backend URL
2. **Test Backend Separately**: Before connecting frontend
3. **Use Environment-Specific Values**: Don't use localhost in production
4. **Keep Secrets Safe**: Never commit .env files
5. **Monitor API Usage**: Check Gold API, ScraperAPI quotas regularly
6. **Set Up Alerts**: Get notified when deployment fails
7. **Use Build Logs**: Check Netlify/Railway logs if issues occur

---

## 📞 Need Help?

### Railway Dashboard:
- https://railway.app/dashboard
- Check "Variables" tab
- View "Deployments" for logs

### Render Dashboard:
- https://dashboard.render.com/
- Check "Environment" tab
- View "Logs" for errors

### Netlify Dashboard:
- https://app.netlify.com/
- Check "Site settings" → "Environment variables"
- View "Deploys" for build logs

---

## ✅ Summary

**Total Variables**:
- Frontend: 8 variables (7 Firebase + 1 API + 1 flag)
- Backend: 7 variables (1 port + 1 DB + 5 APIs)

**Critical Variables**:
1. `VITE_API_BASE_URL` - Connect frontend to backend
2. `MONGODB_URI` - Database connection
3. `GOLD_API_KEY` - Real gold prices
4. Firebase keys - Auth and notifications

**All set!** Follow the deployment order and you'll be live! 🚀
