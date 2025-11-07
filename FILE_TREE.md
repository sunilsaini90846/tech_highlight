# TechHighlight - File Tree Structure

```
tech_highlight/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml                    # Firebase deploy on push to main
│       └── test.yml                      # Run tests on PR
│
├── app/                                  # Next.js 15 App Router
│   ├── (public)/                         # Public route group
│   │   ├── layout.tsx                    # Public layout (header, footer)
│   │   ├── page.tsx                      # Home page
│   │   │
│   │   ├── news/
│   │   │   ├── page.tsx                  # News listing
│   │   │   └── loading.tsx               # Loading state
│   │   │
│   │   ├── guides/
│   │   │   ├── page.tsx                  # Guides listing
│   │   │   └── loading.tsx
│   │   │
│   │   ├── tools/
│   │   │   ├── page.tsx                  # Tools directory
│   │   │   └── loading.tsx
│   │   │
│   │   ├── topics/
│   │   │   ├── page.tsx                  # All topics
│   │   │   └── [slug]/
│   │   │       ├── page.tsx              # Topic detail with articles
│   │   │       └── loading.tsx
│   │   │
│   │   ├── articles/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx              # Article detail page
│   │   │       ├── loading.tsx
│   │   │       └── not-found.tsx         # 404 for invalid article
│   │   │
│   │   ├── newsletter/
│   │   │   ├── page.tsx                  # Newsletter archive
│   │   │   └── [issueNumber]/
│   │   │       └── page.tsx              # Individual newsletter issue
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx                  # About page
│   │   │
│   │   ├── privacy/
│   │   │   └── page.tsx                  # Privacy policy
│   │   │
│   │   └── terms/
│   │       └── page.tsx                  # Terms of service
│   │
│   ├── admin/                            # Admin route group (protected)
│   │   ├── layout.tsx                    # Admin layout (sidebar, auth check)
│   │   ├── page.tsx                      # Admin dashboard
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                  # Admin login page
│   │   │
│   │   ├── articles/
│   │   │   ├── page.tsx                  # Article list (with filters)
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Create new article
│   │   │   └── [id]/
│   │   │       ├── page.tsx              # Edit article
│   │   │       └── preview/
│   │   │           └── page.tsx          # Preview article
│   │   │
│   │   ├── topics/
│   │   │   ├── page.tsx                  # Topic management
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Edit topic
│   │   │
│   │   ├── sources/
│   │   │   ├── page.tsx                  # Source manager list
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Add new source
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Edit source
│   │   │
│   │   ├── newsletters/
│   │   │   ├── page.tsx                  # Newsletter list
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Create newsletter
│   │   │   └── [id]/
│   │   │       ├── page.tsx              # Edit newsletter
│   │   │       └── preview/
│   │   │           └── page.tsx          # Preview email
│   │   │
│   │   └── settings/
│   │       └── page.tsx                  # Admin settings
│   │
│   ├── api/                              # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts              # Auth endpoints (if using NextAuth)
│   │   │
│   │   ├── articles/
│   │   │   ├── route.ts                  # List/create articles
│   │   │   └── [id]/
│   │   │       └── route.ts              # Get/update/delete article
│   │   │
│   │   ├── upload/
│   │   │   └── route.ts                  # Image upload handler
│   │   │
│   │   ├── newsletter/
│   │   │   └── subscribe/
│   │   │       └── route.ts              # Newsletter subscription
│   │   │
│   │   └── webhooks/
│   │       └── rss/
│   │           └── route.ts              # RSS feed webhook (if needed)
│   │
│   ├── layout.tsx                        # Root layout (metadata, providers)
│   ├── loading.tsx                       # Root loading state
│   ├── error.tsx                         # Error boundary
│   ├── not-found.tsx                     # 404 page
│   └── globals.css                       # Global styles + Tailwind imports
│
├── components/
│   ├── ui/                               # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── spinner.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   └── tooltip.tsx
│   │
│   ├── layout/                           # Layout components
│   │   ├── header.tsx                    # Public header
│   │   ├── footer.tsx                    # Public footer
│   │   ├── navigation.tsx                # Main navigation
│   │   ├── mobile-menu.tsx               # Mobile navigation
│   │   ├── container.tsx                 # Content container
│   │   ├── admin-sidebar.tsx             # Admin sidebar
│   │   └── breadcrumbs.tsx               # Breadcrumb navigation
│   │
│   ├── article/                          # Article-related components
│   │   ├── article-card.tsx              # Article preview card
│   │   ├── article-grid.tsx              # Grid of article cards
│   │   ├── article-header.tsx            # Article page header
│   │   ├── article-body.tsx              # MDX renderer
│   │   ├── article-meta.tsx              # Author, date, topics
│   │   ├── related-articles.tsx          # Related articles section
│   │   ├── reading-progress.tsx          # Reading progress bar
│   │   ├── share-buttons.tsx             # Social share buttons
│   │   └── article-search.tsx            # Search component
│   │
│   ├── editor/                           # Admin editor components
│   │   ├── mdx-editor.tsx                # MDX editor with preview
│   │   ├── image-uploader.tsx            # Image upload component
│   │   ├── topic-selector.tsx            # Multi-select topics
│   │   ├── tag-input.tsx                 # Tag input with autocomplete
│   │   ├── status-selector.tsx           # Draft/scheduled/published
│   │   ├── date-picker.tsx               # Publish date picker
│   │   ├── seo-fields.tsx                # SEO meta fields
│   │   ├── validation-panel.tsx          # Validation results display
│   │   └── autosave-indicator.tsx        # Autosave status
│   │
│   ├── topic/                            # Topic components
│   │   ├── topic-card.tsx                # Topic card
│   │   ├── topic-grid.tsx                # Grid of topics
│   │   ├── topic-badge.tsx               # Small topic badge
│   │   └── topic-selector.tsx            # Topic filter dropdown
│   │
│   ├── newsletter/                       # Newsletter components
│   │   ├── newsletter-form.tsx           # Subscribe form
│   │   ├── newsletter-card.tsx           # Newsletter issue card
│   │   ├── newsletter-builder.tsx        # Admin newsletter builder
│   │   └── newsletter-preview.tsx        # Email preview
│   │
│   ├── admin/                            # Admin-specific components
│   │   ├── dashboard-stats.tsx           # Stats cards
│   │   ├── content-table.tsx             # Data table with actions
│   │   ├── source-list.tsx               # RSS source list
│   │   ├── source-form.tsx               # Add/edit source form
│   │   ├── topic-manager.tsx             # Topic CRUD interface
│   │   ├── drag-drop-list.tsx            # Reorderable list
│   │   └── bulk-actions.tsx              # Bulk action toolbar
│   │
│   ├── home/                             # Home page sections
│   │   ├── hero-section.tsx              # Hero with featured article
│   │   ├── latest-news.tsx               # Latest news section
│   │   ├── featured-topics.tsx           # Featured topics grid
│   │   └── newsletter-cta.tsx            # Newsletter signup CTA
│   │
│   └── common/                           # Common components
│       ├── search-bar.tsx                # Global search
│       ├── pagination.tsx                # Pagination component
│       ├── empty-state.tsx               # Empty state placeholder
│       ├── error-message.tsx             # Error display
│       ├── filter-bar.tsx                # Filter controls
│       └── back-button.tsx               # Navigation back button
│
├── lib/
│   ├── firebase/
│   │   ├── admin.ts                      # Firebase Admin SDK (server)
│   │   ├── client.ts                     # Firebase Client SDK
│   │   ├── auth.ts                       # Auth utilities
│   │   ├── storage.ts                    # Storage utilities
│   │   │
│   │   ├── collections/                  # Firestore collection modules
│   │   │   ├── articles.ts               # Article CRUD operations
│   │   │   ├── sources.ts                # Source CRUD operations
│   │   │   ├── topics.ts                 # Topic CRUD operations
│   │   │   ├── newsletters.ts            # Newsletter CRUD operations
│   │   │   └── users.ts                  # User CRUD operations
│   │   │
│   │   └── queries/                      # Complex Firestore queries
│   │       ├── get-articles-by-topic.ts
│   │       ├── get-featured-articles.ts
│   │       ├── get-latest-news.ts
│   │       ├── get-related-articles.ts
│   │       └── search-articles.ts
│   │
│   ├── mdx/
│   │   ├── serialize.ts                  # MDX serialization
│   │   ├── components.tsx                # Custom MDX components
│   │   └── plugins.ts                    # MDX plugins (syntax highlight)
│   │
│   ├── validation/
│   │   ├── schemas.ts                    # Zod schemas
│   │   ├── article-validator.ts          # Article validation rules
│   │   ├── seo-validator.ts              # SEO score calculator
│   │   └── image-validator.ts            # Image validation
│   │
│   ├── utils/
│   │   ├── date.ts                       # Date formatting utilities
│   │   ├── slug.ts                       # Slug generation
│   │   ├── seo.ts                        # SEO meta tag helpers
│   │   ├── image.ts                      # Image optimization helpers
│   │   ├── string.ts                     # String utilities
│   │   └── cn.ts                         # className utility (clsx + twMerge)
│   │
│   └── hooks/
│       ├── use-auth.ts                   # Auth context hook
│       ├── use-toast.ts                  # Toast notifications hook
│       ├── use-pagination.ts             # Pagination logic hook
│       ├── use-debounce.ts               # Debounce hook
│       ├── use-autosave.ts               # Autosave hook
│       └── use-media-query.ts            # Responsive breakpoint hook
│
├── types/
│   ├── index.ts                          # Main types export
│   ├── article.ts                        # Article types
│   ├── source.ts                         # Source types
│   ├── topic.ts                          # Topic types
│   ├── newsletter.ts                     # Newsletter types
│   ├── user.ts                           # User types
│   └── common.ts                         # Common types (Status, etc.)
│
├── context/
│   ├── auth-context.tsx                  # Auth context provider
│   ├── toast-context.tsx                 # Toast notifications provider
│   └── theme-context.tsx                 # Theme provider (optional)
│
├── middleware.ts                         # Next.js middleware (auth checks)
│
├── firebase/
│   ├── functions/                        # Firebase Cloud Functions
│   │   ├── src/
│   │   │   ├── index.ts                  # Functions entry point
│   │   │   ├── scheduled-publish.ts      # Cron job for scheduled articles
│   │   │   ├── rss-fetcher.ts            # Fetch RSS feeds
│   │   │   ├── send-newsletter.ts        # Send newsletter email
│   │   │   └── on-article-create.ts      # Trigger on article creation
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── firestore.rules                   # Firestore security rules
│   ├── firestore.indexes.json            # Firestore indexes
│   ├── storage.rules                     # Storage security rules
│   └── firebase.json                     # Firebase config
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-bg.jpg
│   │   └── placeholder.png
│   │
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   │
│   ├── robots.txt
│   ├── sitemap.xml                       # Generated sitemap
│   └── manifest.json                     # PWA manifest (optional)
│
├── styles/
│   └── mdx.css                           # MDX content styles
│
├── scripts/
│   ├── seed-data.ts                      # Seed database with sample data
│   ├── generate-sitemap.ts               # Generate sitemap
│   └── migrate-slugs.ts                  # Data migration script (example)
│
├── tests/
│   ├── unit/
│   │   ├── utils/
│   │   │   └── slug.test.ts
│   │   └── validation/
│   │       └── article-validator.test.ts
│   │
│   ├── integration/
│   │   └── firebase/
│   │       └── articles.test.ts
│   │
│   └── e2e/
│       ├── public-site.spec.ts
│       └── admin-flow.spec.ts
│
├── .env.example                          # Example environment variables
├── .env.local                            # Local environment variables (gitignored)
├── .eslintrc.json                        # ESLint config
├── .gitignore
├── .prettierrc                           # Prettier config
├── next.config.js                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind CSS config
├── tsconfig.json                         # TypeScript config
├── package.json
├── package-lock.json
├── README.md                             # Project documentation
├── PROJECT_PLAN.md                       # This planning document
└── FILE_TREE.md                          # This file tree document
```

