# TechHighlight - Acceptance Criteria Checklist

Use this checklist to verify MVP completion. Each milestone has specific acceptance criteria that must be met before moving to the next phase.

---

## 📋 Milestone 1: Foundation Ready (End of Week 3)

### Task 1.1: Project Setup & Configuration
- [ ] Next.js 15 project initialized with TypeScript
- [ ] Tailwind CSS configured with custom theme (colors, fonts, spacing)
- [ ] Firebase project created (Firestore, Auth, Storage, Hosting)
- [ ] Environment variables configured in `.env.local`
- [ ] ESLint + Prettier setup with pre-commit hooks
- [ ] Git repository initialized with proper `.gitignore`
- [ ] Basic folder structure created per `FILE_TREE.md`
- [ ] Firebase Admin SDK configured for server-side operations
- [ ] `npm run dev` starts without errors
- [ ] Firebase connection test successful (read/write test document)
- [ ] README.md has complete setup instructions

### Task 1.2: Design System & UI Components
- [ ] Color palette defined in `tailwind.config.ts`
- [ ] Typography scale configured (headings, body text)
- [ ] Button component (primary, secondary, outline variants)
- [ ] Input component (text, email, password types)
- [ ] Textarea component
- [ ] Select component (Radix UI based)
- [ ] Card component with header/body/footer
- [ ] Badge component (status, category badges)
- [ ] Modal/Dialog component
- [ ] Toast notification system working
- [ ] Header component (logo, navigation)
- [ ] Footer component (links, copyright)
- [ ] Container component (max-width wrapper)
- [ ] Mobile navigation menu (hamburger → drawer)
- [ ] Loading skeleton components
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All components documented with prop types

### Task 1.3: Firebase Authentication Setup
- [ ] Firebase Auth initialized in `lib/firebase/client.ts`
- [ ] Auth context provider created
- [ ] `useAuth` hook available
- [ ] Login page at `/admin/login` functional
- [ ] Email/password sign-in working
- [ ] Logout functionality working
- [ ] Session persistence configured
- [ ] Protected route middleware in `middleware.ts`
- [ ] Admin-only route guards active for `/admin/*`
- [ ] User role stored in Firestore `users` collection
- [ ] Role-based access control (admin vs. editor)
- [ ] Auth error handling (wrong password, user not found)
- [ ] Loading states during auth operations
- [ ] Redirect after login to `/admin` dashboard

### Task 1.4: Firestore Data Layer
- [ ] Firestore initialized in `lib/firebase/client.ts` and `lib/firebase/admin.ts`
- [ ] TypeScript types defined in `/types` for all collections
- [ ] `articles` collection CRUD functions
- [ ] `sources` collection CRUD functions
- [ ] `topics` collection CRUD functions
- [ ] `newsletters` collection CRUD functions
- [ ] `users` collection CRUD functions
- [ ] Zod validation schemas for all data models
- [ ] Query helpers (pagination, filtering by category/topic)
- [ ] Error handling utilities (try-catch wrappers)
- [ ] Firestore security rules file created
- [ ] Security rules deployed to Firebase
- [ ] Test data added to Firestore (at least 10 articles, 5 topics)

---

## 📋 Milestone 2: Public Site Launch (End of Week 8)

### Task 2.1: Home Page
- [ ] Hero section with featured article display
- [ ] Featured article fetched from Firestore (status: 'published')
- [ ] Latest news grid (6-8 article cards)
- [ ] Featured topics section (4-6 topics)
- [ ] Newsletter signup form (email input + submit)
- [ ] Newsletter signup saves to Firestore (or email service)
- [ ] Success/error toast notifications
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] SEO meta tags (title, description, og:image)
- [ ] Loading states while fetching data
- [ ] Error boundaries for failed data fetches
- [ ] Page loads in < 2 seconds (tested with throttling)

