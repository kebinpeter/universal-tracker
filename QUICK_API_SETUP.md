# ⚡ Quick API Setup Guide (5 Minutes)

## 🎯 Goal
Get your Universal Tracker working with REAL data in 5 minutes!

---

## 🚀 Option 1: Fast Track (Recommended)

### **Just Get ScraperAPI** (Most Important)

This single API will make your Product Tracker work with real prices!

#### **Step-by-Step**:

1. **Open Browser** → https://www.scraperapi.com/

2. **Click** → "Start Free Trial" (big blue button)

3. **Fill Form**:
   - Email: your@email.com
   - Password: (create one)
   - Click "Sign Up"

4. **Verify Email** → Check inbox, click verification link

5. **Dashboard** → You'll see your API key like:
   ```
   abc123def456ghi789jkl012mno345pqr678
   ```

6. **Copy API Key**

7. **Open File**: `backend/.env`

8. **Replace Line**:
   ```env
   # OLD (not working)
   SCRAPER_API_KEY=d96dd72231c0fdb4f930260dd19a2cf2
   
   # NEW (paste your key)
   SCRAPER_API_KEY=abc123def456ghi789jkl012mno345pqr678
   ```

9. **Save File**

10. **Restart Backend**:
    ```bash
    # Stop backend (Ctrl+C)
    # Start again
    cd backend
    npm start
    ```

11. **Test**: Try adding a product from Amazon!

**Done!** 🎉 Your Product Tracker now scrapes real prices!

---

## 🪙 Option 2: Get Gold API (Optional)

Your app already shows gold prices with mock data. But if you want REAL prices:

### **Metals-API (FREE - Easiest)**

1. Go to: https://metals-api.com/
2. Click "Get Free API Key"
3. Fill form (name, email)
4. Get key from email
5. Update backend/.env:
   ```env
   GOLD_API_KEY=your_metals_api_key_here
   GOLD_API_URL=https://metals-api.com/api
   ```
6. Restart backend

**That's it!** Real gold prices now! 📈

---

## 📋 Option 3: Full Setup (All APIs)

If you want ALL features with real data:

### **Checklist** ☑️

#### 1. **ScraperAPI** (Product prices)
- [ ] Sign up at scraperapi.com
- [ ] Get API key
- [ ] Update SCRAPER_API_KEY in .env
- [ ] Restart backend
- [ ] Test: Add a product

#### 2. **Metals-API** (Gold prices)
- [ ] Sign up at metals-api.com
- [ ] Get API key
- [ ] Update GOLD_API_KEY in .env
- [ ] Restart backend
- [ ] Test: Visit Gold Tracker

#### 3. **Alpha Vantage** (Stocks)
- [ ] Sign up at alphavantage.co
- [ ] Get API key
- [ ] Add STOCK_API_KEY to .env
- [ ] Restart backend
- [ ] Test: Track a stock

#### 4. **Adzuna** (Jobs)
- [ ] Sign up at developer.adzuna.com
- [ ] Get App ID and API Key
- [ ] Add JOB_API_ID and JOB_API_KEY to .env
- [ ] Restart backend
- [ ] Test: Search jobs

---

## 🎨 Visual Guide

```
┌─────────────────────────────────────┐
│  Step 1: Visit API Website         │
│  (e.g., scraperapi.com)            │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 2: Click "Get Free API Key"  │
│  or "Sign Up"                       │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 3: Fill Registration Form     │
│  (Name, Email, Password)            │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 4: Verify Email               │
│  (Check inbox)                      │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 5: Copy API Key               │
│  (From dashboard)                   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 6: Open backend/.env          │
│  (In your project)                  │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 7: Paste API Key              │
│  (Replace old key)                  │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 8: Save .env File             │
│  (Ctrl+S)                           │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 9: Restart Backend            │
│  (npm start)                        │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Step 10: Test Feature! ✅          │
│  (Working now!)                     │
└─────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### **Problem: Still seeing 403 errors**
**Solution**: 
1. Check you copied the FULL API key
2. Check no extra spaces in .env file
3. Make sure you restarted backend

### **Problem: Can't find API key on website**
**Solution**:
1. Look for "Dashboard" or "API Keys" link
2. Sometimes under "Settings" or "Account"
3. Try logging out and back in

### **Problem: Backend won't restart**
**Solution**:
1. Stop it completely (Ctrl+C)
2. Close terminal
3. Open new terminal
4. cd backend
5. npm start

### **Problem: .env file not updating**
**Solution**:
1. Make sure you're editing backend/.env (not root .env)
2. Save the file (Ctrl+S)
3. Check file has no .txt extension

---

## ✅ Verification Steps

After adding each API key:

### **1. Check Backend Logs**
Look for:
```
✅ API_NAME: Configured
```

Instead of:
```
❌ API_NAME Error: 403
```

### **2. Test the Feature**
- **ScraperAPI**: Add product → See real price
- **Metals-API**: Gold Tracker → See real gold price (no "mock: true")
- **Alpha Vantage**: Stocks → See real stock price
- **Adzuna**: Jobs → See real job listings

### **3. Check Response**
```bash
# Test gold API
curl http://localhost:3000/api/gold/current-price

# Should NOT have "mock: true" in response
```

---

## 📱 My Recommendation

### **For Development/Testing**:
✅ Keep using mock data (already working!)
- No signup needed
- No rate limits
- Instant response
- Realistic data

### **For Production/Real Use**:
✅ Get ScraperAPI first (most important)
✅ Then Metals-API (if you want real gold)
⚪ Others optional based on needs

---

## ⏱️ Time Estimates

- **ScraperAPI**: 5 minutes
- **Metals-API**: 5 minutes
- **Alpha Vantage**: 3 minutes
- **Adzuna**: 5 minutes

**Total**: ~20 minutes for all APIs

---

## 🎁 Bonus: Testing Without APIs

Want to test right now without any APIs?

**Your app ALREADY WORKS!**

1. Visit: http://localhost:5174
2. Login/Signup
3. Go to Dashboard
4. Try Gold Tracker → Mock data works!
5. Try Product Tracker → Add products!
6. Try Flight Tracker → Fully functional!

Everything works with mock/simulated data. Getting real APIs just makes it more accurate!

---

## 🚀 Start Now!

**Choose your path**:

### **Path A: Quick Start** (0 minutes)
→ Use app as-is with mock data
→ Everything works!

### **Path B: One API** (5 minutes)
→ Get ScraperAPI
→ Product Tracker with real prices

### **Path C: Full Setup** (20 minutes)
→ Get all 4 APIs
→ 100% real data everywhere

**Up to you!** 😊

---

## 📞 Need Help?

If stuck:
1. Check GET_NEW_API_KEYS.md (detailed guide)
2. Check SYSTEM_STATUS_REPORT.md (current status)
3. Check backend logs for specific errors

**Remember**: Your app works NOW! APIs just make it better! ✨