---

## Key Directory Explanations

### `/app` (Next.js App Router)
- **(public)**: Route group for public pages (shares layout)
- **admin**: Protected admin section with separate layout
- **api**: API route handlers for server-side operations

### `/components`
- **ui**: Atomic design primitives (buttons, inputs, etc.)
- **layout**: Page structure components
- **article, topic, newsletter**: Feature-specific components
- **editor**: Admin editor-specific components
- **home**: Home page sections

### `/lib`
- **firebase**: All Firebase-related code (auth, Firestore, storage)
- **mdx**: MDX processing and custom components
- **validation**: Data validation and business rules
- **utils**: General utility functions
- **hooks**: Custom React hooks

### `/firebase`
- **functions**: Cloud Functions (scheduled tasks, background jobs)
- Security rules for Firestore and Storage
- Firebase configuration

### `/types`
- TypeScript type definitions for all data models
- Keeps types consistent across the app

### `/context`
- React Context providers for global state (auth, theme, etc.)

---

## Important Files

### Environment Variables (`.env.local`)
```bash
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Firebase Admin (server-side only)
FIREBASE_ADMIN_PROJECT_ID=xxx
FIREBASE_ADMIN_CLIENT_EMAIL=xxx
FIREBASE_ADMIN_PRIVATE_KEY=xxx

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Email Service (for newsletters)
SENDGRID_API_KEY=xxx
```

