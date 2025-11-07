# Database Documentation - TechHighlight

Complete guide to the TypeScript-first database layer with Zod validation and Firestore converters.

---

## 📦 **Files Created**

### Core Files
1. **`lib/types.ts`** - TypeScript types and Zod schemas
2. **`lib/converters.ts`** - Firestore data converters
3. **`lib/db.ts`** - Typed database helpers
4. **`firestore.indexes.json`** - Composite index definitions

---

## 🎯 **Features**

### ✅ Type Safety
- Strict TypeScript types for all collections
- Separate types for Firestore (with Timestamps) and application (with Dates)
- Full type inference from Zod schemas

### ✅ Runtime Validation
- Zod schemas validate all reads and writes
- Automatic validation in converters
- Helpful error messages for invalid data

### ✅ Firestore Converters
- Automatic Timestamp ↔ Date conversion
- Seamless integration with Firestore queries
- Type-safe document reads and writes

### ✅ Typed Helpers
- CRUD operations for all collections
- Query helpers with filters
- Duplicate checking (slugs, issue numbers)
- Batch operations support

---

## 📚 **Collections**

### 1. Articles
**Path**: `articles/{articleId}`

**Fields**:
```typescript
{
  id: string
  title: string              // Max 200 chars
  slug: string               // URL-friendly, unique
  summary: string            // Max 500 chars
  coverImage?: string        // URL
  body: string               // MDX content
  category: 'news' | 'guide' | 'tool'
  topics: string[]           // Topic IDs
  tags: string[]
  sourceRef?: string         // Source ID
  publishedAt: Date | null
  status: 'draft' | 'scheduled' | 'published'
  authorRef: string          // User ID
  seo: {
    title: string            // Max 60 chars
    description: string      // Max 160 chars
  }
  createdAt: Date
  updatedAt: Date
}
```

### 2. Topics
**Path**: `topics/{topicId}`

**Fields**:
```typescript
{
  id: string
  name: string               // Max 100 chars
  slug: string               // URL-friendly, unique
  description: string        // Max 500 chars
  featured: boolean
  order: number              // For sorting
  articleCount: number       // Computed field
  createdAt: Date
  updatedAt: Date
}
```

### 3. Sources
**Path**: `sources/{sourceId}`

**Fields**:
```typescript
{
  id: string
  name: string               // Max 100 chars
  url: string                // Valid URL
  type: 'rss' | 'manual'
  active: boolean
  lastFetchedAt: Date | null
  fetchInterval: number      // Hours
  createdAt: Date
  updatedAt: Date
}
```

### 4. Newsletters
**Path**: `newsletters/{newsletterId}`

**Fields**:
```typescript
{
  id: string
  issueNumber: number        // Unique, positive integer
  title: string              // Max 200 chars
  intro: string              // Max 1000 chars
  items: Array<{
    articleRef: string       // Article ID
    customNote?: string
  }>
  publishedAt: Date | null
  status: 'draft' | 'sent'
  seo: {
    title: string
    description: string
  }
  createdAt: Date
  updatedAt: Date
}
```

### 5. Users
**Path**: `users/{userId}`

**Fields**:
```typescript
{
  id: string                 // Matches Firebase Auth UID
  displayName: string        // Max 100 chars
  email: string              // Valid email
  role: 'admin' | 'editor' | 'reader'
  createdAt: Date
  lastLoginAt: Date
}
```

---

## 💻 **Usage Examples**

### Import Database Functions

```typescript
import {
  getArticleBySlug,
  listArticles,
  saveArticle,
  updateArticle,
  publishArticle,
  listTopics,
  listNews,
} from '@/lib/db'
```

---

### Articles

#### Get Article by Slug
```typescript
'use client'

const article = await getArticleBySlug('my-article-slug')

if (article) {
  console.log(article.title)
  console.log(article.publishedAt) // Date object, not Timestamp!
}
```

#### List Published Articles
```typescript
const articles = await listArticles({
  status: 'published',
  limit: 10,
  orderBy: 'publishedAt',
  orderDirection: 'desc'
})
```

#### List Articles by Category
```typescript
const guides = await listArticles({
  status: 'published',
  category: 'guide',
  limit: 5
})
```

#### List Articles by Topic
```typescript
const articles = await listArticles({
  status: 'published',
  topic: 'machine-learning', // topic ID
  limit: 10
})
```

#### Create New Article
```typescript
try {
  const articleId = await saveArticle({
    title: 'Introduction to AI',
    slug: 'introduction-to-ai',
    summary: 'A beginner-friendly guide to artificial intelligence.',
    body: '# Introduction\n\nWelcome to AI...',
    category: 'guide',
    topics: ['ai-basics', 'machine-learning'],
    tags: ['beginner', 'tutorial'],
    status: 'draft',
    authorRef: 'user123',
    publishedAt: null,
    seo: {
      title: 'Introduction to AI - TechHighlight',
      description: 'Learn AI basics with our beginner guide'
    }
  })
  
  console.log('Article created:', articleId)
} catch (error) {
  console.error('Validation error:', error.message)
}
```

