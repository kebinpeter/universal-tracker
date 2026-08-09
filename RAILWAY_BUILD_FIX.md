# 🔧 Railway Build Failure - Fix Guide

## Common Railway Build Issues & Solutions

---

## ✅ Solution 1: Set Root Directory (MOST COMMON)

Railway needs to know your backend is in the `/backend` folder.

### Steps:
1. Go to Railway Dashboard: https://railway.app/dashboard
2. Click your project
3. Click on your service (backend)
4. Go to **"Settings"** tab
5. Scroll to **"Root Directory"**
6. Enter: `backend`
7. Click **"Update"**
8. Go to **"Deployments"** tab
9. Click **"Deploy"** to trigger new build

**This is the #1 fix!** ✅

---

## ✅ Solution 2: Check Environment Variables

Railway needs these environment variables to run:

### Required Variables:
1. Go to your service → **"Variables"** tab
2. Click **"New Variable"** and add:

```env
PORT=3000
MONGODB_URI=mongodb+srv://kebinpeter45_db_user:9MXsurGzFK6iFZGc@cluster0.fzslwed.mongodb.net/universal-tracker?retryWrites=true&w=majority
GOLD_API_KEY=goldapi-92cc1b2948e1219b0ece01fe63096ee7-io
GOLD_API_URL=https://www.goldapi.io/api
SCRAPER_API_KEY=d96dd72231c0fdb4f930260dd19a2cf2
SCRAPER_API_URL=https://api.scraperapi.com
OPENWEBNINJA_API_KEY=ak_vlrnv98wstn3hifxmxzf0fq6ofvru25dbkxugmec8e5yuhn
OPENWEBNINJA_API_URL=https://api.openwebninja.com
```

3. After adding all variables, redeploy

---

## ✅ Solution 3: Check Build Logs

To see the EXACT error:

1. Railway Dashboard → Your Project
2. Click on your service
3. Go to **"Deployments"** tab
4. Click on the failed deployment (red X)
5. Read the error logs

### Common Errors & Fixes:

#### Error: "Cannot find module"
**Fix**: Missing dependencies
```bash
# Make sure all packages are in package.json
cd backend
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

#### Error: "ENOENT: no such file or directory"
**Fix**: Root directory not set
- Set Root Directory to `backend` (see Solution 1)

#### Error: "npm ERR! missing script: start"
**Fix**: Check package.json has start script
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

#### Error: "Port already in use"
**Fix**: Don't set PORT in code, let Railway set it
```javascript
// Good ✅
const PORT = process.env.PORT || 3000;

// Bad ❌
const PORT = 3000;
```

#### Error: "MongoDB connection failed"
**Fix**: Check MONGODB_URI is correct in variables

---

## ✅ Solution 4: Verify package.json

Your backend `package.json` should have:

```json
{
  "name": "universal-tracker-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "firebase-admin": "^12.0.0",
    "mongoose": "^9.9.1",
    "node-cron": "^4.6.0"
  }
}
```

**Check**:
- ✅ `"type": "module"` exists
- ✅ `"start": "node server.js"` in scripts
- ✅ All dependencies listed

---

## ✅ Solution 5: Use Railway Template (Alternative)

If still failing, try this approach:

### Create a new service with correct settings:

1. Delete the failed service
2. Create **New Service**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. **BEFORE deploying**, configure:
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Build Command: `npm install`
6. Add environment variables
7. Deploy!

---

## 📋 Complete Setup Checklist

Before deploying to Railway:

### Local Setup:
- [x] `backend/package.json` has `"type": "module"` ✅
- [x] `backend/package.json` has `"start": "node server.js"` ✅
- [x] All dependencies installed (`npm install` works) ✅
- [x] Server starts locally (`npm start` works) ✅
- [x] MongoDB connection string ready ✅
- [x] All API keys ready ✅

### Railway Setup:
- [ ] GitHub repository pushed
- [ ] Railway project created
- [ ] Root Directory set to `backend`
- [ ] All environment variables added
- [ ] Deployment triggered
- [ ] Build succeeded (green checkmark)
- [ ] Service running

---

## 🔍 Debugging Steps

### Step 1: Check Railway Service Settings
```
Settings → Root Directory: backend ✅
Settings → Start Command: (empty or npm start) ✅
```

### Step 2: Check Variables Tab
```
Should have 7+ variables:
- PORT
- MONGODB_URI
- GOLD_API_KEY
- GOLD_API_URL
- SCRAPER_API_KEY
- SCRAPER_API_URL
- OPENWEBNINJA_API_KEY
- OPENWEBNINJA_API_URL
```

### Step 3: Check Deployment Logs
Look for these success messages:
```
✓ Installing dependencies
✓ Starting server
✓ MongoDB connected successfully
✓ Backend server running on http://0.0.0.0:XXXX
```

### Step 4: Test the Deployed Backend
```bash
# Replace with your Railway URL
curl https://your-app.up.railway.app/api/gold/current-price

