# TechHighlight 🚀

A content-first website showcasing curated AI highlights for a general audience. Built with Next.js 15, TypeScript, Tailwind CSS, and Firebase.

## 📋 Project Overview

TechHighlight is a modern content management platform designed to publish and manage AI-related news, guides, and tools. It features a public-facing website and a powerful admin dashboard for content management.

### Key Features

**Public Site:**
- 📰 News, Guides, and Tools sections
- 🏷️ Topic-based content organization
- 🔍 Search and filtering
- 📧 Newsletter archive and subscription
- 📱 Fully responsive design
- ⚡ Optimized for performance (Lighthouse 90+)

**Admin Dashboard:**
- ✍️ MDX-powered article editor with live preview
- 📅 Scheduled publishing
- 🎯 Topic taxonomy management
- 📡 RSS source manager
- ✅ Content validation system
- 📬 Newsletter builder
- 🔐 Role-based access control

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.0
- **Backend**: [Firebase](https://firebase.google.com/)
  - Firestore (Database)
  - Authentication
  - Cloud Functions
  - Storage
  - Hosting
- **Content**: MDX for rich article bodies
- **Forms**: React Hook Form + Zod validation

## 📁 Documentation

- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Comprehensive project plan, tasks, milestones, and acceptance criteria
- **[FILE_TREE.md](./FILE_TREE.md)** - Complete file structure and organization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase CLI: `npm install -g firebase-tools`
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tech_highlight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   ```bash
   firebase login
   firebase init
   ```
   Select:
   - Firestore
   - Authentication
   - Functions
   - Storage
   - Hosting

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Firebase configuration to `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Admin SDK (server-side)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
   FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### First-Time Setup

1. **Create an admin user** (Firebase Console → Authentication)
2. **Add user role to Firestore**:
   ```javascript
   // In Firestore, create document: users/{uid}
   {
     displayName: "Your Name",
     email: "your@email.com",
     role: "admin",
     createdAt: <timestamp>
   }
   ```

3. **Seed sample data** (optional)
   ```bash
   npm run seed
   ```

## 📦 Project Structure

```
tech_highlight/
├── app/                 # Next.js App Router pages
│   ├── (public)/       # Public pages
│   ├── admin/          # Admin dashboard
│   └── api/            # API routes
├── components/         # React components
│   ├── ui/            # UI primitives
│   ├── layout/        # Layout components
│   ├── article/       # Article components
│   ├── editor/        # Admin editor components
│   └── ...
├── lib/               # Utilities and services
│   ├── firebase/      # Firebase setup & operations
│   ├── mdx/           # MDX processing
│   ├── validation/    # Validation schemas
│   └── utils/         # Helper functions
├── types/             # TypeScript types
├── firebase/          # Firebase config & functions
└── public/            # Static assets
```

See [FILE_TREE.md](./FILE_TREE.md) for complete structure.

## 🎯 Milestones

### ✅ Milestone 1: Foundation (Weeks 1-3)
- Project setup with Next.js 15 + TypeScript + Tailwind
- Firebase integration (Firestore, Auth, Storage)
- Design system and UI component library
- Authentication system

### 🔄 Milestone 2: Public Site (Weeks 4-8)
- Home, News, Guides, Tools pages
- Article detail pages with MDX rendering
- Topics system
- Newsletter archive
- Search and filtering
- SEO optimization

### 📅 Milestone 3: Admin Dashboard (Weeks 9-12)
- Article editor with MDX preview
- Topic and source management
- Scheduled publishing (Cloud Functions)
- Content validation system
- Newsletter builder

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm test             # Run tests
npm run seed         # Seed database with sample data
```

### Code Quality

- **ESLint**: Enforces code style and best practices
- **Prettier**: Auto-formats code
- **TypeScript**: Strict type checking
- **Git Hooks**: Pre-commit linting (Husky + lint-staged)

### Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:e2e      # End-to-end tests
```

## 🔒 Security

- **Firestore Security Rules**: Role-based access control
- **Storage Rules**: Authenticated uploads only
- **Admin Routes**: Protected by middleware
- **Content Sanitization**: XSS prevention in MDX
- **Environment Variables**: Sensitive data in `.env.local` (not committed)

## 🚢 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

3. **Deploy functions only**
   ```bash
   firebase deploy --only functions
   ```

### Environment Setup

- **Development**: `.env.local`
- **Production**: Set environment variables in Firebase Console

## 📊 Performance Goals

- ⚡ Lighthouse Score: 90+ (Performance, SEO, Accessibility)
- 🚀 First Contentful Paint: < 1.5s
- ⏱️ Time to Interactive: < 3s
- 📦 Bundle Size: < 200KB (initial load)

## 🗓️ Roadmap

**Phase 1 (MVP - Week 12)**
- ✅ Core public site functionality
- ✅ Admin dashboard with article editor
- ✅ Scheduled publishing
- ✅ Newsletter system

**Phase 2 (Post-MVP)**
- Advanced search (Algolia)
- Comments system
- Analytics dashboard
- Multi-language support
- API for third-party access

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

## 📝 License

[MIT License](LICENSE)

## 📧 Contact

For questions or support, contact: [your-email@example.com]

---

**Version**: 1.0  
**Status**: In Development  
**Last Updated**: November 7, 2025

