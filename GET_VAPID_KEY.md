# Get Your VAPID Key for Push Notifications

## Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **universal-tracker-f3fbd**
3. Click the **gear icon** (⚙️) → **Project settings**
4. Click the **Cloud Messaging** tab
5. Scroll down to **Web configuration** section
6. Click **Generate key pair** button
7. Copy the long key that appears (starts with "B...")
8. Paste it in your `.env` file as `VITE_FIREBASE_VAPID_KEY=`

## Screenshot Reference:
The VAPID key looks like this:
```
BPQxj5XQy...very_long_string...xyz123
```

## After Getting the Key:

1. Update `.env`:
   ```
   VITE_FIREBASE_VAPID_KEY=BPQxj5XQy...paste_your_key_here
   ```

2. Restart the dev server:
   - Stop server (Ctrl+C in terminal)
   - Run: `npm run dev`

3. Refresh your browser

---

**Note:** VAPID key is optional. The app will work without it, but you won't receive push notifications.