### Task 2.2: Article Pages (Dynamic Routes)
- [ ] Dynamic route `/articles/[slug]` created
- [ ] Article fetched by slug from Firestore
- [ ] 404 page shown for invalid slugs
- [ ] Article title, summary, cover image displayed
- [ ] Author name and publish date shown
- [ ] Topics displayed as badges/links
- [ ] MDX body rendered correctly
- [ ] Code blocks have syntax highlighting
- [ ] Images in MDX load properly
- [ ] Related articles section (3-4 articles from same topics)
- [ ] Social share buttons (Twitter, LinkedIn, Facebook)
- [ ] Reading progress indicator (scroll-based bar)
- [ ] Dynamic SEO meta tags (title from article, description from summary)
- [ ] Open Graph tags for social sharing
- [ ] Static generation (SSG) for published articles
- [ ] Incremental Static Regeneration (ISR) configured
- [ ] Mobile-responsive article layout

### Task 2.3: News, Guides, Tools Listing Pages
- [ ] `/news` page shows all news articles
- [ ] `/guides` page shows all guide articles
- [ ] `/tools` page shows tool articles
- [ ] Articles filtered by category (Firestore query)
- [ ] Paginated list (12 articles per page)
- [ ] Pagination component (previous/next, page numbers)
- [ ] Filter by topic (dropdown or sidebar)
- [ ] Search bar (client-side text search initially)
- [ ] Sort options (newest first, oldest first)
- [ ] Empty state when no articles found
- [ ] Loading skeletons while fetching
- [ ] Article cards show: image, title, summary, date, topics
- [ ] SEO meta tags for category pages
- [ ] Breadcrumb navigation

### Task 2.4: Topics System
- [ ] `/topics` page lists all topics
- [ ] Topics displayed as grid of cards
- [ ] Each topic card shows: name, description, article count
- [ ] `/topics/[slug]` page shows topic details
- [ ] Topic detail page lists all articles with that topic
- [ ] Breadcrumb: Home > Topics > [Topic Name]
- [ ] Topic description displayed at top
- [ ] Articles sorted by publish date (newest first)
- [ ] Pagination for topic articles
- [ ] SEO meta tags for topic pages
- [ ] Featured topics highlighted (if `featured: true`)

### Task 2.5: Newsletter Archive
- [ ] `/newsletter` page lists past newsletter issues
- [ ] Issues sorted by issue number (newest first)
- [ ] Each issue card shows: issue number, title, date
- [ ] `/newsletter/[issueNumber]` shows individual issue
- [ ] Issue detail page displays: intro, list of articles
- [ ] Article links within issue are clickable
- [ ] Subscribe form on archive page
- [ ] Subscribe form saves email to Firestore
- [ ] Email template preview (HTML/plain text)
- [ ] SEO meta tags for newsletter pages

### Task 2.6: About & Static Pages
- [ ] `/about` page with mission statement, team info
- [ ] Contact form on About page
- [ ] Contact form saves to Firestore (or sends email)
- [ ] `/privacy` page with privacy policy
- [ ] `/terms` page with terms of service
- [ ] All static pages have proper navigation
- [ ] SEO meta tags for static pages

---

## 📋 Milestone 3: Admin Dashboard Complete (End of Week 12)

### Task 3.1: Admin Dashboard Layout
- [ ] `/admin` route protected by auth middleware
- [ ] Admin sidebar navigation component
- [ ] Sidebar links: Dashboard, Articles, Topics, Sources, Newsletters
- [ ] Dashboard overview page with statistics
- [ ] Content statistics cards (total articles, drafts, published, scheduled)
- [ ] Recent activity feed (last 10 article updates)
- [ ] Quick action buttons (New Article, New Topic)
- [ ] User profile dropdown (name, email, logout)
- [ ] Responsive admin layout (collapsible sidebar on mobile)

