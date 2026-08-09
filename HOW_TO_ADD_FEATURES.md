# 🚀 How to Add New Features to Universal Tracker

## 📚 Architecture Overview

Your app follows a clean, modular architecture:

```
Frontend (React)
├── src/pages/          → Page components (views)
├── src/components/     → Reusable UI components
├── src/hooks/          → Custom React hooks (API logic)
├── src/context/        → Global state management
├── src/api/            → API configuration
└── src/utils/          → Helper functions

Backend (Node.js/Express)
├── backend/server.js   → API endpoints
├── backend/models/     → Database schemas
└── backend/.env        → Configuration
```

---

## ✅ How to Add a New Feature (Step-by-Step)

### Example: Let's Add a "Cryptocurrency Tracker"

---

## 🎯 Step 1: Create Database Model

**File:** `backend/models/CryptoAlert.js`

```javascript
import mongoose from 'mongoose';

const cryptoAlertSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true,
  },
  cryptocurrency: { 
    type: String, 
    required: true  // e.g., "bitcoin", "ethereum"
  },
  targetPrice: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['above', 'below'], 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model('CryptoAlert', cryptoAlertSchema);
```

---

## 🎯 Step 2: Add Backend API Endpoints

**In:** `backend/server.js`

```javascript
import CryptoAlert from './models/CryptoAlert.js';

// Get current crypto prices (using CoinGecko API - FREE)
app.get('/api/crypto/current-price', async (req, res) => {
  try {
    const { coin } = req.query; // bitcoin, ethereum, etc.
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: coin,
          vs_currencies: 'inr',
          include_24hr_change: true,
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Crypto price error:', error.message);
    res.status(500).json({ error: 'Failed to fetch crypto price' });
  }
});

// Get user's crypto alerts
app.get('/api/crypto/alerts', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const alerts = await CryptoAlert.find({ userId, isActive: true });
    res.json(alerts);
  } catch (error) {
    console.error('Get crypto alerts error:', error.message);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// Create crypto alert
app.post('/api/crypto/set-alert', async (req, res) => {
  try {
    const { cryptocurrency, targetPrice, type } = req.body;
    const userId = req.body.userId || 'default-user';
    
    const alert = new CryptoAlert({
      userId,
      cryptocurrency,
      targetPrice: parseFloat(targetPrice),
      type,
    });

    await alert.save();
    res.json(alert);
  } catch (error) {
    console.error('Set crypto alert error:', error.message);
    res.status(500).json({ error: 'Failed to set alert' });
  }
});

// Delete crypto alert
app.delete('/api/crypto/alerts/:id', async (req, res) => {
  try {
    await CryptoAlert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete crypto alert error:', error.message);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});
```

---

## 🎯 Step 3: Create Frontend Hook

**File:** `src/hooks/useCrypto.js`

```javascript
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const useCrypto = () => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch current price
  const fetchPrice = useCallback(async (coin = 'bitcoin') => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/crypto/current-price', {
        params: { coin }
      });
      setCurrentPrice(response.data[coin]);
    } catch (error) {
      console.error('Fetch price error:', error);
      toast.error('Failed to fetch crypto price');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/crypto/alerts', {
        params: { userId: 'default-user' }
      });
      setAlerts(response.data);
    } catch (error) {
      console.error('Fetch alerts error:', error);
    }
  }, []);

  // Create alert
  const createAlert = useCallback(async (cryptocurrency, targetPrice, type) => {
    try {
      setLoading(true);
      await axiosInstance.post('/api/crypto/set-alert', {
        cryptocurrency,
        targetPrice,
        type,
        userId: 'default-user'
      });
      toast.success('Alert created!');
      await fetchAlerts();
    } catch (error) {
      console.error('Create alert error:', error);
      toast.error('Failed to create alert');
    } finally {
      setLoading(false);
    }
  }, [fetchAlerts]);

  // Delete alert
  const deleteAlert = useCallback(async (alertId) => {
    try {
      await axiosInstance.delete(`/api/crypto/alerts/${alertId}`);
      toast.success('Alert deleted');
      setAlerts(prev => prev.filter(a => a._id !== alertId));
    } catch (error) {
      console.error('Delete alert error:', error);
      toast.error('Failed to delete alert');
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    fetchAlerts();
  }, [fetchPrice, fetchAlerts]);

  return {
    currentPrice,
    alerts,
    loading,
    fetchPrice,
    createAlert,
    deleteAlert,
  };
};

export default useCrypto;
```

