# 🔧 Netlify Login Issue - Fix Guide

## Problem
Cannot login on Netlify deployed site - likely due to missing Firebase environment variables.

---

## ✅ Solution: Add Environment Variables to Netlify

### Step 1: Go to Netlify Dashboard
1. Login to: https://app.netlify.com/
2. Click on your deployed site
3. Go to **"Site settings"** (in top menu)
4. Click **"Environment variables"** (left sidebar)

### Step 2: Add ALL These Variables

Click **"Add a variable"** for each one:

```env
VITE_API_BASE_URL
Value: https://your-backend-url.railway.app
(Replace with YOUR actual Railway backend URL!)

VITE_USE_MOCK_API
Value: false

VITE_FIREBASE_API_KEY
Value: AIzaSyCx6VT1dGrXWIJir-yq_nfAm8pq5806Do0

VITE_FIREBASE_AUTH_DOMAIN
Value: universal-tracker-f3fbd.firebaseapp.com

VITE_FIREBASE_PROJECT_ID
Value: universal-tracker-f3fbd

VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 35511528568

VITE_FIREBASE_APP_ID
Value: 1:35511528568:web:074eed17458b76d220918d

VITE_FIREBASE_VAPID_KEY
Value: BMa0RjGvFgvhscAgJmG_LR3bpL5Uf2QZCKbcy_oXknKMJJ6R0EUcfH97EeQ-Lt10MzmqRyqXVtpNyrRAWFO37y8
```

### Step 3: Trigger Redeploy

After adding all variables:
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait 2-3 minutes for build to complete

### Step 4: Test Login

1. Visit your Netlify URL
2. Try logging in
3. Should work now! ✅

---

## 🔍 How to Check if Variables are Set

### Method 1: Check Netlify UI
1. Site settings → Environment variables
2. Should see all 8 variables listed

### Method 2: Check Browser Console
1. Open your deployed site
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Type: `import.meta.env`
5. Should see all VITE_ variables with values

---

## ❓ Common Issues & Solutions

### Issue 1: "Firebase: Error (auth/invalid-api-key)"
**Cause**: Firebase API key not set or incorrect
**Solution**: 
- Check `VITE_FIREBASE_API_KEY` is added to Netlify
- Verify no extra spaces
- Redeploy after adding

### Issue 2: "Network Error" or "Cannot connect"
**Cause**: Backend URL not set
**Solution**:
- Check `VITE_API_BASE_URL` points to your Railway backend
- Test backend URL works: `https://your-backend.railway.app/api/gold/current-price`
- Ensure backend is deployed and running

### Issue 3: Login button does nothing
**Cause**: Firebase auth domain not set
**Solution**:
- Check `VITE_FIREBASE_AUTH_DOMAIN` is correct
- Should be: `universal-tracker-f3fbd.firebaseapp.com`
- Redeploy

### Issue 4: "Popup blocked" for Google Sign-in
**Cause**: Browser blocking popups
**Solution**:
- Use email/password login instead
- Or allow popups for your Netlify domain

### Issue 5: Variables not updating
**Cause**: Cache not cleared
**Solution**:
- Clear cache and redeploy (not just redeploy)
- Or change site name to force fresh build

---

## 📋 Quick Verification Checklist

Before testing login:
- [ ] All 8 environment variables added to Netlify
- [ ] Backend is deployed and running on Railway
- [ ] `VITE_API_BASE_URL` points to correct Railway URL
- [ ] Triggered redeploy with "Clear cache"
- [ ] Deploy completed successfully (green checkmark)
- [ ] No build errors in deploy logs

---

## 🎯 Step-by-Step Test

After fixing:

1. **Open Deployed Site**
   - Visit your Netlify URL
   - Should see login page

2. **Test Signup First** (If you haven't created account)
   - Click "Sign up"
   - Enter email/password
   - Should create account successfully

3. **Test Login**
   - Enter same email/password
   - Click "Sign in"
   - Should redirect to dashboard ✅

4. **Test Google Sign-in** (Optional)
   - Click "Sign in with Google"
   - Choose Google account
   - Should work ✅

---

## 🔧 Alternative: Use Environment Variables File

If variables UI is confusing, you can also:

### Create `netlify.toml` (Already done! ✅)
The file is already in your project root.

### Add variables via Netlify CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Set env vars
netlify env:set VITE_FIREBASE_API_KEY "AIzaSyCx6VT1dGrXWIJir-yq_nfAm8pq5806Do0"
# Repeat for all 8 variables...

# Redeploy
netlify deploy --prod
```

---

## 💡 Pro Tip: Copy from Local

Your local `.env` file has all the correct values!

1. Open: `.env` (project root)
2. Copy each value
3. Paste into Netlify environment variables
4. Just change `VITE_API_BASE_URL` to your Railway URL

---

## 🚨 Critical: Backend URL

Most important variable:
```
VITE_API_BASE_URL=https://your-backend.railway.app
```

Without this, frontend can't reach backend and NOTHING will work!

To get your backend URL:
1. Go to Railway dashboard: https://railway.app/dashboard
2. Click your project
3. Click on your service
4. Go to Settings
5. Scroll to "Domains"
6. Copy the URL

---

## ✅ Confirmation Test

After fixing and redeploying, test:

```javascript
// Open browser console on your Netlify site
// Type these commands:

// 1. Check if env vars are loaded
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Firebase Key:', import.meta.env.VITE_FIREBASE_API_KEY);

// Should show actual values, not undefined!

// 2. Check Firebase init
console.log('Firebase Auth:', window.firebase);

// Should show Firebase object, not null
```

---

## 📞 Still Not Working?

### Check Deploy Logs:
1. Netlify → Deploys → Click latest deploy
2. Scroll to "Deploy log"
3. Look for errors

### Common Deploy Errors:
```
❌ "Module not found" → Missing dependency, run npm install locally
❌ "Build failed" → Check package.json scripts
❌ "Environment variable undefined" → Variables not set
✅ "Site is live" → Should work!
```

### Test Backend Separately:
```bash
# Test if backend is accessible
curl https://your-backend.railway.app/api/gold/current-price

# Should return JSON with gold price
# If this fails, backend is the problem, not frontend!
```

---

## 🎉 Expected Result

After fix:
1. ✅ Can visit login page
2. ✅ Can create account (signup)
3. ✅ Can login with email/password
4. ✅ Can login with Google
5. ✅ Redirects to dashboard
6. ✅ All features work
7. ✅ No console errors

---

## 📝 Summary

**Root Cause**: Environment variables not set in Netlify

**Fix**: Add all 8 VITE_ variables to Netlify environment variables

**Critical Variable**: `VITE_API_BASE_URL` must point to Railway backend

**After Fix**: Clear cache, redeploy, test login

**Result**: Login should work! ✅

---

Need more help? Check these files:
- `DEPLOY_TO_NETLIFY.md` - Full deployment guide
- `ENVIRONMENT_VARIABLES.md` - All variables explained
- `QUICK_DEPLOY.md` - Fast deployment steps

Your app will work perfectly once environment variables are set! 🚀
