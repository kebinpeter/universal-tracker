# 🔑 How to Get Working API Keys

Your current API keys are not working. Let's get fresh ones!

---

## 1. 🪙 Gold API (Free Alternative)

### **Option A: Metals-API.com** (RECOMMENDED - FREE)
1. Visit: https://metals-api.com/
2. Click "Get Free API Key"
3. Sign up with your email
4. Free plan: 50 requests/month
5. Copy your API key

**Update in backend/.env**:
```env
GOLD_API_KEY=your-metals-api-key-here
GOLD_API_URL=https://metals-api.com/api
```

### **Option B: GoldAPI.io** (Alternative)
1. Visit: https://www.goldapi.io/
2. Sign up for free account
3. Get API key from dashboard
4. Free: 100 requests/month

**Update in backend/.env**:
```env
GOLD_API_KEY=your-goldapi-key-here
GOLD_API_URL=https://www.goldapi.io/api
```

### **Option C: Use Mock Data** (Already Working!)
Your app already has realistic mock data that works perfectly. You can keep using it!

---

## 2. 🌐 ScraperAPI (For Product Tracking)

### **Get Free ScraperAPI Key**:
1. Visit: https://www.scraperapi.com/
2. Click "Start Free Trial"
3. Sign up with email
4. Free plan: 5,000 requests/month
5. Get your API key from dashboard

**Update in backend/.env**:
```env
SCRAPER_API_KEY=your-new-scraperapi-key
SCRAPER_API_URL=https://api.scraperapi.com
```

### **Alternative: ScrapingBee**
1. Visit: https://www.scrapingbee.com/
2. Free: 1,000 requests
3. Sign up and get API key

---

## 3. 📊 Stock Market API (For Stocks Tracker)

### **Alpha Vantage** (RECOMMENDED - FREE)
1. Visit: https://www.alphavantage.co/
2. Click "Get Your Free API Key Today"
3. Fill simple form
4. Free: 25 requests/day
5. Copy your API key

**Add to backend/.env**:
```env
STOCK_API_KEY=your-alphavantage-key
STOCK_API_URL=https://www.alphavantage.co/query
```

### **Alternative: Finnhub**
1. Visit: https://finnhub.io/
2. Sign up free
3. 60 API calls/minute free

---

## 4. 💼 Job Search API

### **Adzuna API** (FREE)
1. Visit: https://developer.adzuna.com/
2. Sign up for free
3. Get App ID and API Key
4. Free: No limits

**Add to backend/.env**:
```env
JOB_API_ID=your-app-id
JOB_API_KEY=your-adzuna-key
JOB_API_URL=https://api.adzuna.com/v1/api/jobs
```

### **Alternative: Indeed API**
Contact Indeed for API access (business accounts)

---

## 5. 🔔 Keep Firebase (Already Working!)

Your Firebase is configured correctly:
```env
VITE_FIREBASE_API_KEY=AIzaSyCx6VT1dGrXWIJir-yq_nfAm8pq5806Do0
VITE_FIREBASE_VAPID_KEY=BMa0RjGvFgvhscAgJmG_LR3bpL5Uf2QZCKbcy_oXknKMJJ6R0EUcfH97EeQ-Lt10MzmqRyqXVtpNyrRAWFO37y8
```
✅ No changes needed!

---

## 🚀 Quick Setup (Copy-Paste Ready)

### **Step 1: Get These Free APIs** (5 minutes each)

1. **Metals-API.com** → Gold prices
2. **ScraperAPI.com** → Product scraping
3. **Alpha Vantage** → Stock data
4. **Adzuna** → Job listings

### **Step 2: Update backend/.env**

