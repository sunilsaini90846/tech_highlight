# Firebase Quick Start

Fast setup reference for TechHighlight Firebase integration.

---

## 🚀 Quick Setup (5 Minutes)

### 1. Create Firebase Project
```
1. Go to: https://console.firebase.google.com
2. Click "Add project"
3. Name: "tech-highlight"
4. Click through setup wizard
```

### 2. Add Web App
```
1. Click "</>" (Web icon)
2. Name: "TechHighlight Web"
3. Check "Firebase Hosting"
4. Click "Register app"
5. COPY the config values shown
```

### 3. Enable Services
```
Authentication → Get started → Email/Password → Enable
Firestore → Create database → Test mode → Enable
Storage → Get started → Test mode → Done
```

### 4. Configure Environment
```bash
# Create .env.local
touch .env.local

# Add these lines (replace with YOUR values):
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Restart dev server
npm run dev
```

---

## 📝 Where to Get Config Values

**Firebase Console** → Your Project → ⚙️ Settings → Project settings → Scroll down → "Your apps" → Select web app → "Config"

---

## 💻 Usage Examples

### Firestore
```typescript
'use client'
import { getFirestoreDb } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const db = getFirestoreDb()
await addDoc(collection(db, 'articles'), {
  title: 'My Article',
  createdAt: new Date()
})
```

### Auth
```typescript
'use client'
import { getFirebaseAuth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const auth = getFirebaseAuth()
await signInWithEmailAndPassword(auth, email, password)
```

### Analytics
```typescript
'use client'
import { getFirebaseAnalytics } from '@/lib/firebase'
import { logEvent } from 'firebase/analytics'

const analytics = getFirebaseAnalytics()
if (analytics) {
  logEvent(analytics, 'page_view')
}
```

---

## ⚠️ Important Notes

- ✅ **Always use `'use client'`** directive for Firebase client SDK
- ✅ **.env.local is gitignored** - safe for keys
- ✅ **NEXT_PUBLIC_ prefix required** for browser access
- ✅ **Restart dev server** after changing .env.local

---

## 🐛 Quick Fixes

**"Missing environment variables"**
→ Create `.env.local` and add all NEXT_PUBLIC_FIREBASE_* vars

**"Firebase not initialized"**
→ Add `'use client'` to top of file

**Changes not applying**
→ Restart dev server (Ctrl+C then `npm run dev`)

---

## 📚 Full Documentation

See **FIREBASE_SETUP.md** for complete step-by-step instructions.

---

**Status**: Firebase SDK Installed ✅  
**Next**: Create `.env.local` with your config