#### Update Article
```typescript
await updateArticle('article-id', {
  title: 'Updated Title',
  summary: 'Updated summary',
  status: 'scheduled',
  publishedAt: new Date('2025-12-01')
})
```

#### Publish Article
```typescript
// Sets status to 'published' and publishedAt to now
await publishArticle('article-id')
```

---

### Topics

#### List All Topics
```typescript
const topics = await listTopics()
```

#### List Featured Topics Only
```typescript
const featuredTopics = await listTopics({
  featured: true,
  orderBy: 'order',
  orderDirection: 'asc'
})
```

#### Get Topic by Slug
```typescript
const topic = await getTopicBySlug('artificial-intelligence')
```

#### Create New Topic
```typescript
const topicId = await saveTopic({
  name: 'Artificial Intelligence',
  slug: 'artificial-intelligence',
  description: 'Everything about AI',
  featured: true,
  order: 1
})
```

---

### News

#### Get Latest News
```typescript
// Returns published articles with category 'news'
const latestNews = await listNews({ limit: 5 })
```

---

### Sources

#### List Active Sources
```typescript
const activeSources = await listSources(true)
```

#### Create RSS Source
```typescript
const sourceId = await saveSource({
  name: 'TechCrunch AI',
  url: 'https://techcrunch.com/feed/',
  type: 'rss',
  active: true,
  fetchInterval: 24 // hours
})
```

---

### Newsletters

#### List Recent Newsletters
```typescript
const newsletters = await listNewsletters(10)
```

#### Get Newsletter by Issue Number
```typescript
const newsletter = await getNewsletterByIssueNumber(42)
```

#### Create Newsletter
```typescript
const newsletterId = await saveNewsletter({
  issueNumber: 43,
  title: 'Weekly AI Roundup #43',
  intro: 'This week in AI...',
  items: [
    { articleRef: 'article-id-1' },
    { articleRef: 'article-id-2', customNote: 'Must read!' }
  ],
  status: 'draft',
  publishedAt: null,
  seo: {
    title: 'Weekly AI Roundup #43',
    description: 'Top AI news this week'
  }
})
```

---

### Users

#### Get User by ID
```typescript
const user = await getUserById('firebase-auth-uid')
```

#### Create User (after Firebase Auth signup)
```typescript
await saveUser('firebase-auth-uid', {
  displayName: 'John Doe',
  email: 'john@example.com',
  role: 'editor'
})
```

#### Update User Role
```typescript
await updateUser('user-id', {
  role: 'admin'
})
```

#### Update Last Login
```typescript
await updateUserLastLogin('user-id')
```

---

## 🔍 **Query Filters**

### ListArticlesFilters
```typescript
interface ListArticlesFilters {
  limit?: number
  category?: 'news' | 'guide' | 'tool'
  topic?: string              // topic ID
  status?: 'draft' | 'scheduled' | 'published'
  orderBy?: 'createdAt' | 'publishedAt' | 'updatedAt'
  orderDirection?: 'asc' | 'desc'
}
```

### Example: Complex Query
```typescript
const articles = await listArticles({
  status: 'published',
  category: 'guide',
  topic: 'machine-learning',
  limit: 5,
  orderBy: 'publishedAt',
  orderDirection: 'desc'
})
```

---

## 🛡️ **Validation**

### Zod Schemas
All inputs are validated with Zod before writing to Firestore:

```typescript
// This will throw a validation error
await saveArticle({
  title: '', // ❌ Empty string not allowed
  slug: 'Invalid Slug!', // ❌ Must be kebab-case
  summary: 'x'.repeat(501), // ❌ Max 500 chars
  // ... other fields
})
```

### Error Handling
```typescript
try {
  await saveArticle(articleData)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation errors:', error.errors)
  } else {
    console.error('Database error:', error.message)
  }
}
```

---

## 📊 **Firestore Indexes**

### Required Composite Indexes

The `firestore.indexes.json` file defines all necessary composite indexes:

#### 1. Articles by Status + PublishedAt (DESC)
**Use case**: List published articles sorted by date
```typescript
listArticles({
  status: 'published',
  orderBy: 'publishedAt',
  orderDirection: 'desc'
})
```

#### 2. Articles by Topic + PublishedAt (DESC)
**Use case**: List articles in a topic
```typescript
listArticles({
  topic: 'ai-basics',
  orderBy: 'publishedAt',
  orderDirection: 'desc'
})
```

#### 3. Articles by Status + Category + PublishedAt (DESC)
**Use case**: List published guides
```typescript
listArticles({
  status: 'published',
  category: 'guide',
  orderBy: 'publishedAt',
  orderDirection: 'desc'
})
```

#### 4. Newsletters by PublishedAt (DESC)
**Use case**: List newsletters by date
```typescript
listNewsletters(10)
```

### Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

---

## 🔧 **Utility Functions**

