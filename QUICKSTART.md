# TechHighlight - Quick Start Guide

This is your rapid-reference guide to get TechHighlight up and running. For detailed information, refer to the comprehensive documentation files.

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| **README.md** | Project overview, features, getting started |
| **PROJECT_PLAN.md** | Complete project plan, tasks, milestones, architecture |
| **FILE_TREE.md** | Detailed file structure and organization |
| **DEPENDENCIES.md** | All dependencies explained with rationale |
| **ACCEPTANCE_CRITERIA.md** | MVP completion checklist |
| **QUICKSTART.md** | This file - rapid setup guide |

---

## ⚡ 5-Minute Setup

### Prerequisites
```bash
# Check versions
node --version  # Should be 18+
npm --version   # Should be 9+
```

### Setup Commands
```bash
# 1. Install dependencies
npm install

# 2. Install Firebase CLI (if not installed)
npm install -g firebase-tools

# 3. Login to Firebase
firebase login

# 4. Initialize Firebase
firebase init
# Select: Firestore, Authentication, Functions, Storage, Hosting

# 5. Create environment variables
# Copy and fill with your Firebase config
cp .env.example .env.local

# 6. Run development server
npm run dev

# 7. Open browser
# http://localhost:3000
```

---

## 🔧 Environment Variables

Required in `.env.local`:

