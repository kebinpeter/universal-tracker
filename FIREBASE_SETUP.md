# Firebase Setup Instructions

## Step 1: Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on your project
3. Click the **gear icon** → **Project settings**
4. Scroll to **Your apps** section
5. If you haven't added a web app yet:
   - Click the **</>** (web) icon
   - Register app with name "Universal Tracker"
   - You'll see the config object

6. Copy these values from `firebaseConfig`:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `messagingSenderId`
   - `appId`

## Step 2: Enable Authentication

1. In Firebase Console sidebar, click **Authentication**
2. Click **Get Started** (if first time)
3. Go to **Sign-in method** tab
4. Enable these providers:
   - ✅ **Email/Password** - Click, toggle Enable, Save
   - ✅ **Google** - Click, toggle Enable, add support email, Save

## Step 3: Get Cloud Messaging Key (for Push Notifications)

1. Go to **Project settings** → **Cloud Messaging** tab
2. Scroll to **Web configuration** section
3. Click **Generate key pair** button
4. Copy the **VAPID key** (long string starting with "B...")

## Step 4: Update Your .env File

Open `.env` file in the project root and paste your values:

```env
VITE_API_BASE_URL=http://localhost:3000

# From Firebase Project Settings → Your apps → Web app config
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop

# From Project Settings → Cloud Messaging → Web Push certificates
VITE_FIREBASE_VAPID_KEY=BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Step 5: Update Service Worker

Open `public/firebase-messaging-sw.js` and update the Firebase config at line 10:

```javascript
firebase.initializeApp({
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
});
```

## Step 6: Restart the Development Server

After updating the files:

1. Stop the current dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```
3. Refresh your browser

## Step 7: Test Authentication

1. Open http://localhost:5174/ (or whichever port Vite shows)
2. Click **Sign up**
3. Enter email and password
4. You should be able to create an account and login!

## Troubleshooting

### "Firebase API key is invalid"
- Double-check you copied the entire `apiKey` value
- Make sure there are no spaces or quotes around the value in `.env`

### "auth/configuration-not-found"
- Make sure you enabled Email/Password in Firebase Console → Authentication → Sign-in method

### Google Sign-in not working
- Make sure you enabled Google provider in Firebase Console
- Added a support email in the Google provider settings

### Push notifications not working
- Make sure you generated and copied the VAPID key
- Updated both `.env` and `public/firebase-messaging-sw.js`

## Need Help?

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify all values in `.env` are correct
3. Make sure there are no trailing spaces in `.env`
4. Restart the dev server after any `.env` changes