### Task 3.2: Article Editor (CRUD)
- [ ] `/admin/articles` page lists all articles
- [ ] Article list shows: title, status, category, publish date, actions
- [ ] Filter articles by status (all, draft, scheduled, published)
- [ ] Filter articles by category (news, guides, tools)
- [ ] Search articles by title
- [ ] `/admin/articles/new` page for creating new article
- [ ] Article form fields: title, slug, summary, category, body (MDX)
- [ ] Slug auto-generated from title (editable)
- [ ] MDX editor with split view (edit | preview)
- [ ] Image upload for cover image
- [ ] Image uploaded to Firebase Storage
- [ ] Topic multi-select (checkboxes or dropdown)
- [ ] Tag input (comma-separated or autocomplete)
- [ ] Status selector (draft, scheduled, published)
- [ ] Scheduled publish date picker (if status = scheduled)
- [ ] Source reference selector (optional)
- [ ] SEO fields (meta title, meta description)
- [ ] Form validation (required fields, slug uniqueness)
- [ ] Validation errors shown inline
- [ ] Autosave draft every 30 seconds
- [ ] Autosave indicator (last saved timestamp)
- [ ] Save draft button
- [ ] Publish button (sets status to published)
- [ ] Cancel button (return to article list)
- [ ] `/admin/articles/[id]` page for editing existing article
- [ ] Pre-filled form with existing data
- [ ] Delete article functionality (with confirmation)
- [ ] Bulk actions (select multiple articles, publish/delete)
- [ ] Success/error toast notifications
- [ ] Loading states during save/publish

### Task 3.3: Topic Management
- [ ] `/admin/topics` page lists all topics
- [ ] Topic list shows: name, slug, article count, featured status, order
- [ ] Create new topic form
- [ ] Topic form fields: name, slug, description, featured (boolean)
- [ ] Slug auto-generated from name (editable)
- [ ] Validation (unique slug, required name)
- [ ] Edit topic (inline or separate page)
- [ ] Delete topic (with confirmation, check for articles using it)
- [ ] Drag-and-drop to reorder topics
- [ ] Order saved to Firestore (`order` field)
- [ ] Featured toggle (switch component)
- [ ] Article count displayed (computed from Firestore)
- [ ] Success/error notifications

### Task 3.4: Source Manager
- [ ] `/admin/sources` page lists all sources
- [ ] Source list shows: name, URL, type (RSS/manual), active status, last fetched
- [ ] `/admin/sources/new` page for adding new source
- [ ] Source form fields: name, URL, type (RSS or manual)
- [ ] RSS feed validation (test URL returns valid RSS)
- [ ] Fetch interval configuration (hours)
- [ ] Active/inactive toggle
- [ ] Edit source functionality
- [ ] Delete source (with confirmation)
- [ ] Test RSS feed button (preview latest items)
- [ ] Last fetched timestamp display
- [ ] Manual refresh button (fetch RSS now)
- [ ] Error handling for invalid RSS feeds
- [ ] Success/error notifications

### Task 3.5: Content Validation System
- [ ] Validation rules engine created
- [ ] Required fields checker (title, slug, summary, body, category)
- [ ] Duplicate slug detection (check Firestore)
- [ ] SEO score calculator (title length, description length, keywords)
- [ ] Image validation (size < 5MB, format: jpg/png/webp)
- [ ] Validation results displayed in article editor
- [ ] Validation panel shows warnings vs. errors
- [ ] Errors prevent publishing (must fix first)
- [ ] Warnings allow publishing (optional fixes)
- [ ] Real-time validation as user types

### Task 3.6: Scheduled Publishing
- [ ] Firebase Function `scheduledPublish` created
- [ ] Function runs every hour (cron schedule)
- [ ] Function queries articles with `status: 'scheduled'` and `publishedAt <= now`
- [ ] Updates status to `'published'`
- [ ] Logs published articles (Cloud Functions logs)
- [ ] Email notification to author (optional)
- [ ] Error handling and retry logic
- [ ] Function deployed to Firebase
- [ ] Manual trigger test (via Firebase Console)
- [ ] Scheduled articles appear on public site after publish time