```bash
# Firebase Client (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Firebase Admin (from Service Account JSON)
FIREBASE_ADMIN_PROJECT_ID=xxx
FIREBASE_ADMIN_CLIENT_EMAIL=xxx
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Where to get Firebase config:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Project Settings → General → Your apps → Config
4. Project Settings → Service Accounts → Generate new private key

---

## 🗄️ Firestore Setup

### 1. Create Collections

In Firebase Console → Firestore Database, create these collections:

- `articles`
- `sources`
- `topics`
- `newsletters`
- `users`

### 2. Add First Admin User

After signing up via Firebase Auth:

1. Go to Firestore → `users` collection
2. Create document with ID = your Firebase Auth UID
3. Add fields:
   ```javascript
   {
     displayName: "Your Name",
     email: "your@email.com",
     role: "admin",
     createdAt: <server timestamp>,
     lastLoginAt: <server timestamp>
   }
   ```

### 3. Security Rules

Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

---

## 📂 Project Structure (Simplified)

```
tech_highlight/
├── app/                    # Next.js pages
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities, Firebase, hooks
├── types/                 # TypeScript types
├── firebase/              # Firebase config & functions
├── public/                # Static assets
└── [config files]
```

---

## 🎯 Development Workflow

### Daily Development
```bash
npm run dev              # Start dev server
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
```

### Before Committing
```bash
npm run lint             # Fix linting issues
npm run format           # Auto-format code
npm test                 # Run tests
```

### Deploying
```bash
npm run build            # Build production bundle
firebase deploy          # Deploy to Firebase Hosting
```

---

## 🛣️ Development Roadmap

### Week 1-3: Foundation
- ✅ Setup Next.js + Firebase
- ✅ Create UI component library
- ✅ Implement authentication
- ✅ Build Firestore data layer

### Week 4-8: Public Site
- ✅ Home page with featured content
- ✅ Article pages (MDX rendering)
- ✅ News, Guides, Tools listings
- ✅ Topics system
- ✅ Newsletter archive

### Week 9-12: Admin Dashboard
- ✅ Article editor (CRUD)
- ✅ Topic management
- ✅ Source manager (RSS)
- ✅ Content validation
- ✅ Scheduled publishing
- ✅ Newsletter builder

---

## 🔑 Key Features to Implement

### Public Site
1. **Home Page**: Hero + latest news + topics
2. **Article Detail**: MDX rendering + related articles
3. **Category Pages**: News, Guides, Tools (filtered lists)
4. **Topic Pages**: All topics + topic detail pages
5. **Newsletter Archive**: Past issues + subscribe form

### Admin Dashboard
1. **Article Editor**: Create/edit articles with MDX preview
2. **Topic Manager**: CRUD + drag-to-reorder
3. **Source Manager**: Add RSS feeds, manual sources
4. **Validation**: Check required fields, SEO score
5. **Scheduled Publish**: Cloud Function (cron job)
6. **Newsletter Builder**: Select articles, publish archive

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `firebase` | Backend services |
| `tailwindcss` | CSS framework |
| `next-mdx-remote` | MDX rendering |
| `react-hook-form` + `zod` | Forms & validation |
| `@radix-ui/*` | Accessible UI primitives |
| `lucide-react` | Icons |
| `date-fns` | Date formatting |
| `@dnd-kit/*` | Drag & drop |

Install all: `npm install`

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# E2E tests
npm run test:e2e

# Watch mode (during development)
npm run test:watch
```

---

## 🚀 Deployment Checklist

**Before First Deploy:**
- [ ] Firebase project created
- [ ] Environment variables set in Firebase Console
- [ ] Firestore security rules deployed
- [ ] Storage rules deployed
- [ ] Cloud Functions configured
- [ ] Custom domain configured (optional)

**Deploy Command:**
```bash
npm run build
firebase deploy
```

**Deploy Only Functions:**
```bash
firebase deploy --only functions
```

**Deploy Only Hosting:**
```bash
firebase deploy --only hosting
```

---

## 🐛 Common Issues & Fixes

### Issue: Firebase connection fails
**Fix**: Check environment variables in `.env.local`, ensure Firebase project is active

### Issue: Auth doesn't work
**Fix**: Enable Email/Password auth in Firebase Console → Authentication → Sign-in method

### Issue: Firestore permission denied
**Fix**: Deploy security rules with `firebase deploy --only firestore:rules`

### Issue: Images won't upload
**Fix**: Check Storage rules, ensure user is authenticated

### Issue: MDX won't render
**Fix**: Check MDX syntax, ensure `next-mdx-remote` is installed

### Issue: Build fails
**Fix**: Run `npm run type-check` to find TypeScript errors

---

## 📞 Getting Help

1. **Documentation**: Check PROJECT_PLAN.md and FILE_TREE.md
2. **Firebase**: https://firebase.google.com/docs
3. **Next.js**: https://nextjs.org/docs
4. **Tailwind**: https://tailwindcss.com/docs

---

## 🎓 Learning Resources

### Next.js 15 App Router
- [Official Docs](https://nextjs.org/docs)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Firebase
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- [Cloud Functions](https://firebase.google.com/docs/functions)

### Tailwind CSS
- [Utility Classes](https://tailwindcss.com/docs/utility-first)
- [Typography Plugin](https://tailwindcss.com/docs/typography-plugin)

---

## ✅ MVP Completion Checklist

### Phase 1: Foundation ✅
- [ ] Project setup complete
- [ ] UI components ready
- [ ] Auth working
- [ ] Firestore connected

### Phase 2: Public Site ✅
- [ ] Home page live
- [ ] Article pages working
- [ ] All category pages functional
- [ ] Topics system complete
- [ ] Newsletter archive live

### Phase 3: Admin ✅
- [ ] Admin dashboard accessible
- [ ] Article editor functional
- [ ] Topic management working
- [ ] Source manager ready
- [ ] Validation system active
- [ ] Scheduled publishing deployed
- [ ] Newsletter builder operational

---

## 🎉 Success Metrics

**By Week 12:**
- ✅ Lighthouse score > 90 (all categories)
- ✅ Page load time < 2 seconds
- ✅ 50+ articles published (seeded)
- ✅ Admin can publish article in < 10 minutes
- ✅ Zero critical bugs
- ✅ Fully responsive on all devices

---

## 🚦 Next Steps

1. **Now**: Complete project setup (Week 1)
2. **Week 2**: Build UI component library
3. **Week 3**: Implement authentication
4. **Week 4**: Start public site (home page)
5. **Week 8**: Launch public beta
6. **Week 12**: Complete admin dashboard (MVP)

---

**Ready to start coding?** 🚀

```bash
npm run dev
```

Then open http://localhost:3000 and start building!

---

**Document Version**: 1.0  
**Last Updated**: November 7, 2025  
**Author**: Senior Architect

