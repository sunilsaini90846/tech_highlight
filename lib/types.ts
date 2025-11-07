import { z } from 'zod'
import { Timestamp } from 'firebase/firestore'

// ============================================================================
// Base Types
// ============================================================================

export const ArticleStatus = z.enum(['draft', 'scheduled', 'published'])
export type ArticleStatus = z.infer<typeof ArticleStatus>

export const ArticleCategory = z.enum(['news', 'guide', 'tool'])
export type ArticleCategory = z.infer<typeof ArticleCategory>

export const SourceType = z.enum(['rss', 'manual'])
export type SourceType = z.infer<typeof SourceType>

export const UserRole = z.enum(['admin', 'editor', 'reader'])
export type UserRole = z.infer<typeof UserRole>

export const NewsletterStatus = z.enum(['draft', 'sent'])
export type NewsletterStatus = z.infer<typeof NewsletterStatus>

// ============================================================================
// SEO Schema
// ============================================================================

export const SEOSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
})

export type SEO = z.infer<typeof SEOSchema>

// ============================================================================
// Article Schema
// ============================================================================

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1).max(500),
  coverImage: z.string().url().optional(),
  body: z.string().min(1), // MDX content
  category: ArticleCategory,
  topics: z.array(z.string()).default([]), // topic IDs
  tags: z.array(z.string()).default([]),
  sourceRef: z.string().optional(), // source ID
  publishedAt: z.date().nullable(),
  status: ArticleStatus,
  authorRef: z.string(), // user ID
  seo: SEOSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Article = z.infer<typeof ArticleSchema>

// Create input schema (for writes)
export const ArticleInputSchema = ArticleSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).partial({ publishedAt: true })

export type ArticleInput = z.infer<typeof ArticleInputSchema>

// Update input schema
export const ArticleUpdateSchema = ArticleInputSchema.partial()

export type ArticleUpdate = z.infer<typeof ArticleUpdateSchema>

// ============================================================================
// Source Schema
// ============================================================================

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  url: z.string().url(),
  type: SourceType,
  active: z.boolean().default(true),
  lastFetchedAt: z.date().nullable(),
  fetchInterval: z.number().int().positive().default(24), // hours
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Source = z.infer<typeof SourceSchema>

export const SourceInputSchema = SourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastFetchedAt: true,
})

export type SourceInput = z.infer<typeof SourceInputSchema>

export const SourceUpdateSchema = SourceInputSchema.partial()

export type SourceUpdate = z.infer<typeof SourceUpdateSchema>

// ============================================================================
// Topic Schema
// ============================================================================

export const TopicSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).default(''),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  articleCount: z.number().int().nonnegative().default(0), // computed field
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Topic = z.infer<typeof TopicSchema>

export const TopicInputSchema = TopicSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  articleCount: true,
})

export type TopicInput = z.infer<typeof TopicInputSchema>

export const TopicUpdateSchema = TopicInputSchema.partial()

export type TopicUpdate = z.infer<typeof TopicUpdateSchema>

// ============================================================================
// Newsletter Item Schema
// ============================================================================

export const NewsletterItemSchema = z.object({
  articleRef: z.string(), // article ID
  customNote: z.string().optional(),
})

export type NewsletterItem = z.infer<typeof NewsletterItemSchema>

// ============================================================================
// Newsletter Schema
// ============================================================================

export const NewsletterSchema = z.object({
  id: z.string(),
  issueNumber: z.number().int().positive(),
  title: z.string().min(1).max(200),
  intro: z.string().max(1000).default(''),
  items: z.array(NewsletterItemSchema).default([]),
  publishedAt: z.date().nullable(),
  status: NewsletterStatus,
  seo: SEOSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Newsletter = z.infer<typeof NewsletterSchema>

export const NewsletterInputSchema = NewsletterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type NewsletterInput = z.infer<typeof NewsletterInputSchema>

export const NewsletterUpdateSchema = NewsletterInputSchema.partial()

export type NewsletterUpdate = z.infer<typeof NewsletterUpdateSchema>

// ============================================================================
// User Schema
// ============================================================================

export const UserSchema = z.object({
  id: z.string(), // matches Firebase Auth UID
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  role: UserRole,
  createdAt: z.date(),
  lastLoginAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

export const UserInputSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
})

export type UserInput = z.infer<typeof UserInputSchema>

export const UserUpdateSchema = UserInputSchema.partial()

export type UserUpdate = z.infer<typeof UserUpdateSchema>

// ============================================================================
// Firestore Document Types (with Timestamp)
// ============================================================================

// Types for Firestore documents (Timestamps instead of Dates)
export type ArticleFirestore = Omit<Article, 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt: Timestamp | null
}

export type SourceFirestore = Omit<Source, 'createdAt' | 'updatedAt' | 'lastFetchedAt'> & {
  createdAt: Timestamp
  updatedAt: Timestamp
  lastFetchedAt: Timestamp | null
}

export type TopicFirestore = Omit<Topic, 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type NewsletterFirestore = Omit<Newsletter, 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt: Timestamp | null
}

export type UserFirestore = Omit<User, 'createdAt' | 'lastLoginAt'> & {
  createdAt: Timestamp
  lastLoginAt: Timestamp
}

// ============================================================================
// Query Filter Types
// ============================================================================

export interface ListArticlesFilters {
  limit?: number
  category?: ArticleCategory
  topic?: string // topic ID
  status?: ArticleStatus
  orderBy?: 'createdAt' | 'publishedAt' | 'updatedAt'
  orderDirection?: 'asc' | 'desc'
}

export interface ListNewsFilters {
  limit?: number
}

export interface ListTopicsFilters {
  featured?: boolean
  orderBy?: 'order' | 'name' | 'createdAt'
  orderDirection?: 'asc' | 'desc'
}