---

## 🎯 Step 4: Create Page Component

**File:** `src/pages/CryptoTracker.jsx`

```javascript
import { useState } from 'react';
import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';
import useCrypto from '../hooks/useCrypto';
import TrackerCard from '../components/shared/TrackerCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const CryptoTracker = () => {
  const { currentPrice, alerts, loading, createAlert, deleteAlert } = useCrypto();
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [targetPrice, setTargetPrice] = useState('');
  const [alertType, setAlertType] = useState('below');

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    await createAlert(selectedCoin, targetPrice, alertType);
    setTargetPrice('');
  };

  if (loading && !currentPrice) {
    return <LoadingSpinner size="large" text="Loading crypto data..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Cryptocurrency Tracker
      </h1>

      {/* Current Price Card */}
      <TrackerCard>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
            <Bitcoin className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Bitcoin Price
            </h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {currentPrice ? formatCurrency(currentPrice.inr) : '...'}
            </p>
            {currentPrice && (
              <div className="flex items-center space-x-1 mt-1">
                {currentPrice.inr_24h_change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                )}
                <span className={currentPrice.inr_24h_change >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {currentPrice.inr_24h_change?.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </TrackerCard>

      {/* Create Alert Form */}
      <TrackerCard>
        <h2 className="text-lg font-semibold mb-4">Set Price Alert</h2>
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cryptocurrency</label>
            <select 
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
            >
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="cardano">Cardano</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Price (₹)</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
              placeholder="5000000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alert When</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700"
            >
              <option value="below">Price goes below target</option>
              <option value="above">Price goes above target</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Alert
          </button>
        </form>
      </TrackerCard>

      {/* Alerts List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>
        {alerts.length === 0 ? (
          <TrackerCard>
            <p className="text-slate-600 dark:text-slate-400 text-center">
              No active alerts. Create one above!
            </p>
          </TrackerCard>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <TrackerCard key={alert._id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold capitalize">{alert.cryptocurrency}</h3>
                    <p className="text-sm text-slate-600">
                      Alert when {alert.type} {formatCurrency(alert.targetPrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAlert(alert._id)}
                    className="px-3 py-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </TrackerCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoTracker;
```

---

## 🎯 Step 5: Add Route to App

**In:** `src/App.jsx`

```javascript
import CryptoTracker from './pages/CryptoTracker';

// Inside your Routes:
<Route path="/crypto" element={<CryptoTracker />} />
```

---

## 🎯 Step 6: Add to Sidebar Navigation

**In:** `src/components/layout/Sidebar.jsx`

```javascript
import { Bitcoin } from 'lucide-react';

// Add to navigation array:
const navigation = [
  // ... existing items
  {
    name: 'Crypto Tracker',
    href: '/crypto',
    icon: Bitcoin,
  },
];
```

---

## 🎯 Step 7: Add Cron Job for Automated Checking

**In:** `backend/server.js`

```javascript
// Check crypto prices every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔍 [CRON] Checking crypto prices...');
  
  try {
    const alerts = await CryptoAlert.find({ isActive: true });
    
    for (const alert of alerts) {
      // Get current price
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        {
          params: {
            ids: alert.cryptocurrency,
            vs_currencies: 'inr',
          }
        }
      );
      
      const currentPrice = response.data[alert.cryptocurrency]?.inr;
      
      if (!currentPrice) continue;
      
      let triggered = false;
      
      if (alert.type === 'below' && currentPrice <= alert.targetPrice) {
        triggered = true;
      } else if (alert.type === 'above' && currentPrice >= alert.targetPrice) {
        triggered = true;
      }
      
      if (triggered) {
        await createNotification(
          alert.userId,
          'crypto',
          '₿ Crypto Price Alert!',
          `${alert.cryptocurrency} is now ₹${currentPrice} (Target: ₹${alert.targetPrice})`
        );
        
        alert.isActive = false;
        await alert.save();
        
        console.log(`✅ Crypto alert triggered for ${alert.cryptocurrency}`);
      }
    }
    
    console.log(`✅ [CRON] Checked ${alerts.length} crypto alerts`);
  } catch (error) {
    console.error('[CRON] Crypto check error:', error.message);
  }
});
```

