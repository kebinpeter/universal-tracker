# ⚡ Universal Tracker - Quick Start

## 🚀 What You Have Now

✅ **Database** - MongoDB (data never lost)  
✅ **Auto-checking** - Prices checked every hour  
✅ **Notifications** - Real-time push alerts  
✅ **Real APIs** - Gold prices + Product scraping  

---

## 🔧 Setup (5 Minutes)

### Step 1: MongoDB (Required)

1. Go to: **https://mongodb.com/cloud/atlas/register**
2. Create **FREE** account
3. Create cluster (takes 3-5 min)
4. Get connection string
5. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/universal-tracker
   ```
6. Restart backend: `cd backend && npm start`

**Must see:** `✅ MongoDB connected successfully`

---

### Step 2: Firebase Push (Optional)

1. Go to: **https://console.firebase.google.com**
2. Project settings → Cloud Messaging → Generate key pair
3. Copy VAPID key
4. Update `.env`:
   ```env
   VITE_FIREBASE_VAPID_KEY=your-key-here
   ```
5. Restart frontend: `npm run dev`

---

## 🧪 Test It Works

### Test 1: Database Persistence
```bash
# Add product → Stop server → Restart → Product still there ✅
```

### Test 2: Auto Price Checking
```bash
# Manual trigger:
curl -X POST http://localhost:3000/api/cron/check-prices

# Automatic: Runs every hour at :00
```

### Test 3: Notifications
```bash
# Enable notifications in Dashboard → Add product → Trigger check → See notification ✅
```

---

## 📊 Current Status

| Feature | Status | Details |
|---------|--------|---------|
| **Frontend** | ✅ Running | http://localhost:5174 |
| **Backend** | ✅ Running | http://localhost:3000 |
| **MongoDB** | ⚠️ Needs setup | 5 min - See SETUP_GUIDE.md |
| **Gold API** | ✅ Working | Real prices |
| **Product Scraping** | ✅ Working | ScraperAPI |
| **Firebase Auth** | ✅ Working | Login/signup |
| **Push Notifications** | ⚠️ Needs VAPID | 2 min - Optional |
| **Cron Jobs** | ✅ Running | Every hour |

---

## 🎯 How It Works

```
1. User adds product → Saved to MongoDB
2. Cron job checks price every hour
3. If price ≤ target → Create notification
4. User gets push notification + toast
5. Click notification → Opens tracker page
```

---

## 📝 Key Commands

### Start Servers:
```bash
# Frontend
npm run dev

# Backend
cd backend && npm start
```

### Test Cron Job:
```bash
curl -X POST http://localhost:3000/api/cron/check-prices
```

### Check Backend Status:
```bash
# Should see:
# ✅ MongoDB connected successfully
# ⏰ Automated price checking enabled (runs every hour)
```

---

## 🆘 Quick Troubleshooting

**MongoDB not connecting?**
- Check connection string in `backend/.env`
- Verify password is correct
- Check IP whitelist (allow 0.0.0.0/0)

**Notifications not working?**
- Check VAPID key in `.env`
- Allow browser notifications
- Test in Chrome/Edge

**Prices not updating?**
- Wait for cron job (runs every hour)
- Or trigger manually with curl command above

---

## 📚 Full Documentation

- **SETUP_GUIDE.md** - Complete setup instructions
- **IMPLEMENTATION_GUIDE.md** - Technical implementation details
- **API_SETUP_COMPLETE.md** - API keys reference

---

## 🎉 Next Steps

1. ✅ Set up MongoDB (5 min) - **Required**
2. ⚡ Test automated price checking
3. 🔔 Enable push notifications (optional)
4. 🌍 Deploy to production (optional)

**Ready to track prices!** 🚀
