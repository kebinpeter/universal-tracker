# 🚀 Netlify Setup - Step by Step

Your Netlify project is created but showing 404. Let's fix it!

**Your Netlify Project**: https://app.netlify.com/projects/universaltracker

---

## ✅ Complete Setup Steps

### Step 1: Connect Your Repository

1. **Go to Netlify Dashboard**: https://app.netlify.com/projects/universaltracker
2. Click **"Set up a new site"** or **"Import from Git"**
3. Choose **GitHub**
4. Authorize Netlify (if first time)
5. Select your **universal-tracker** repository
6. Click **"Deploy universaltracker"**

### Step 2: Configure Build Settings

On the deploy configuration screen:

```
Base directory:        (leave empty)
Build command:         npm run build
Publish directory:     dist
```

Click **"Show advanced"**

### Step 3: Add Environment Variables (CRITICAL!)

Click **"New variable"** and add all 8:

```env
VITE_API_BASE_URL=https://your-railway-backend.railway.app
VITE_USE_MOCK_API=false
VITE_FIREBASE_API_KEY=AIzaSyCx6VT1dGrXWIJir-yq_nfAm8pq5806Do0
VITE_FIREBASE_AUTH_DOMAIN=universal-tracker-f3fbd.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=universal-tracker-f3fbd
VITE_FIREBASE_MESSAGING_SENDER_ID=35511528568
VITE_FIREBASE_APP_ID=1:35511528568:web:074eed17458b76d220918d
VITE_FIREBASE_VAPID_KEY=BMa0RjGvFgvhscAgJmG_LR3bpL5Uf2QZCKbcy_oXknKMJJ6R0EUcfH97EeQ-Lt10MzmqRyqXVtpNyrRAWFO37y8
```

⚠️ **IMPORTANT**: Replace `VITE_API_BASE_URL` with your Railway backend URL!

### Step 4: Deploy!

Click **"Deploy universaltracker"**

Wait 2-3 minutes for build to complete.

---

## 🔄 If Site Already Deployed (but showing 404)

### Option A: Check Site Settings

1. Go to: https://app.netlify.com/sites/universaltracker/settings
2. Check **"Build & deploy"** → **"Build settings"**
3. Verify:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. If wrong, update and trigger new deploy

### Option B: Check if Build Succeeded

1. Go to: https://app.netlify.com/sites/universaltracker/deploys
2. Look at latest deploy status
3. If **failed** (red X):
   - Click on it
   - Read error logs
   - Fix issue (usually missing env vars)
   - Trigger new deploy

### Option C: Manual Deploy (If GitHub not connected)

If you didn't connect GitHub:

1. **Rebuild locally**:
   ```bash
   cd "c:\Users\KEBIN PETER T\Desktop\universal 2"
   npm run build
   ```

2. **Drag & Drop Deploy**:
   - Go to: https://app.netlify.com/drop
   - Drag the **`dist`** folder into the upload area
   - Wait for upload to complete
   - Site will be live!

---

## 🎯 Quick Check: Is Your Backend Deployed?

Before fixing frontend, verify backend is live:

### Do you have a Railway backend URL?

**YES** - Use it in `VITE_API_BASE_URL`  
**NO** - Deploy backend first (see DEPLOY_BACKEND.md)

### Test backend:
```bash
# Replace with YOUR backend URL
curl https://your-backend.railway.app/api/gold/current-price
```

Should return JSON with gold price.

---

## 📋 Complete Checklist

### Before Deploying to Netlify:
- [ ] Backend deployed to Railway ✅
- [ ] Backend URL copied ✅
- [ ] Frontend built locally (`npm run build` works) ✅
- [ ] `dist` folder exists ✅
- [ ] All 8 environment variables ready ✅

### During Netlify Setup:
- [ ] Repository connected OR using drag & drop
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] All 8 environment variables added
- [ ] Deploy triggered

### After Deploy:
- [ ] Build succeeded (green checkmark)
- [ ] Site accessible at universaltracker.netlify.app
- [ ] Login page loads
- [ ] Can create account
- [ ] Can login
- [ ] Dashboard shows data

