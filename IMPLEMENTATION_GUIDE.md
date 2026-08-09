# 🚀 Implementation Guide - Critical Features

## Problems to Solve:
1. ❌ Data is lost when server restarts (in-memory storage)
2. ❌ No real-time notifications
3. ❌ No automated price checking

---

## ✅ SOLUTION 1: Add Database (MongoDB) - Fix Data Loss

### Why MongoDB?
- **Free forever** (MongoDB Atlas free tier)
- **No installation** needed (cloud-based)
- **Easy to use** with JavaScript
- **5-minute setup**

### Step-by-Step Implementation:

#### Step 1: Create MongoDB Account (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose **FREE** tier (M0)
4. Select cloud provider: **AWS** or **Google Cloud**
5. Choose region closest to you: **Mumbai** or **Singapore**
6. Cluster name: `universal-tracker`
7. Click **Create Cluster** (takes 3-5 minutes)

#### Step 2: Get Database Connection String (2 minutes)

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Select: **Node.js** and **5.5 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Save this connection string (you'll need it)

#### Step 3: Install MongoDB Package in Backend

Open terminal in `backend` folder and run:

```bash
cd backend
npm install mongoose
```

#### Step 4: Add Connection String to `.env`

Open `backend/.env` and add:

```env
MONGODB_URI=mongodb+srv://username:yourpassword@cluster.mongodb.net/universal-tracker?retryWrites=true&w=majority
```

(Replace with your actual connection string from Step 2)

#### Step 5: Create Database Models

Create new file: `backend/models/Product.js`

```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  targetPrice: { type: Number, required: true },
  image: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', productSchema);
```

Create new file: `backend/models/GoldAlert.js`

```javascript
import mongoose from 'mongoose';

const goldAlertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  type: { type: String, enum: ['above', 'below'], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('GoldAlert', goldAlertSchema);
```

Create new file: `backend/models/Notification.js`

```javascript
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['gold', 'product', 'job', 'medical'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
```

#### Step 6: Update `server.js` to Connect to MongoDB

Add at the top of `backend/server.js` (after imports):

```javascript
import mongoose from 'mongoose';
import Product from './models/Product.js';
import GoldAlert from './models/GoldAlert.js';
import Notification from './models/Notification.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
```

#### Step 7: Update Product Endpoints to Use MongoDB

Replace the product endpoints in `server.js`:

```javascript
// GET all products for a user
app.get('/api/product/list', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user'; // Get from auth token in production
    const products = await Product.find({ userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// ADD product
app.post('/api/product/add', async (req, res) => {
  try {
    const { url, targetPrice, name } = req.body;
    const userId = req.body.userId || 'default-user'; // Get from auth token in production
    
    // Scrape product data
    const scrapedData = await scrapeProductData(url);
    
    // Save to database
    const product = new Product({
      userId,
      name: name || scrapedData.name,
      url,
      currentPrice: scrapedData.price,
      targetPrice: parseFloat(targetPrice),
      image: scrapedData.image,
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// DELETE product
app.delete('/api/product/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// REFRESH product price
app.post('/api/product/:id/refresh', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const scrapedData = await scrapeProductData(product.url);
    product.currentPrice = scrapedData.price;
    product.lastUpdated = new Date();
    
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Refresh product error:', error);
    res.status(500).json({ error: 'Failed to refresh product price' });
  }
});
```

#### Step 8: Update Gold Alert Endpoints

```javascript
// GET gold alerts
app.get('/api/gold/alerts', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const alerts = await GoldAlert.find({ userId, isActive: true });
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// SET gold alert
app.post('/api/gold/set-alert', async (req, res) => {
  try {
    const { targetPrice, type } = req.body;
    const userId = req.body.userId || 'default-user';
    
    const alert = new GoldAlert({
      userId,
      targetPrice: parseFloat(targetPrice),
      type,
    });

    await alert.save();
    res.json(alert);
  } catch (error) {
    console.error('Set alert error:', error);
    res.status(500).json({ error: 'Failed to set alert' });
  }
});

// DELETE gold alert
app.delete('/api/gold/alert/:id', async (req, res) => {
  try {
    await GoldAlert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});
```

#### Step 9: Test Database Connection

1. Restart your backend server:
   ```bash
   cd backend
   npm start
   ```

2. You should see: `✅ MongoDB connected`

3. Test adding a product:
   - Go to Product Tracker
   - Add a product
   - Restart backend server
   - Refresh page
   - ✅ Product should still be there!

---

## ✅ SOLUTION 2: Add Automated Price Checking

### Why node-cron?
- **Simple** - Easy to set up
- **Reliable** - Runs on schedule
- **Lightweight** - No extra services needed

### Step-by-Step Implementation:

#### Step 1: Install node-cron

```bash
cd backend
npm install node-cron
```

#### Step 2: Add Cron Job for Price Checking

Add to `backend/server.js` (after MongoDB connection):

```javascript
import cron from 'node-cron';

// Create notification helper
async function createNotification(userId, type, title, message) {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
    });
    await notification.save();
    console.log(`📬 Notification created: ${title}`);
  } catch (error) {
    console.error('Create notification error:', error);
  }
}

// Check product prices every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔍 Checking product prices...');
  
  try {
    const products = await Product.find();
    
    for (const product of products) {
      // Re-scrape price
      const scrapedData = await scrapeProductData(product.url);
      const oldPrice = product.currentPrice;
      const newPrice = scrapedData.price;
      
      // Update price
      product.currentPrice = newPrice;
      product.lastUpdated = new Date();
      await product.save();
      
      // Check if price dropped below target
      if (newPrice > 0 && newPrice <= product.targetPrice && oldPrice > product.targetPrice) {
        await createNotification(
          product.userId,
          'product',
          '🎉 Price Drop Alert!',
          `${product.name} is now ₹${newPrice} (Target: ₹${product.targetPrice})`
        );
        console.log(`✅ Price alert triggered for ${product.name}`);
      }
    }
    
    console.log(`✅ Checked ${products.length} products`);
  } catch (error) {
    console.error('Price check error:', error);
  }
});

// Check gold prices every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔍 Checking gold prices...');
  
  try {
    // Get current gold price
    const response = await axios.get(`${GOLD_API_URL}/XAU/USD`, {
      headers: { 'x-access-token': GOLD_API_KEY },
    });
    
    const pricePerOz = response.data.price;
    const pricePerGram = (pricePerOz / TROY_OZ_TO_GRAM) * USD_TO_INR;
    
    // Check all alerts
    const alerts = await GoldAlert.find({ isActive: true });
    
    for (const alert of alerts) {
      let triggered = false;
      
      if (alert.type === 'below' && pricePerGram <= alert.targetPrice) {
        triggered = true;
      } else if (alert.type === 'above' && pricePerGram >= alert.targetPrice) {
        triggered = true;
      }
      
      if (triggered) {
        await createNotification(
          alert.userId,
          'gold',
          '💰 Gold Price Alert!',
          `Gold is now ₹${pricePerGram.toFixed(2)}/gram (Target: ₹${alert.targetPrice})`
        );
        
        // Deactivate alert after triggering
        alert.isActive = false;
        await alert.save();
        
        console.log(`✅ Gold alert triggered for user ${alert.userId}`);
      }
    }
    
    console.log(`✅ Checked ${alerts.length} gold alerts`);
  } catch (error) {
    console.error('Gold check error:', error);
  }
});

console.log('⏰ Automated price checking enabled (runs every hour)');
```

#### Step 3: Add Manual Test Endpoint (for testing without waiting)

Add this endpoint to `server.js`:

```javascript
// Manual trigger for testing
app.post('/api/cron/check-prices', async (req, res) => {
  console.log('🔍 Manual price check triggered...');
  
  try {
    // Check products
    const products = await Product.find();
    let productAlerts = 0;
    
    for (const product of products) {
      const scrapedData = await scrapeProductData(product.url);
      const oldPrice = product.currentPrice;
      const newPrice = scrapedData.price;
      
      product.currentPrice = newPrice;
      product.lastUpdated = new Date();
      await product.save();
      
      if (newPrice > 0 && newPrice <= product.targetPrice && oldPrice > product.targetPrice) {
        await createNotification(
          product.userId,
          'product',
          '🎉 Price Drop Alert!',
          `${product.name} is now ₹${newPrice} (Target: ₹${product.targetPrice})`
        );
        productAlerts++;
      }
    }
    
    // Check gold
    const response = await axios.get(`${GOLD_API_URL}/XAU/USD`, {
      headers: { 'x-access-token': GOLD_API_KEY },
    });
    
    const pricePerGram = (response.data.price / TROY_OZ_TO_GRAM) * USD_TO_INR;
    const alerts = await GoldAlert.find({ isActive: true });
    let goldAlerts = 0;
    
    for (const alert of alerts) {
      let triggered = false;
      
      if (alert.type === 'below' && pricePerGram <= alert.targetPrice) {
        triggered = true;
      } else if (alert.type === 'above' && pricePerGram >= alert.targetPrice) {
        triggered = true;
      }
      
      if (triggered) {
        await createNotification(
          alert.userId,
          'gold',
          '💰 Gold Price Alert!',
          `Gold is now ₹${pricePerGram.toFixed(2)}/gram (Target: ₹${alert.targetPrice})`
        );
        alert.isActive = false;
        await alert.save();
        goldAlerts++;
      }
    }
    
    res.json({
      message: 'Price check complete',
      productsChecked: products.length,
      productAlertsTriggered: productAlerts,
      goldAlertsChecked: alerts.length,
      goldAlertsTriggered: goldAlerts,
    });
  } catch (error) {
    console.error('Manual check error:', error);
    res.status(500).json({ error: 'Price check failed' });
  }
});
```

#### Step 4: Add Notification Endpoints

```javascript
// GET notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Mark notification as read
app.post('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.isRead = true;
      await notification.save();
    }
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Mark all notifications as read
app.post('/api/notifications/read-all', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Delete notification
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Clear all notifications
app.delete('/api/notifications/clear-all', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    await Notification.deleteMany({ userId });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear all error:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});
```

#### Step 5: Test Automated Checking

1. Restart backend server
2. Add a product with target price = current price + ₹1
3. Test manual trigger: Call `/api/cron/check-prices` endpoint
4. Check notifications page - should see notification!
5. Wait 1 hour for automatic check (or change cron schedule to `* * * * *` for every minute)

---

## ✅ SOLUTION 3: Add Real-time Push Notifications

### Why Firebase Cloud Messaging?
- **Already integrated** - You're using Firebase Auth
- **Free** - Unlimited notifications
- **Cross-platform** - Works on web, mobile
- **Reliable** - Google infrastructure

### Step-by-Step Implementation:

#### Step 1: Get VAPID Key from Firebase

1. Go to: https://console.firebase.google.com
2. Select your project: `universal-tracker-f3fbd`
3. Click ⚙️ Settings → **Project settings**
4. Go to **Cloud Messaging** tab
5. Scroll to **Web configuration**
6. Click **Generate key pair** (under Web Push certificates)
7. Copy the VAPID key (starts with `B...`)

#### Step 2: Add VAPID Key to Frontend `.env`

Open `.env` and add:

```env
VITE_FIREBASE_VAPID_KEY=your-vapid-key-here
```

#### Step 3: Update Firebase Config

Open `src/firebase.js` and add at the bottom:

```javascript
// Get messaging instance
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export const messaging = getMessaging(app);

// Request notification permission and get FCM token
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('❌ Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

// Listen for foreground messages
export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('📬 Message received:', payload);
      resolve(payload);
    });
  });
}
```

#### Step 4: Update Service Worker

Replace `public/firebase-messaging-sw.js` with:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCx6VT1dGrXWIJir-yq_nfAm8pq5806Do0",
  authDomain: "universal-tracker-f3fbd.firebaseapp.com",
  projectId: "universal-tracker-f3fbd",
  storageBucket: "universal-tracker-f3fbd.firebasestorage.app",
  messagingSenderId: "35511528568",
  appId: "1:35511528568:web:074eed17458b76d220918d",
  measurementId: "G-2NNYV6H254"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

#### Step 5: Add Notification Request in Dashboard

Open `src/pages/Dashboard.jsx` and add at the top:

```javascript
import { requestNotificationPermission } from '../firebase';
import { useState, useEffect } from 'react';

// Inside the Dashboard component:
const [notificationEnabled, setNotificationEnabled] = useState(false);

useEffect(() => {
  // Check if notifications are already enabled
  if (Notification.permission === 'granted') {
    setNotificationEnabled(true);
  }
}, []);

const handleEnableNotifications = async () => {
  const token = await requestNotificationPermission();
  if (token) {
    setNotificationEnabled(true);
    // Save token to backend (for sending push notifications)
    // await axios.post('/api/user/fcm-token', { token });
  }
};
```

Add button to enable notifications:

```jsx
{!notificationEnabled && (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
    <h3 className="text-lg font-semibold text-blue-900 mb-2">
      🔔 Enable Push Notifications
    </h3>
    <p className="text-blue-700 mb-4">
      Get instant alerts when prices drop, even when the app is closed!
    </p>
    <button
      onClick={handleEnableNotifications}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Enable Notifications
    </button>
  </div>
)}
```

#### Step 6: Test Push Notifications

1. Open Dashboard
2. Click "Enable Notifications"
3. Allow permissions in browser
4. Add a product with target price close to current
5. Trigger manual price check: `/api/cron/check-prices`
6. You should see browser notification!

---

## 🎯 Testing Checklist

### Database (Data Persistence)
- [ ] Add product → Restart server → Product still shows
- [ ] Set gold alert → Restart server → Alert still shows
- [ ] View notifications → Restart server → Notifications still show

### Automated Price Checking
- [ ] Add product with target = current price + ₹1
- [ ] Call `/api/cron/check-prices` endpoint
- [ ] Check notifications page → Should see price alert
- [ ] Wait 1 hour → Check runs automatically
- [ ] Backend console shows "🔍 Checking product prices..."

### Push Notifications
- [ ] Enable notifications in Dashboard
- [ ] Browser shows permission prompt
- [ ] Add product with target close to current price
- [ ] Trigger price check
- [ ] Browser shows notification popup

---

## 🚀 Next Steps (Optional)

After these 3 critical features work:

1. **Deploy to cloud** (Railway/Vercel) - Run 24/7
2. **Add email notifications** (SendGrid) - Backup for push
3. **Add real Job API** (Adzuna) - Real job listings
4. **Build Medical system** - Community blood donation alerts
5. **Make PWA** - Install on phone like native app

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Check connection string has correct password
- Whitelist IP address in MongoDB Atlas (or allow 0.0.0.0/0)
- Check internet connection

### Cron Jobs Not Running
- Check backend console for "⏰ Automated price checking enabled"
- Check logs show "🔍 Checking product prices..."
- Try manual trigger endpoint first

### Push Notifications Not Working
- Check VAPID key is correct in `.env`
- Check browser permissions (chrome://settings/content/notifications)
- Check service worker is registered (DevTools → Application → Service Workers)
- Only works on HTTPS or localhost

---

## 📞 Need Help?

If you get stuck on any step, let me know:
- Which step you're on
- Any error messages you see
- What you've tried so far

I'll help you debug and get it working! 🎉