### Middleware (`middleware.ts`)
```typescript
// Protect admin routes, redirect unauthenticated users
export { default } from "next-auth/middleware"
export const config = { matcher: ["/admin/:path*"] }
```

### Tailwind Config (`tailwind.config.ts`)
```typescript
// Custom theme: colors, fonts, breakpoints
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { /* custom colors */ },
      fontFamily: { /* custom fonts */ },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
```

### Next.js Config (`next.config.js`)
```javascript
module.exports = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  experimental: {
    mdxRs: true,
  },
}
```

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `ArticleCard.tsx`)
- **Utilities**: kebab-case (e.g., `slug-generator.ts`)
- **Pages**: Next.js App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`)
- **Types**: kebab-case with `.ts` extension (e.g., `article-types.ts`)
- **Tests**: `*.test.ts` or `*.spec.ts`

---

## Code Organization Principles

1. **Colocation**: Keep related files close (e.g., components with their hooks)
2. **Separation of Concerns**: UI components separate from data logic
3. **Reusability**: Extract common patterns into `/components/ui` and `/lib/utils`
4. **Type Safety**: All data models have TypeScript types in `/types`
5. **Server vs. Client**: Clear separation (Server Components by default)

---

**Version**: 1.0  
**Last Updated**: November 7, 2025