# Should return JSON with gold price
```

---

## 🚨 Emergency: Deploy with Render Instead

If Railway keeps failing, use Render as alternative:

### Render Deployment:
1. Go to: https://render.com/
2. Sign up with GitHub
3. **New** → **Web Service**
4. Connect GitHub repo
5. Settings:
   - Name: universal-tracker-backend
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
6. Add environment variables
7. **Create Web Service**

Render is more forgiving with build configurations!

---

## 📞 What Error Are You Seeing?

To help you better, tell me:

1. **What does the error say?** (from Railway deployment logs)
2. **Screenshot of the error** (if possible)
3. **Have you set Root Directory to `backend`?**

Common error messages:
- "Cannot find module" → Missing dependencies
- "ENOENT" → Root directory issue
- "Port in use" → Config issue
- "MongoDB connection failed" → Env var issue
- "npm ERR! missing script" → package.json issue

---

## ✅ Quick Fix Workflow

1. **Set Root Directory**: `backend`
2. **Add Environment Variables**: All 7+
3. **Check package.json**: Has `start` script
4. **Redeploy**: Trigger new deployment
5. **Check Logs**: Look for specific error
6. **Fix Error**: Based on log message
7. **Redeploy Again**: Until green checkmark!

---

## 🎯 Expected Success

When it works, you'll see:

### In Railway Logs:
```
Starting...
✓ Installing dependencies
✓ Building application
✓ Starting server
⏰ Automated price checking enabled
🚀 Backend server running on http://0.0.0.0:3000
📦 Database:
   MongoDB: ✅ Configured
🔑 APIs:
   Gold API: ✅ Configured
   ScraperAPI (Primary): ✅ Configured
✅ MongoDB connected successfully
```

### Service Status:
- Green "Active" badge
- URL accessible
- No errors in logs

---

## 💡 Pro Tips

1. **Always set Root Directory first** - #1 cause of failures
2. **Add env vars before deploying** - Prevents multiple redeploys
3. **Test locally first** - `npm start` should work
4. **Check logs immediately** - Don't guess the error
5. **One fix at a time** - Easier to track what worked

---

## 📚 Alternative: Deploy Backend Folder Separately

If you can't get it working with the monorepo structure:

### Option: Create Separate Backend Repo

```bash
# Create new repo just for backend
cd backend
git init
git add .
git commit -m "Backend only"
# Push to new GitHub repo

# Deploy this repo to Railway
# No need to set Root Directory!
```

This eliminates the Root Directory issue completely.

---

## ✅ Next Steps After Backend Works

1. ✅ Backend deployed successfully
2. ✅ Get backend URL from Railway
3. ✅ Update frontend `.env.production` with backend URL
4. ✅ Rebuild frontend: `npm run build`
5. ✅ Deploy frontend to Netlify
6. ✅ Test full app
7. ✅ Share with manager!

---

## 🆘 Still Stuck?

Tell me:
1. The exact error message from Railway logs
2. Have you set Root Directory to `backend`?
3. Are environment variables added?

I'll help you fix it! 🚀

---

## 📝 Quick Reference

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Start Command | `npm start` |
| Build Command | `npm install` |
| Node Version | (auto-detected) |
| Environment Variables | 7+ variables |

**Most common fix**: Set Root Directory to `backend`! ✅
