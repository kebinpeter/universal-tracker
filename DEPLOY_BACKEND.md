# 🚀 Backend Deployment Guide

Your backend needs to be deployed to a Node.js hosting service. Here are the best FREE options:

---

## Option 1: Railway.app (RECOMMENDED ⭐)

### Why Railway?
- ✅ **FREE** tier: 500 hours/month
- ✅ **Easy setup**: Connect GitHub and deploy
- ✅ **Auto-deploys**: Pushes auto-deploy
- ✅ **Environment vars**: Easy to manage
- ✅ **MongoDB support**: Works perfectly

### Step-by-Step:

#### 1. Create Railway Account
1. Go to: **https://railway.app/**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended)

#### 2. Deploy Your Backend

**Option A: Deploy from GitHub** (RECOMMENDED)
1. Push your code to GitHub first:
   ```bash
   cd "c:\Users\KEBIN PETER T\Desktop\universal 2"
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/universal-tracker.git
   git push -u origin main
   ```

2. In Railway:
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your **universal-tracker** repo
   - Railway will auto-detect it's a Node.js app

**Option B: Deploy from Local** (If no GitHub)
1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
2. Login:
   ```bash
   railway login
   ```
3. Deploy backend:
   ```bash
   cd backend
   railway init
   railway up
   ```

#### 3. Configure Environment Variables

In Railway Dashboard:
1. Click your project
2. Go to **"Variables"** tab
3. Add these variables:

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

#### 4. Get Your Backend URL

After deployment:
1. Railway will show your app URL
2. It looks like: `https://your-app-name.up.railway.app`
3. **COPY THIS URL** - you'll need it for frontend!

#### 5. Test Your Backend

```bash
curl https://your-app-name.up.railway.app/api/gold/current-price
```

Should return gold price data!

---

## Option 2: Render.com (Alternative)

### Why Render?
- ✅ FREE tier available
- ✅ Auto SSL certificates
- ✅ Easy GitHub integration
- ✅ Good performance

### Step-by-Step:

#### 1. Create Render Account
1. Go to: **https://render.com/**
2. Sign up with GitHub

#### 2. Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo (or deploy from Git)
3. Configure:
   - **Name**: universal-tracker-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### 3. Add Environment Variables
In Render dashboard, add same environment variables as Railway (see above)

#### 4. Deploy
Click **"Create Web Service"** - Render will deploy automatically!

Your backend URL: `https://universal-tracker-backend.onrender.com`

---

## Option 3: Vercel (Serverless)

### Why Vercel?
- ✅ Instant deployment
- ✅ Serverless functions
- ✅ Great for Next.js/Node

### Note:
Vercel is serverless, so you'll need to convert your Express app to serverless functions. Railway/Render are easier!

---

## 🔧 Backend Configuration File

Create this file in your backend folder:

**File: `backend/railway.json`** (or `render.yaml`)

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 📝 Checklist Before Deployment

- [ ] Backend code is ready (✅ Already done!)
- [ ] package.json has correct scripts (✅ Already done!)
- [ ] Environment variables documented (✅ Done!)
- [ ] MongoDB connection string ready (✅ Done!)
- [ ] API keys ready (✅ Done!)
- [ ] Choose hosting: Railway/Render/Vercel
- [ ] Create account on chosen platform
- [ ] Deploy backend
- [ ] Add environment variables
- [ ] Get backend URL
- [ ] Test API endpoints
- [ ] Update frontend with backend URL

---

## ⚡ Quick Deploy Commands

### If using Railway CLI:
```bash
# From backend folder
cd backend
railway login
railway init
railway up
railway open  # Opens dashboard to get URL
```

### If using Git + Railway/Render:
```bash
# From project root
git init
git add .
git commit -m "Ready for deployment"
# Push to GitHub, then connect on Railway/Render
```

---

## 🌐 CORS Configuration

Your backend already has CORS enabled for all origins:
```javascript
app.use(cors());
```

For production, you might want to restrict to your Netlify domain:
```javascript
app.use(cors({
  origin: 'https://your-app.netlify.app'
}));
```

But leave it as-is for now (works fine!).

---

## 🔍 Testing Deployed Backend

After deployment, test these endpoints:

```bash
# Replace YOUR_BACKEND_URL with actual URL

# 1. Health check
curl https://YOUR_BACKEND_URL/

# 2. Gold price
curl https://YOUR_BACKEND_URL/api/gold/current-price

# 3. Notifications (requires auth, but tests endpoint)
curl https://YOUR_BACKEND_URL/api/notifications
```

---

## 💡 Pro Tips

1. **Free Tier Limits**:
   - Railway: 500 hours/month (enough for 24/7)
   - Render: Sleeps after 15 mins inactivity (wakes on request)
   - Vercel: Serverless (no sleep, but cold starts)

2. **Keep Backend Awake** (Render):
   If using Render free tier, use a service like:
   - UptimeRobot (https://uptimerobot.com/)
   - Ping your backend every 10 mins

3. **Monitor Usage**:
   - Check Railway/Render dashboard regularly
   - Monitor MongoDB usage
   - Watch API quota (Gold API, ScraperAPI)

4. **Logs**:
   - Railway/Render show real-time logs
   - Check for errors after deployment
   - Monitor API failures

---

## ❓ Troubleshooting

### "Cannot connect to MongoDB"
- Check MONGODB_URI is correct in env vars
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB user has correct permissions

### "API keys not working"
- Verify all env vars are set correctly
- Check no extra spaces in keys
- Restart deployment after adding vars

### "App won't start"
- Check logs in Railway/Render dashboard
- Verify `npm start` works locally
- Check PORT is set correctly (Railway auto-assigns)

### "502 Bad Gateway"
- App might be starting up (wait 30 seconds)
- Check logs for errors
- Verify build succeeded

---

## 📞 Next Steps

After deploying backend:

1. ✅ Copy your backend URL
2. ✅ Update frontend `.env.production`:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   ```
3. ✅ Rebuild frontend: `npm run build`
4. ✅ Deploy frontend to Netlify
5. ✅ Test the full app!

---

## 🎯 Summary

**Best Choice**: Railway.app
- Easiest setup
- Most reliable free tier
- Best for your use case

**Process**:
1. Sign up on Railway
2. Deploy from GitHub or CLI
3. Add environment variables
4. Get backend URL
5. Update frontend
6. Done! 🎉

Ready to deploy? Let's do it! 🚀
