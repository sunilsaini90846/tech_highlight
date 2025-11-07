# TechHighlight - Project Plan & Architecture

## Executive Summary
TechHighlight is a content-first website showcasing curated AI highlights for a general audience. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Firebase, it features public content sections and a robust admin dashboard for content management.

---

## 1. High-Level Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Functions, Hosting)
- **Content**: MDX for rich article bodies
- **State Management**: React Context + Server Components
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives + custom Tailwind components

### Architecture Layers
```
┌─────────────────────────────────────────────┐
│           Next.js App Router (SSR)          │
│  ┌─────────────┐         ┌──────────────┐  │
│  │   Public    │         │    Admin     │  │
│  │   Routes    │         │   Dashboard  │  │
│  └─────────────┘         └──────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Firebase Services Layer            │
│  ┌──────────┐  ┌──────┐  ┌──────────────┐  │
│  │Firestore │  │ Auth │  │  Functions   │  │
│  └──────────┘  └──────┘  └──────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 2. Data Model (Firestore)

### Collections Schema

#### articles
```typescript
{
  id: string
  title: string
  slug: string
  summary: string
  coverImage: string (Storage URL)
  body: string (MDX)
  category: 'news' | 'guide' | 'tool'
  topics: string[] (topic IDs)
  tags: string[]
  sourceRef: string (source ID, nullable)
  publishedAt: Timestamp
  status: 'draft' | 'scheduled' | 'published'
  authorRef: string (user ID)
  seo: {
    title: string
    description: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### sources
```typescript
{
  id: string
  name: string
  url: string
  type: 'rss' | 'manual'
  active: boolean
  lastFetchedAt: Timestamp
  fetchInterval: number (hours)
  createdAt: Timestamp
}
```

#### topics
```typescript
{
  id: string
  name: string
  slug: string
  description: string
  featured: boolean
  order: number
  articleCount: number (computed)
  createdAt: Timestamp
}
```

#### newsletters
```typescript
{
  id: string
  issueNumber: number
  title: string
  intro: string
  items: Array<{
    articleRef: string
    customNote?: string
  }>
  publishedAt: Timestamp
  status: 'draft' | 'sent'
  seo: {
    title: string
    description: string
  }
  createdAt: Timestamp
}
```

#### users
```typescript
{
  id: string (matches Firebase Auth UID)
  displayName: string
  email: string
  role: 'admin' | 'editor' | 'reader'
  createdAt: Timestamp
  lastLoginAt: Timestamp
}
```

---

## 3. Feature Breakdown

### 3.1 Public Features

#### Home Page
- Hero section with featured articles
- Latest news (6-8 cards)
- Featured topics grid
- Newsletter signup CTA
- Trending guides section

#### News Section
- Paginated news articles list
- Filter by topic
- Search functionality
- Article card with image, summary, date
- Infinite scroll or pagination

#### Guides Section
- Long-form guide listings
- Featured/popular guides
- Category filters
- Estimated read time

#### Tools Section
- Curated AI tools directory
- Tool cards with description, link, category
- Filter and search

#### Topics Page
- All topics list/grid
- Topic detail pages with related articles
- Topic hierarchy/relationships

#### About Page
- Mission statement
- Team info
- Contact form

#### Newsletter Archive
- Past newsletter issues
- Subscribe form
- Individual issue pages

### 3.2 Admin Features

#### Authentication
- Email/password login (Firebase Auth)
- Protected admin routes
- Role-based access control (admin, editor)
- Session management

#### Dashboard
- Content statistics (published, drafts, scheduled)
- Recent activity
- Quick actions
- Analytics overview

#### Article Editor
- Rich MDX editor with preview
- Image upload (Firebase Storage)
- SEO fields
- Tag/topic selection
- Source attribution
- Status management (draft/scheduled/published)
- Scheduled publishing
- Content validation rules

#### Source Manager
- Add/edit RSS sources
- Manual source links
- Fetch interval configuration
- Last fetch status
- Test feed functionality

#### Topic Taxonomy
- CRUD operations for topics
- Reorder topics (drag-and-drop)
- Featured topic toggle
- View articles per topic

#### Newsletter Builder
- Create newsletter issues
- Select articles for issue
- Preview email template
- Send test email
- Publish archive page

#### Content Validation
- Required fields checker
- SEO score
- Image optimization alerts
- Broken link detection
- Duplicate slug detection

---

## 4. MVP Tasks & Acceptance Criteria

### Phase 1: Foundation (Weeks 1-3)

#### Task 1.1: Project Setup & Configuration
**Effort**: 2 days
**Dependencies**: None
**Acceptance Criteria**:
- [ ] Next.js 15 project initialized with TypeScript
- [ ] Tailwind CSS configured with custom theme
- [ ] Firebase project created (Firestore, Auth, Storage, Hosting)
- [ ] Environment variables configured (.env.local)
- [ ] ESLint + Prettier setup
- [ ] Git repository initialized with .gitignore
- [ ] Basic folder structure created
- [ ] Firebase Admin SDK configured for server-side operations

**Deliverables**:
- Running Next.js dev server
- Firebase connection successful
- README with setup instructions

---

#### Task 1.2: Design System & UI Components
**Effort**: 3 days
**Dependencies**: Task 1.1
**Acceptance Criteria**:
- [ ] Color palette and typography defined
- [ ] Reusable components: Button, Input, Card, Badge, Modal
- [ ] Layout components: Header, Footer, Container
- [ ] Responsive navigation with mobile menu
- [ ] Loading states and skeletons
- [ ] Toast notification system
- [ ] Form components with validation styling

**Deliverables**:
- Component library in `/components/ui`
- Storybook-style preview page (optional)

---

#### Task 1.3: Firebase Authentication Setup
**Effort**: 2 days
**Dependencies**: Task 1.1
**Acceptance Criteria**:
- [ ] Firebase Auth initialized
- [ ] Login/logout functionality
- [ ] Protected route middleware
- [ ] Auth context provider
- [ ] User role checking
- [ ] Admin-only route guards
- [ ] Session persistence
- [ ] Error handling for auth flows

**Deliverables**:
- `/admin/login` page
- Auth utility functions
- Protected `/admin/*` routes

---

#### Task 1.4: Firestore Data Layer
**Effort**: 3 days
**Dependencies**: Task 1.1
**Acceptance Criteria**:
- [ ] Firestore collections created
- [ ] TypeScript types for all collections
- [ ] CRUD utilities for each collection
- [ ] Firestore security rules defined
- [ ] Data validation schemas (Zod)
- [ ] Query helpers (pagination, filtering)
- [ ] Error handling utilities

**Deliverables**:
- `/lib/firebase/` with collection modules
- Firestore security rules file
- Type definitions in `/types/`

---

### Phase 2: Public Site (Weeks 4-8)

#### Task 2.1: Home Page
**Effort**: 4 days
**Dependencies**: Task 1.2, 1.4
**Acceptance Criteria**:
- [ ] Hero section with featured article
- [ ] Latest news grid (SSR with ISR)
- [ ] Featured topics section
- [ ] Newsletter signup form (saves to Firestore)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] SEO meta tags
- [ ] Loading states
- [ ] Error boundaries

**Deliverables**:
- `/app/page.tsx`
- Home page components

---

#### Task 2.2: Article Pages (Dynamic Routes)
**Effort**: 5 days
**Dependencies**: Task 1.2, 1.4
**Acceptance Criteria**:
- [ ] Dynamic route `/articles/[slug]`
- [ ] MDX rendering with syntax highlighting
- [ ] Article header (title, date, author, topics)
- [ ] Cover image display
- [ ] Related articles section
- [ ] Social share buttons
- [ ] Reading progress indicator
- [ ] SEO optimization (dynamic meta tags)
- [ ] Static generation for published articles
- [ ] 404 handling for invalid slugs

**Deliverables**:
- `/app/articles/[slug]/page.tsx`
- MDX renderer component
- Article layout component

---

#### Task 2.3: News, Guides, Tools Listing Pages
**Effort**: 4 days
**Dependencies**: Task 2.2
**Acceptance Criteria**:
- [ ] `/news`, `/guides`, `/tools` pages
- [ ] Paginated article lists (12 per page)
- [ ] Filter by topic (client-side)
- [ ] Search functionality (client-side initially)
- [ ] Sort options (newest, popular)
- [ ] Empty states
- [ ] Loading skeletons
- [ ] SEO for listing pages

**Deliverables**:
- Category listing pages
- Reusable article list component
- Filter/search components

---

#### Task 2.4: Topics System
**Effort**: 3 days
**Dependencies**: Task 2.2
**Acceptance Criteria**:
- [ ] `/topics` page with all topics grid
- [ ] `/topics/[slug]` page with topic articles
- [ ] Topic description display
- [ ] Article count per topic
- [ ] Breadcrumb navigation
- [ ] SEO for topic pages

**Deliverables**:
- Topics pages
- Topic card component

---

#### Task 2.5: Newsletter Archive
**Effort**: 3 days
**Dependencies**: Task 2.2
**Acceptance Criteria**:
- [ ] `/newsletter` archive page
- [ ] `/newsletter/[issueNumber]` individual issue page
- [ ] Issue list with dates
- [ ] Article links within issues
- [ ] Subscribe form
- [ ] Email template preview

**Deliverables**:
- Newsletter pages
- Newsletter components

---

#### Task 2.6: About & Static Pages
**Effort**: 2 days
**Dependencies**: Task 1.2
**Acceptance Criteria**:
- [ ] `/about` page with content
- [ ] Contact form (saves to Firestore)
- [ ] Privacy policy page
- [ ] Terms of service page

**Deliverables**:
- Static pages
- Contact form component

---

### Phase 3: Admin Dashboard (Weeks 9-12)

#### Task 3.1: Admin Dashboard Layout
**Effort**: 2 days
**Dependencies**: Task 1.3
**Acceptance Criteria**:
- [ ] Admin sidebar navigation
- [ ] Dashboard overview page
- [ ] Content statistics cards
- [ ] Quick action buttons
- [ ] User profile dropdown
- [ ] Responsive admin layout

**Deliverables**:
- `/app/admin/page.tsx`
- Admin layout component

---

#### Task 3.2: Article Editor (CRUD)
**Effort**: 6 days
**Dependencies**: Task 3.1
**Acceptance Criteria**:
- [ ] Create new article form
- [ ] Edit existing article
- [ ] MDX editor with preview (split view)
- [ ] Image upload to Firebase Storage
- [ ] Topic/tag multi-select
- [ ] Status selector (draft/scheduled/published)
- [ ] Scheduled publishing (date picker)
- [ ] SEO fields
- [ ] Autosave draft (every 30s)
- [ ] Form validation
- [ ] Success/error notifications
- [ ] Article list with filters (status, category)
- [ ] Bulk actions (delete, publish)

**Deliverables**:
- `/app/admin/articles/*` pages
- Article editor component
- MDX editor component
- Image upload component

---

#### Task 3.3: Topic Management
**Effort**: 3 days
**Dependencies**: Task 3.1
**Acceptance Criteria**:
- [ ] Topic list with reorder (drag-and-drop)
- [ ] Create/edit/delete topics
- [ ] Featured toggle
- [ ] Article count display
- [ ] Slug auto-generation
- [ ] Validation (unique slugs)

**Deliverables**:
- `/app/admin/topics/page.tsx`
- Topic management components

---

#### Task 3.4: Source Manager
**Effort**: 4 days
**Dependencies**: Task 3.1
**Acceptance Criteria**:
- [ ] Source list page
- [ ] Add/edit RSS source
- [ ] Add manual source
- [ ] Test RSS feed functionality
- [ ] Last fetch timestamp display
- [ ] Active/inactive toggle
- [ ] Fetch interval configuration
- [ ] Validation (valid URL, RSS format)

**Deliverables**:
- `/app/admin/sources/page.tsx`
- Source form components
- RSS parser utility (or Firebase Function)

---

#### Task 3.5: Content Validation System
**Effort**: 3 days
**Dependencies**: Task 3.2
**Acceptance Criteria**:
- [ ] Validation rules engine
- [ ] Required fields checker
- [ ] SEO score calculator
- [ ] Image size/format checker
- [ ] Duplicate slug detection
- [ ] Validation UI in editor
- [ ] Warnings vs. errors distinction

**Deliverables**:
- Validation utilities
- Validation UI components

---

#### Task 3.6: Scheduled Publishing
**Effort**: 2 days
**Dependencies**: Task 3.2
**Acceptance Criteria**:
- [ ] Firebase Function (cron job) to publish scheduled articles
- [ ] Runs every hour
- [ ] Updates status from 'scheduled' to 'published'
- [ ] Email notification to author (optional)
- [ ] Logging for debugging

**Deliverables**:
- Firebase Function: `scheduledPublish`
- Function deployment

---

#### Task 3.7: Newsletter Builder (MVP)
**Effort**: 4 days
**Dependencies**: Task 3.1
**Acceptance Criteria**:
- [ ] Create newsletter issue
- [ ] Select articles for issue
- [ ] Reorder articles
- [ ] Preview newsletter layout
- [ ] Publish to archive (creates newsletter document)
- [ ] Basic email template
- [ ] Send test email (Firebase Function)

**Deliverables**:
- `/app/admin/newsletters/*` pages
- Newsletter builder components
- Email template

---

## 5. Milestone Timeline

### **Milestone 1: Foundation Ready** (End of Week 3)
**Goals**:
- Development environment fully configured
- Firebase services connected and tested
- Authentication working
- Basic UI component library ready
- Data layer utilities implemented

**Key Deliverables**:
- Running Next.js app with Firebase
- Login/logout functionality
- Design system documented
- Firestore CRUD utilities

**Success Metrics**:
- Admin can log in
- Can create/read Firestore documents
- All UI components render correctly

---

### **Milestone 2: Public Site Launch** (End of Week 8)
**Goals**:
- All public-facing pages complete
- Content rendering from Firestore
- SEO optimized
- Responsive design
- Ready for beta testing

**Key Deliverables**:
- Home, News, Guides, Tools, Topics, About, Newsletter pages
- Article detail pages with MDX rendering
- Newsletter signup functional
- Search and filtering working

**Success Metrics**:
- Lighthouse score: 90+ (Performance, SEO, Accessibility)
- Mobile-responsive on all pages
- Sub-2s page load time
- Zero console errors

---

### **Milestone 3: Admin Dashboard Complete (MVP)** (End of Week 12)
**Goals**:
- Full content management system
- Editors can create/edit/publish articles
- Topic and source management working
- Scheduled publishing functional
- Basic newsletter builder operational

**Key Deliverables**:
- Article editor with MDX preview
- Image upload to Firebase Storage
- Topic taxonomy management
- Source manager with RSS support
- Scheduled publishing automation
- Content validation system
- Newsletter creation and archive

**Success Metrics**:
- Editors can publish an article end-to-end in < 10 minutes
- Zero data loss (autosave working)
- Validation catches common errors
- Scheduled articles publish on time
- Newsletter archive displays correctly

---

## 6. Dependencies

### External Dependencies
- Firebase SDK v10+
- Next.js 15+
- React 19+
- TypeScript 5+
- Tailwind CSS 4+
- MDX libraries: `next-mdx-remote` or `@next/mdx`
- Form handling: `react-hook-form` + `zod`
- Date handling: `date-fns` or `dayjs`
- RSS parsing: `rss-parser` (for Firebase Functions)
- Rich text editor: `@monaco-editor/react` or simple textarea with preview

### Internal Dependencies
```
Phase 1 (Foundation)
    ↓
Phase 2 (Public Site) ← Must complete Task 1.2, 1.4
    ↓
Phase 3 (Admin) ← Must complete Task 1.3, Phase 2
```

### Critical Path
1. Project Setup (Task 1.1) → Everything depends on this
2. Auth Setup (Task 1.3) → Admin features depend on this
3. Firestore Layer (Task 1.4) → All data operations depend on this
4. Article Pages (Task 2.2) → Admin editor depends on this structure
5. Article Editor (Task 3.2) → Core admin functionality

---

## 7. Risk Assessment

### High Risk
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Firebase quota limits on free tier | High | Monitor usage, plan for Blaze upgrade |
| MDX security vulnerabilities | High | Sanitize input, use trusted MDX library |
| Scheduled publish function failures | Medium | Add retry logic, logging, monitoring |

### Medium Risk
| Risk | Impact | Mitigation |
|------|--------|-----------|
| RSS feed parsing inconsistencies | Medium | Robust error handling, manual fallback |
| Image storage costs | Medium | Compress images, set size limits |
| SEO not indexing dynamic routes | Medium | Use SSG where possible, submit sitemap |

### Low Risk
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Browser compatibility issues | Low | Use Next.js polyfills, test on modern browsers |
| Newsletter delivery issues | Low | Use transactional email service (SendGrid/Mailgun) |

---

## 8. Post-MVP Enhancements (Future)

- **Advanced Search**: Algolia or Elasticsearch integration
- **Analytics**: Google Analytics, content performance dashboard
- **Social Features**: Comments (Disqus or custom), likes, bookmarks
- **Advanced Newsletter**: Email service integration (SendGrid), subscriber management
- **Content Workflow**: Draft → Review → Publish with approval flow
- **Media Library**: Advanced asset management
- **Multi-language Support**: i18n implementation
- **Performance**: Advanced caching strategies, CDN for images
- **Advanced RSS**: Auto-draft creation from RSS feeds
- **API**: Public REST API for content access

---

## 9. Technical Decisions & Rationale

### Why Next.js App Router?
- Server Components reduce client bundle size
- Built-in SEO optimization
- Streaming and Suspense for better UX
- File-based routing simplifies structure

### Why Firebase?
- Rapid development with managed services
- Real-time updates (optional for future)
- Built-in authentication
- Generous free tier
- Easy hosting deployment

### Why MDX?
- Rich content with React components
- Better than plain Markdown for interactive content
- Type-safe with TypeScript
- Syntax highlighting support

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Smaller CSS bundle (purged unused styles)
- Great DX with IntelliSense

---

## 10. Acceptance Criteria Summary

### Public Site
✅ Home page loads in < 2s  
✅ All articles render MDX correctly  
✅ Search returns relevant results  
✅ Mobile navigation works on all devices  
✅ Newsletter signup saves to Firestore  
✅ SEO meta tags present on all pages  
✅ Images are optimized and lazy-loaded  
✅ 404 pages handle invalid routes  

### Admin Dashboard
✅ Only authenticated admins can access  
✅ Article editor saves drafts automatically  
✅ Image upload works and returns storage URL  
✅ Topics can be reordered  
✅ RSS sources can be tested before saving  
✅ Scheduled articles publish at correct time  
✅ Validation prevents publishing incomplete articles  
✅ Newsletter builder creates archive pages  

### Performance
✅ Lighthouse score > 90 (all categories)  
✅ First Contentful Paint < 1.5s  
✅ Time to Interactive < 3s  
✅ No console errors in production  

---

## 11. Getting Started (For Developers)

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git
- Code editor (VS Code recommended)

### Initial Setup Commands
```bash
# Clone and install
git clone <repo-url>
cd tech_highlight
npm install

# Firebase setup
firebase login
firebase init

# Environment variables
cp .env.example .env.local
# Add Firebase config to .env.local

# Run development server
npm run dev
```

### Development Workflow
1. Create feature branch from `main`
2. Implement feature with tests
3. Test locally
4. Submit PR for review
5. Deploy to Firebase Hosting after merge

---

## 12. Success Metrics (MVP)

**By End of Week 12:**
- ✅ 50+ articles published (seeded)
- ✅ 10+ topics created
- ✅ 5+ RSS sources configured
- ✅ 2+ newsletter issues in archive
- ✅ Admin can publish article in < 10 minutes
- ✅ Public site loads in < 2 seconds
- ✅ Zero critical bugs

---

**Document Version**: 1.0  
**Last Updated**: November 7, 2025  
**Author**: Senior Architect  
**Status**: Approved for Implementation