### Task 3.7: Newsletter Builder (MVP)
- [ ] `/admin/newsletters` page lists all newsletters
- [ ] Newsletter list shows: issue number, title, publish date, status
- [ ] `/admin/newsletters/new` page for creating newsletter
- [ ] Newsletter form fields: title, intro, issue number (auto-increment)
- [ ] Article selector (checkboxes from published articles)
- [ ] Reorder selected articles (drag-and-drop)
- [ ] Custom note for each article (optional)
- [ ] Preview newsletter layout
- [ ] Email template created (HTML + plain text)
- [ ] Publish to archive button (creates newsletter document in Firestore)
- [ ] Published newsletters appear on `/newsletter` page
- [ ] Send test email functionality (to admin's email)
- [ ] Email sending via Firebase Function (SendGrid/Mailgun)
- [ ] Success/error notifications

---

## 🎯 Overall MVP Acceptance Criteria

### Functionality
- [ ] All public pages load without errors
- [ ] All admin pages load without errors
- [ ] Admin can log in and log out
- [ ] Admin can create, edit, delete articles
- [ ] Admin can create, edit, delete topics
- [ ] Admin can create, edit, delete sources
- [ ] Admin can create newsletters
- [ ] Articles render MDX correctly
- [ ] Images upload and display correctly
- [ ] Search returns relevant results
- [ ] Pagination works on all listing pages
- [ ] Newsletter signup saves to database
- [ ] Scheduled articles publish automatically

### Performance
- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (SEO)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Page size < 500KB (gzipped)

### SEO
- [ ] All pages have unique meta titles
- [ ] All pages have meta descriptions
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Sitemap.xml generated and accessible
- [ ] Robots.txt configured
- [ ] Structured data (JSON-LD) for articles
- [ ] Semantic HTML (headings, nav, main, footer)

### Responsive Design
- [ ] Mobile (320px-768px): All pages usable
- [ ] Tablet (768px-1024px): All pages usable
- [ ] Desktop (1024px+): All pages usable
- [ ] Navigation adapts (hamburger menu on mobile)
- [ ] Images responsive (srcset or next/image)
- [ ] Forms usable on mobile
- [ ] Admin dashboard usable on tablet

### Security
- [ ] Admin routes protected (redirect to login if not authenticated)
- [ ] Firestore security rules deployed
- [ ] Only admins can write to Firestore
- [ ] Storage rules: authenticated users only for uploads
- [ ] XSS prevention (MDX sanitization)
- [ ] CSRF protection (Next.js built-in)
- [ ] Environment variables not exposed to client

### Accessibility
- [ ] Keyboard navigation works on all pages
- [ ] Focus indicators visible
- [ ] Screen reader compatible (ARIA labels)
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Color contrast ratio > 4.5:1 (WCAG AA)
- [ ] No errors in axe DevTools

### Testing
- [ ] Unit tests for utility functions (slug, date, validation)
- [ ] Integration tests for Firestore operations
- [ ] E2E test: Public user browses site
- [ ] E2E test: Admin logs in, creates article, publishes
- [ ] E2E test: Scheduled article publishes
- [ ] All tests passing (`npm test`)

### Documentation
- [ ] README.md complete with setup instructions
- [ ] PROJECT_PLAN.md reviewed and approved
- [ ] FILE_TREE.md matches actual structure
- [ ] DEPENDENCIES.md lists all dependencies
- [ ] Code comments for complex logic
- [ ] API documentation (if public API exists)

### Deployment
- [ ] Firebase project configured
- [ ] Firestore database set up (collections created)
- [ ] Storage bucket configured
- [ ] Cloud Functions deployed
- [ ] Hosting deployed (production site accessible)
- [ ] Environment variables set in Firebase
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

---

## ✅ Definition of Done (Per Task)

A task is considered complete when:
1. **Functionality**: All acceptance criteria met
2. **Code Quality**: Passes ESLint, TypeScript check
3. **Testing**: Unit tests written and passing
4. **Documentation**: Code commented, README updated
5. **Review**: Code reviewed by peer (if team)
6. **Deployed**: Changes deployed to staging/production

---

## 🚦 Sign-Off Checklist (Before Launch)

**Technical Lead**:
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Performance metrics achieved
- [ ] Security audit passed

**Product Owner**:
- [ ] All features working as expected
- [ ] Content can be managed easily
- [ ] User flows tested
- [ ] Design approved

**QA**:
- [ ] All tests passing
- [ ] Manual testing complete
- [ ] No critical bugs
- [ ] Accessibility verified

**DevOps**:
- [ ] Production deployment successful
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Rollback plan ready

---

**Version**: 1.0  
**Last Updated**: November 7, 2025  
**Status**: Ready for Development

