# 🎯 Universal Tracker

A comprehensive real-time tracking application with **MongoDB database**, **automated price monitoring**, and **push notifications**. Track gold prices, product prices, job listings, and medical alerts all in one place.

## ✨ Recent Updates

✅ **MongoDB Database Integration** - All data persists permanently  
✅ **Automated Price Checking** - Cron jobs run every hour  
✅ **Real-time Push Notifications** - Browser alerts + in-app notifications  
✅ **Real APIs** - Gold API + ScraperAPI for actual data  
✅ **No Data Loss** - Everything saved to database

## Features

### 🩺 Medical Alerts
- Real-time blood donation requests
- Filter by blood group and radius
- Subscribe to alerts for specific blood types
- Urgency indicators (Critical, High, Medium)
- Offer help functionality

### 🛍️ Product Price Tracker
- Track product prices from multiple e-commerce sites
- Set target prices and get alerts
- Visual progress bars showing price vs. target
- Auto-fetch product details from URLs

### 💰 Gold Rate Monitor
- Real-time gold price tracking (₹/g)
- 7-day and 30-day price history charts
- Set custom price alerts
- Auto-refresh every 10 minutes

### 💼 Job Search Alerts
- Search jobs by title, location, and salary
- Subscribe to job searches
- Save interesting opportunities
- Filter by multiple criteria

## Tech Stack

- **Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS (utility-first)
- **Routing**: React Router v6
- **State Management**: React Context API + useReducer
- **HTTP Client**: Axios with interceptors
- **Authentication**: Firebase Auth (email/password + Google)
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Notifications**: react-hot-toast
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase project with Authentication and Cloud Messaging enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd universal-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure your Firebase credentials in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

5. Update Firebase config in `public/firebase-messaging-sw.js` with your credentials.

6. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/                    # API configuration
│   └── axiosInstance.js    # Axios instance with interceptors
├── components/             # React components
│   ├── gold/              # Gold tracker components
│   ├── job/               # Job search components
│   ├── layout/            # Layout components (Sidebar, Topbar)
│   ├── medical/           # Medical alerts components
│   ├── product/           # Product tracker components
│   └── shared/            # Shared/reusable components
├── context/               # React Context providers
│   ├── AuthContext.jsx    # Authentication context
│   └── NotificationContext.jsx  # Notification management
├── hooks/                 # Custom React hooks
│   ├── useAuth.js
│   ├── useGold.js
│   ├── useJobs.js
│   ├── useMedical.js
│   └── useProducts.js
├── pages/                 # Page components
│   ├── Dashboard.jsx
│   ├── GoldTracker.jsx
│   ├── JobTracker.jsx
│   ├── Login.jsx
│   ├── MedicalTracker.jsx
│   ├── Notifications.jsx
│   ├── ProductTracker.jsx
│   ├── Settings.jsx
│   └── Signup.jsx
├── utils/                 # Utility functions
│   ├── formatters.js      # Formatting utilities
│   └── validators.js      # Zod validation schemas
├── App.jsx               # Main app component
├── firebase.js           # Firebase configuration
└── main.jsx             # Entry point
```

## Design System

### Color Palette
- **Primary**: Indigo-600 (accent)
- **Success**: Emerald-500
- **Warning**: Amber-500
- **Danger**: Rose-500
- **Sidebar**: Slate-900
- **Background**: White/Slate-50

### Typography
- **Font**: Inter (Google Fonts)
- **Body**: 14px
- **Labels**: 13px
- **Headings**: 22px

### Components
- **Border Radius**: rounded-xl (cards), rounded-lg (inputs), rounded-full (badges)
- **Shadows**: shadow-sm (cards), shadow-md (modals)
- **Transitions**: transition-all duration-200

## API Integration

The app communicates with a backend API. All requests automatically include the Firebase ID token in the Authorization header.

### Expected API Endpoints

#### Gold
- `GET /api/gold/current-price` - Get current gold price
- `GET /api/gold/history` - Get price history
- `POST /api/gold/set-alert` - Set price alert
- `GET /api/gold/alerts` - Get user's alerts
- `DELETE /api/gold/alerts/:id` - Delete alert

#### Products
- `GET /api/product/list` - Get tracked products
- `POST /api/product/add` - Add product to track
- `PUT /api/product/:id` - Update product
- `DELETE /api/product/:id` - Delete product

#### Jobs
- `POST /api/job/search` - Search jobs
- `GET /api/job/subscriptions` - Get subscriptions
- `POST /api/job/subscribe` - Subscribe to alerts
- `DELETE /api/job/subscriptions/:id` - Unsubscribe
- `POST /api/job/save` - Save a job

#### Medical
- `GET /api/medical/alerts` - Get medical alerts (with filters)
- `GET /api/medical/subscription` - Get user's subscription
- `POST /api/medical/subscribe` - Subscribe to alerts
- `PUT /api/medical/subscription` - Update subscription
- `DELETE /api/medical/subscription` - Unsubscribe
- `POST /api/medical/respond/:id` - Respond to alert

#### User
- `POST /api/user/fcm-token` - Register FCM token
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update preferences
- `DELETE /api/user/account` - Delete account

## Features

### Authentication
- Email/password signup and login
- Google OAuth integration
- Protected routes
- Auto-logout on token expiration

### Push Notifications
- Foreground notifications (toast)
- Background notifications (service worker)
- Per-module notification preferences
- Notification history with filtering

### Dark Mode
- System preference detection
- Manual toggle
- Persisted in localStorage
- Tailwind CSS class strategy

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Adaptive grids and layouts
- Touch-friendly controls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