---

## 🚨 Common Issues & Fixes

### Issue: 404 Not Found
**Causes**:
1. No files deployed yet
2. Publish directory wrong (should be `dist`)
3. Build failed

**Fix**:
- Check deploy logs
- Verify build command: `npm run build`
- Verify publish directory: `dist`
- Redeploy

### Issue: "Page Not Found" on refresh
**Cause**: Missing redirect rules

**Fix**: You already have `netlify.toml` and `_redirects` - should work!

### Issue: Build Failed
**Common causes**:
1. Missing environment variables
2. Dependencies not installed
3. Build command wrong

**Fix**:
- Add all env vars before deploying
- Check error in deploy log
- Test build locally first: `npm run build`

### Issue: Site loads but can't login
**Cause**: Environment variables missing

**Fix**: See NETLIFY_LOGIN_FIX.md

---

## ⚡ Fastest Way to Deploy Right Now

### Method 1: Drag & Drop (2 minutes)

```bash
# 1. Build locally
cd "c:\Users\KEBIN PETER T\Desktop\universal 2"
npm run build

# 2. Update .env.production with backend URL (if you have one)
# Edit: VITE_API_BASE_URL=https://your-backend.railway.app

# 3. Rebuild
npm run build

# 4. Go to: https://app.netlify.com/drop
# 5. Drag the "dist" folder
# 6. Done!
```

**Note**: This won't auto-deploy on future changes. Use GitHub connection for that.

### Method 2: Connect GitHub (5 minutes)

1. Push code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Ready for Netlify"
   git push
   ```

2. Netlify → Import from GitHub → Select repo

3. Add environment variables

4. Deploy!

---

## 🎯 Your URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://universaltracker.netlify.app |
| **Backend** | https://your-backend.railway.app (if deployed) |
| **GitHub** | https://github.com/YOUR_USERNAME/universal-tracker |
| **Netlify Dashboard** | https://app.netlify.com/sites/universaltracker |

---

## 📞 Next Steps

### Right Now:
1. ✅ Verify backend is deployed to Railway
2. ✅ Get backend URL
3. ✅ Update `.env.production` with backend URL
4. ✅ Rebuild: `npm run build`
5. ✅ Deploy to Netlify (drag & drop or GitHub)
6. ✅ Add environment variables in Netlify
7. ✅ Test login

### After It's Working:
1. Share URL with manager
2. Create demo account
3. Test all features
4. Celebrate! 🎉

---

## 💡 Pro Tips

### Tip 1: Test Build Locally First
```bash
npm run build
npm run preview
# Visit http://localhost:4173
# If it works locally, it'll work on Netlify
```

### Tip 2: Use Netlify CLI (Advanced)
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Tip 3: Check Build Logs
Always check build logs in Netlify dashboard for errors

### Tip 4: Clear Cache
If changes not showing: Deploy settings → Clear cache and redeploy

---

## ✅ Expected Result

After successful deployment:

1. ✅ https://universaltracker.netlify.app loads
2. ✅ Shows beautiful login page
3. ✅ Can create account
4. ✅ Can login
5. ✅ Dashboard shows all trackers
6. ✅ All features work
7. ✅ Ready to share with manager!

---

## 🆘 Still Need Help?

### Quick Diagnostic:

**Q: Does `npm run build` work locally?**
- YES → Netlify config issue
- NO → Fix local build first

**Q: Is backend deployed?**
- YES → Get URL, add to frontend env vars
- NO → Deploy backend first (DEPLOY_BACKEND.md)

**Q: Are env vars added in Netlify?**
- YES → Check values are correct
- NO → Add them now!

**Q: Does site load but shows errors?**
- Check browser console (F12)
- Check Netlify function logs
- Verify Firebase config

---

## 🎉 Ready to Deploy!

Follow the steps above and your site will be live at:
**https://universaltracker.netlify.app**

Need help with any step? Let me know! 🚀