### Generate Slug
```typescript
import { generateSlug } from '@/lib/db'

const slug = generateSlug('My Article Title!')
// Returns: 'my-article-title'
```

### Check Slug Uniqueness
```typescript
import { isArticleSlugUnique, isTopicSlugUnique } from '@/lib/db'

const isUnique = await isArticleSlugUnique('my-slug')

// When updating, exclude current article ID
const isUniqueForUpdate = await isArticleSlugUnique('my-slug', 'current-article-id')
```

---

## 🎨 **Type-Safe Patterns**

### Using Converters Directly
```typescript
import { getFirestoreDb } from '@/lib/firebase'
import { collection, query, where } from 'firebase/firestore'
import { articleConverter } from '@/lib/converters'

const db = getFirestoreDb()
const articlesRef = collection(db, 'articles').withConverter(articleConverter)

const q = query(articlesRef, where('status', '==', 'published'))
const snapshot = await getDocs(q)

// Automatic type inference and validation!
const articles = snapshot.docs.map(doc => doc.data())
```

### Type Guards
```typescript
import { ArticleStatus } from '@/lib/types'

function isValidStatus(value: string): value is ArticleStatus {
  return ArticleStatus.safeParse(value).success
}
```

---

## ⚠️ **Common Pitfalls**

### 1. Don't Use Converters Server-Side Without Client Check
```typescript
// ❌ Bad: Will fail in SSR
export default async function Page() {
  const articles = await listArticles() // Calls getFirestoreDb()
  return <div>{articles.length}</div>
}

// ✅ Good: Use 'use client' directive
'use client'
export default async function Page() {
  const articles = await listArticles()
  return <div>{articles.length}</div>
}
```

### 2. Remember to Handle Null Values
```typescript
const article = await getArticleBySlug('non-existent')

if (!article) {
  // Handle not found
  return <div>Article not found</div>
}

// Now TypeScript knows article is not null
console.log(article.title)
```

### 3. Validate Before Saving
```typescript
// ❌ Bad: Will throw Zod error
await saveArticle({
  title: 'My Article',
  slug: 'INVALID SLUG', // Not kebab-case
})

// ✅ Good: Validate slug format
import { generateSlug } from '@/lib/db'

await saveArticle({
  title: 'My Article',
  slug: generateSlug('My Article'), // 'my-article'
})
```

---

## 📖 **API Reference**

### Article Functions
- `getArticleBySlug(slug: string): Promise<Article | null>`
- `getArticleById(id: string): Promise<Article | null>`
- `listArticles(filters?: ListArticlesFilters): Promise<Article[]>`
- `listNews(filters?: ListNewsFilters): Promise<Article[]>`
- `saveArticle(input: ArticleInput): Promise<string>`
- `updateArticle(id: string, updates: ArticleUpdate): Promise<void>`
- `publishArticle(id: string): Promise<void>`
- `deleteArticle(id: string): Promise<void>`

### Topic Functions
- `listTopics(filters?: ListTopicsFilters): Promise<Topic[]>`
- `getTopicById(id: string): Promise<Topic | null>`
- `getTopicBySlug(slug: string): Promise<Topic | null>`
- `saveTopic(input: TopicInput): Promise<string>`
- `updateTopic(id: string, updates: TopicUpdate): Promise<void>`
- `deleteTopic(id: string): Promise<void>`

### Source Functions
- `listSources(activeOnly?: boolean): Promise<Source[]>`
- `getSourceById(id: string): Promise<Source | null>`
- `saveSource(input: SourceInput): Promise<string>`
- `updateSource(id: string, updates: SourceUpdate): Promise<void>`
- `deleteSource(id: string): Promise<void>`

### Newsletter Functions
- `listNewsletters(limit?: number): Promise<Newsletter[]>`
- `getNewsletterById(id: string): Promise<Newsletter | null>`
- `getNewsletterByIssueNumber(issueNumber: number): Promise<Newsletter | null>`
- `saveNewsletter(input: NewsletterInput): Promise<string>`
- `updateNewsletter(id: string, updates: NewsletterUpdate): Promise<void>`
- `deleteNewsletter(id: string): Promise<void>`

### User Functions
- `getUserById(id: string): Promise<User | null>`
- `saveUser(id: string, input: UserInput): Promise<void>`
- `updateUser(id: string, updates: UserUpdate): Promise<void>`
- `updateUserLastLogin(id: string): Promise<void>`

### Utility Functions
- `generateSlug(title: string): string`
- `isArticleSlugUnique(slug: string, excludeId?: string): Promise<boolean>`
- `isTopicSlugUnique(slug: string, excludeId?: string): Promise<boolean>`

---

## 🚀 **Next Steps**

1. **Deploy Indexes**: `firebase deploy --only firestore:indexes`
2. **Create Firestore Security Rules**: See `firestore.rules` (to be created)
3. **Test Queries**: Use `/test-firebase` page
4. **Build UI**: Use these functions in your components

---

**Version**: 1.0  
**Created**: November 7, 2025  
**Status**: Production Ready