```env
PORT=3000

# MongoDB (Already Working ✅)
MONGODB_URI=mongodb+srv://kebinpeter45_db_user:9MXsurGzFK6iFZGc@cluster0.fzslwed.mongodb.net/universal-tracker?retryWrites=true&w=majority

# Gold API (Get from metals-api.com)
GOLD_API_KEY=YOUR_NEW_METALS_API_KEY_HERE
GOLD_API_URL=https://metals-api.com/api

# ScraperAPI (Get from scraperapi.com)
SCRAPER_API_KEY=YOUR_NEW_SCRAPER_API_KEY_HERE
SCRAPER_API_URL=https://api.scraperapi.com

# Stock API (Get from alphavantage.co)
STOCK_API_KEY=YOUR_ALPHA_VANTAGE_KEY_HERE
STOCK_API_URL=https://www.alphavantage.co/query

# Job API (Get from developer.adzuna.com)
JOB_API_ID=YOUR_ADZUNA_APP_ID_HERE
JOB_API_KEY=YOUR_ADZUNA_KEY_HERE
JOB_API_URL=https://api.adzuna.com/v1/api/jobs
```

### **Step 3: Restart Backend**
```bash
cd backend
npm start
```

---

## 📝 Current Status

### **Working Now** ✅:
- MongoDB ✅
- Firebase ✅
- Mock gold data ✅
- All backend endpoints ✅
- Frontend ✅

### **Need API Keys**:
- Gold prices (optional - mock works)
- Product scraping (for real prices)
- Stock data (for stocks page)
- Job listings (for job search)

---

## 🎯 Recommended Priority

### **Priority 1: ScraperAPI** 
For Product Tracker to scrape real prices
→ https://www.scraperapi.com/

### **Priority 2: Metals-API**
For real gold prices (or keep using mock)
→ https://metals-api.com/

### **Priority 3: Alpha Vantage**
For stock market data
→ https://www.alphavantage.co/

### **Priority 4: Adzuna**
For job search functionality
→ https://developer.adzuna.com/

---

## 💡 Pro Tips

### **1. Rate Limits**
Free APIs have limits:
- Metals-API: 50 requests/month
- ScraperAPI: 5,000 requests/month
- Alpha Vantage: 25 requests/day
- Adzuna: Unlimited

### **2. Save Your Keys**
Keep a copy of your API keys in a safe place!

### **3. Test After Adding**
After adding each key:
1. Restart backend
2. Test the feature
3. Check backend logs

### **4. Don't Share Keys**
Never commit .env files to Git!

---

## 🔧 Testing Your New Keys

### **Test Gold API**:
```bash
curl http://localhost:3000/api/gold/current-price
```

Should show real data (not "mock: true")

### **Test Product Scraping**:
Try adding a product from Amazon/Flipkart

### **Check Backend Logs**:
Look for success messages instead of 403 errors

---

## ❓ FAQ

### **Q: Do I need to pay?**
A: No! All recommended APIs have free tiers that work perfectly for your app.

### **Q: What if I don't want to sign up?**
A: Your app works with mock data! It's already functional.

### **Q: How long does signup take?**
A: 2-5 minutes per API. Total: ~20 minutes for all 4.

### **Q: Will my old keys ever work?**
A: Unlikely. They may be expired, rate-limited, or invalid.

### **Q: Can I use different APIs?**
A: Yes! Just update the server.js code to match the new API format.

---

## 🎉 Next Steps

1. **Choose**: Decide which APIs you want
2. **Sign Up**: Get your free API keys (20 mins)
3. **Update**: Paste keys into backend/.env
4. **Restart**: Restart backend server
5. **Test**: Try each feature
6. **Enjoy**: Real data in your app!

---

## 📞 Quick Links

- **Metals-API**: https://metals-api.com/
- **ScraperAPI**: https://www.scraperapi.com/
- **Alpha Vantage**: https://www.alphavantage.co/
- **Adzuna**: https://developer.adzuna.com/
- **GoldAPI**: https://www.goldapi.io/
- **ScrapingBee**: https://www.scrapingbee.com/
- **Finnhub**: https://finnhub.io/

---

## ✅ Remember

**Your app works NOW with mock data!**

Getting real API keys is optional but recommended for production use. The mock data is realistic enough for development and testing.

**Good luck!** 🚀
