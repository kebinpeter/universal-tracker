# Backend API Requirements

The Universal Tracker frontend needs a backend API running at `http://localhost:3000` (or change `VITE_API_BASE_URL` in `.env`).

## Required API Endpoints

All endpoints require Firebase ID token in `Authorization: Bearer <token>` header.

### Gold Tracker
```
GET  /api/gold/current-price     → { price, change, changePercent }
GET  /api/gold/history?days=7    → [{ date, price }]
POST /api/gold/set-alert         → Body: { targetPrice }
GET  /api/gold/alerts            → [{ id, targetPrice, status }]
DELETE /api/gold/alerts/:id      → Success message
```

### Product Tracker
```
GET  /api/product/list           → [{ id, name, url, currentPrice, targetPrice, image }]
POST /api/product/add            → Body: { url, targetPrice, name? }
PUT  /api/product/:id            → Body: { targetPrice }
DELETE /api/product/:id          → Success message
```

### Job Search
```
POST /api/job/search             → Body: { keyword, location?, minSalary?, page? }
                                 → { jobs: [...], hasMore: boolean }
GET  /api/job/subscriptions      → [{ id, keyword, location, minSalary }]
POST /api/job/subscribe          → Body: { keyword, location?, minSalary? }
DELETE /api/job/subscriptions/:id → Success message
POST /api/job/save               → Body: { jobId, ...jobData }
GET  /api/job/saved              → [{ saved jobs }]
```

### Medical Alerts
```
GET  /api/medical/alerts?bloodGroup=&radius= → [{ id, bloodGroup, hospital, urgency, distance, postedAt }]
GET  /api/medical/subscription   → { bloodGroup, radius }
POST /api/medical/subscribe      → Body: { bloodGroup, radius }
PUT  /api/medical/subscription   → Body: { bloodGroup, radius }
DELETE /api/medical/subscription → Success message
POST /api/medical/respond/:id    → Success message
```

### User Preferences
```
POST /api/user/fcm-token         → Body: { token }
GET  /api/user/preferences       → { notifications: { medical, product, gold, job } }
PUT  /api/user/preferences       → Body: { notifications: {...} }
DELETE /api/user/account         → Success message
```

## Technology Options for Backend

### 1. Node.js + Express
```bash
npm init -y
npm install express cors firebase-admin axios cheerio
```

### 2. Python + Flask/FastAPI
```bash
pip install flask flask-cors firebase-admin requests beautifulsoup4
```

### 3. Use Mock Data (for testing UI)
See MOCK_API_SETUP.md

## External APIs You'll Need

1. **Gold Price API** - https://www.goldapi.io/ or https://metals-api.com/
2. **Job Search API** - LinkedIn API, Indeed API, or Adzuna API
3. **Product Price Scraping** - Web scraping or Product APIs
4. **Medical Alerts** - Custom database or SMS/notification service

## Quick Start Template

I can create a basic Express.js backend template for you with mock data.
Would you like me to generate that?
