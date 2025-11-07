# Firebase Setup Guide

Complete instructions for setting up Firebase for TechHighlight.

---

## 📋 Prerequisites

- Google account
- Node.js installed
- TechHighlight project cloned locally

---

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Click "Add project" or "Create a project"

2. **Enter Project Details**
   - **Project name**: `tech-highlight` (or your preferred name)
   - Click "Continue"

3. **Google Analytics** (Optional)
   - Choose to enable or disable Google Analytics
   - If enabled, select or create an Analytics account
   - Click "Create project"

4. **Wait for Project Creation**
   - Firebase will set up your project (takes ~30 seconds)
   - Click "Continue" when ready

---

### Step 2: Add Web App to Firebase Project

1. **Add Web App**
   - In Firebase Console, click the **web icon** (`</>`) or "Add app"
   - Select "Web" as the platform

2. **Register Your App**
   - **App nickname**: `TechHighlight Web` (or any name)
   - **Firebase Hosting**: Check this box if you plan to use Firebase Hosting
   - Click "Register app"

3. **Copy Firebase Configuration**
   - Firebase will show you the config object
   - **IMPORTANT**: Copy these values - you'll need them for `.env.local`
   
   Example config shown:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567",
     authDomain: "tech-highlight.firebaseapp.com",
     projectId: "tech-highlight",
     storageBucket: "tech-highlight.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123def456",
     measurementId: "G-ABC123DEF4"
   };
   ```

4. **Continue to Console**
   - Click "Continue to console"

---

### Step 3: Enable Firebase Services

#### Enable Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle "Enable" switch
   - Click "Save"

#### Enable Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. **Security rules**: Select "Start in test mode" (we'll add proper rules later)
4. **Location**: Choose closest region to your users
5. Click "Enable"
6. Wait for database to be created

#### Enable Storage (for images)

1. Click **"Storage"** in left sidebar
2. Click **"Get started"**
3. **Security rules**: Click "Next" (accept default test mode)
4. **Location**: Should match your Firestore location
5. Click "Done"

---

### Step 4: Configure Environment Variables

1. **Create `.env.local` file** in project root:
   ```bash
   cd /Users/sunil/Developer/react_apps/tech_highlight
   touch .env.local
   ```

2. **Copy template from `env.example`**:
   ```bash
   cat env.example > .env.local
   ```

3. **Edit `.env.local`** and replace placeholders with your Firebase config:
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tech-highlight.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tech-highlight
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tech-highlight.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123DEF4
   ```

4. **Save the file**

---

### Step 5: Verify Firebase Configuration

#### Where to Find Your Config Again

If you need to find your Firebase config values later:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click **⚙️ (Settings icon)** → **Project settings**
4. Scroll down to **"Your apps"** section
5. Find your web app (TechHighlight Web)
6. Click **"Config"** radio button (not SDK)
7. Copy the values

#### Test Your Setup

1. **Restart your dev server** (environment variables are loaded on startup):
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Check for errors**:
   - Open http://localhost:3000
   - Open browser console (F12)
   - Look for Firebase initialization errors
   - You should see no errors related to Firebase

3. **Test Firebase import** (optional):
   Create a test page to verify Firebase is working:
   ```typescript
   // app/test-firebase/page.tsx
   'use client'
   import { getFirestoreDb, getFirebaseAuth } from '@/lib/firebase'
   
   export default function TestFirebase() {
     try {
       const db = getFirestoreDb()
       const auth = getFirebaseAuth()
       return <div>✅ Firebase connected successfully!</div>
     } catch (error) {
       return <div>❌ Firebase error: {error.message}</div>
     }
   }
   ```

---

## 📝 Firebase Config Values Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public API key for Firebase | `AIzaSyAbc...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain for your project | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID | `your-project` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Cloud Storage bucket | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your web app ID | `1:123456789012:web:abc123` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Google Analytics ID (optional) | `G-ABC123DEF4` |

### Why `NEXT_PUBLIC_` Prefix?

- Next.js only exposes environment variables to the browser if they start with `NEXT_PUBLIC_`
- Firebase client SDK runs in the browser, so these need to be public
- These values are **safe to expose** - Firebase uses security rules to protect your data

---

## 🔒 Security Best Practices

### ✅ DO:
- Commit `env.example` to git (template only)
- Add `.env.local` to `.gitignore` (already done)
- Use Firestore security rules to protect data
- Restrict API key usage in Firebase Console (optional)

### ❌ DON'T:
- Commit `.env.local` to git (contains your actual keys)
- Share your `.env.local` file publicly
- Hardcode Firebase config in source code

---

## 🛠️ Using Firebase in Your App

### Import Firestore

```typescript
import { getFirestoreDb } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function getArticles() {
  const db = getFirestoreDb()
  const articlesCol = collection(db, 'articles')
  const snapshot = await getDocs(articlesCol)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

### Import Auth

```typescript
import { getFirebaseAuth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export async function login(email: string, password: string) {
  const auth = getFirebaseAuth()
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}
```

### Import Analytics (Optional)

```typescript
import { getFirebaseAnalytics } from '@/lib/firebase'
import { logEvent } from 'firebase/analytics'

export function trackPageView(pageName: string) {
  const analytics = getFirebaseAnalytics()
  if (analytics) {
    logEvent(analytics, 'page_view', { page_name: pageName })
  }
}
```

---

## 🔥 Firebase CLI Setup (Optional)

For deployment and advanced features:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** in your project:
   ```bash
   cd /Users/sunil/Developer/react_apps/tech_highlight
   firebase init
   ```

4. **Select features**:
   - Firestore
   - Functions
   - Hosting
   - Storage

5. **Choose existing project**: Select `tech-highlight`

---

## 🐛 Troubleshooting

### Error: "Missing required Firebase environment variables"

**Solution**: 
- Ensure `.env.local` exists in project root
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Restart dev server after creating `.env.local`

### Error: "Firebase App is not initialized"

**Solution**:
- Check that you're using Firebase functions on client-side only
- Wrap Firebase calls in `'use client'` components
- Ensure environment variables are correctly set

### Error: "Failed to get document because the client is offline"

**Solution**:
- Check your internet connection
- Verify Firebase project is active in console
- Check browser console for network errors

### Error: "API key not valid"

**Solution**:
- Double-check your `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`
- Ensure you copied the correct value from Firebase Console
- Try regenerating the web app in Firebase Console

---

## 📚 Next Steps

After completing this setup:

1. ✅ **Test Firebase connection** (create test page)
2. ✅ **Add Firestore security rules** (see `firestore.rules`)
3. ✅ **Create Firestore collections** (articles, topics, users, etc.)
4. ✅ **Set up Authentication UI** (login/signup pages)
5. ✅ **Configure Storage rules** (for image uploads)

---

## 📖 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Auth Web](https://firebase.google.com/docs/auth/web/start)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ Setup Checklist

- [ ] Create Firebase project
- [ ] Add web app to project
- [ ] Enable Authentication (Email/Password)
- [ ] Enable Firestore Database
- [ ] Enable Storage
- [ ] Create `.env.local` file
- [ ] Copy Firebase config to `.env.local`
- [ ] Restart dev server
- [ ] Verify no console errors
- [ ] Test Firebase connection

---

**Setup Date**: November 7, 2025  
**Status**: Ready for Firebase Integration  
**Next**: Start building with Firestore and Auth