---

## 🎯 Step 8: Add to Dashboard Summary

**In:** `src/pages/Dashboard.jsx`

```javascript
import useCrypto from '../hooks/useCrypto';
import { Bitcoin } from 'lucide-react';

// Inside component:
const { currentPrice } = useCrypto();

// Add to summaryCards array:
{
  title: 'Bitcoin Price',
  value: currentPrice ? formatCurrency(currentPrice.inr) : '...',
  subtitle: currentPrice && (
    <div className="flex items-center space-x-1">
      {currentPrice.inr_24h_change >= 0 ? (
        <TrendingUp className="w-4 h-4 text-emerald-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-rose-500" />
      )}
      <span>{currentPrice.inr_24h_change?.toFixed(2)}%</span>
    </div>
  ),
  icon: Bitcoin,
  iconBg: 'bg-amber-100 dark:bg-amber-900/30',
  iconColor: 'text-amber-600 dark:text-amber-400',
  onClick: () => navigate('/crypto'),
}
```

---

## ✅ That's It! Feature Added!

Now you have a fully functional Cryptocurrency Tracker with:
- ✅ Real-time prices (CoinGecko API - FREE)
- ✅ Price alerts
- ✅ Automated checking (cron job)
- ✅ Notifications
- ✅ Data persistence (MongoDB)
- ✅ Beautiful UI

---

## 🎯 Feature Ideas You Can Add:

### Easy Features (1-2 hours):
1. **Stock Market Tracker** - NSE/BSE stock prices
2. **Weather Alerts** - Location-based weather notifications
3. **News Tracker** - Track keywords in news
4. **Expense Tracker** - Track spending and budgets
5. **Habit Tracker** - Daily habit monitoring

### Medium Features (2-4 hours):
1. **Flight Price Tracker** - Monitor flight prices
2. **Real Estate Tracker** - Property price monitoring
3. **Bill Reminder** - Subscription and bill tracking
4. **Fitness Tracker** - Workout and diet tracking
5. **Task Manager** - Todo lists with notifications

### Advanced Features (1-2 days):
1. **Social Media Monitor** - Track mentions/hashtags
2. **Website Uptime Monitor** - Monitor website status
3. **API Health Monitor** - Track API performance
4. **Portfolio Tracker** - Investment portfolio
5. **Competitor Tracker** - Monitor competitor prices

---

## 📚 APIs You Can Use (FREE):

| Feature | API | Free Tier |
|---------|-----|-----------|
| **Crypto** | CoinGecko | Unlimited |
| **Stocks** | Alpha Vantage | 500 calls/day |
| **Weather** | OpenWeather | 1000 calls/day |
| **News** | NewsAPI | 1000 calls/day |
| **Exchange Rates** | ExchangeRate-API | 1500 calls/month |
| **Movies/TV** | TMDB | 1000 calls/day |
| **Books** | Google Books | Unlimited |
| **Recipe** | Spoonacular | 150 calls/day |

---

## 🚀 Quick Feature Template

Use this as a starting point for any new feature:

```
1. Backend: Create Model (backend/models/YourFeature.js)
2. Backend: Add API endpoints (backend/server.js)
3. Frontend: Create Hook (src/hooks/useYourFeature.js)
4. Frontend: Create Page (src/pages/YourFeaturePage.jsx)
5. Frontend: Add Route (src/App.jsx)
6. Frontend: Add to Sidebar (src/components/layout/Sidebar.jsx)
7. Backend: Add Cron Job (optional, for automation)
8. Frontend: Add to Dashboard (optional)
```

---

## 💡 Need Help Adding a Feature?

Just tell me:
1. What feature you want to add
2. What data you want to track
3. What alerts/notifications you need

I'll help you implement it step-by-step! 🚀

---

## ✅ Your App is Extensible!

The modular architecture makes it easy to add unlimited features. Each feature follows the same pattern, so once you understand it, you can add anything! 🎉
