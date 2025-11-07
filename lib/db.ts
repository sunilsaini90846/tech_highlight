import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  QueryConstraint,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import {
  articleConverter,
  sourceConverter,
  topicConverter,
  newsletterConverter,
  userConverter,
} from './converters'
import {
  Article,
  ArticleInput,
  ArticleUpdate,
  ArticleStatus,
  Source,
  SourceInput,
  SourceUpdate,
  Topic,
  TopicInput,
  TopicUpdate,
  Newsletter,
  NewsletterInput,
  NewsletterUpdate,
  User,
  UserInput,
  UserUpdate,
  ListArticlesFilters,
  ListNewsFilters,
  ListTopicsFilters,
  ArticleInputSchema,
  ArticleUpdateSchema,
  SourceInputSchema,
  SourceUpdateSchema,
  TopicInputSchema,
  TopicUpdateSchema,
  NewsletterInputSchema,
  NewsletterUpdateSchema,
  UserInputSchema,
  UserUpdateSchema,
} from './types'

// ============================================================================
// Collection References
// ============================================================================

const COLLECTIONS = {
  ARTICLES: 'articles',
  SOURCES: 'sources',
  TOPICS: 'topics',
  NEWSLETTERS: 'newsletters',
  USERS: 'users',
} as const

// ============================================================================
// Article Functions
// ============================================================================

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = getFirestoreDb()
  const articlesRef = collection(db, COLLECTIONS.ARTICLES).withConverter(articleConverter)
  
  const q = query(articlesRef, where('slug', '==', slug), firestoreLimit(1))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return null
  }
  
  return snapshot.docs[0].data()
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const db = getFirestoreDb()
  const articleRef = doc(db, COLLECTIONS.ARTICLES, id).withConverter(articleConverter)
  
  const snapshot = await getDoc(articleRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  return snapshot.data()
}

/**
 * List articles with filters
 */
export async function listArticles(filters: ListArticlesFilters = {}): Promise<Article[]> {
  const db = getFirestoreDb()
  const articlesRef = collection(db, COLLECTIONS.ARTICLES).withConverter(articleConverter)
  
  const constraints: QueryConstraint[] = []
  
  // Apply filters
  if (filters.status) {
    constraints.push(where('status', '==', filters.status))
  }
  
  if (filters.category) {
    constraints.push(where('category', '==', filters.category))
  }
  
  if (filters.topic) {
    constraints.push(where('topics', 'array-contains', filters.topic))
  }
  
  // Apply ordering
  const orderByField = filters.orderBy || 'publishedAt'
  const orderDirection = filters.orderDirection || 'desc'
  constraints.push(orderBy(orderByField, orderDirection))
  
  // Apply limit
  if (filters.limit) {
    constraints.push(firestoreLimit(filters.limit))
  }
  
  const q = query(articlesRef, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => doc.data())
}

/**
 * List news articles (published, category: news)
 */
export async function listNews(filters: ListNewsFilters = {}): Promise<Article[]> {
  return listArticles({
    status: 'published',
    category: 'news',
    limit: filters.limit || 10,
    orderBy: 'publishedAt',
    orderDirection: 'desc',
  })
}

/**
 * Save a new article
 */
export async function saveArticle(input: ArticleInput): Promise<string> {
  // Validate input with Zod
  const validatedInput = ArticleInputSchema.parse(input)
  
  const db = getFirestoreDb()
  const articlesRef = collection(db, COLLECTIONS.ARTICLES).withConverter(articleConverter)
  
  // Check for duplicate slug
  const existing = await getArticleBySlug(validatedInput.slug)
  if (existing) {
    throw new Error(`Article with slug "${validatedInput.slug}" already exists`)
  }
  
  const docRef = await addDoc(articlesRef, {
    ...validatedInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Article)
  
  return docRef.id
}

/**
 * Update an existing article
 */
export async function updateArticle(id: string, updates: ArticleUpdate): Promise<void> {
  // Validate updates with Zod
  const validatedUpdates = ArticleUpdateSchema.parse(updates)
  
  const db = getFirestoreDb()
  const articleRef = doc(db, COLLECTIONS.ARTICLES, id).withConverter(articleConverter)
  
  // Check if article exists
  const snapshot = await getDoc(articleRef)
  if (!snapshot.exists()) {
    throw new Error(`Article with id "${id}" not found`)
  }
  
  // If updating slug, check for duplicates
  if (validatedUpdates.slug) {
    const existing = await getArticleBySlug(validatedUpdates.slug)
    if (existing && existing.id !== id) {
      throw new Error(`Article with slug "${validatedUpdates.slug}" already exists`)
    }
  }
  
  await updateDoc(articleRef, {
    ...validatedUpdates,
    updatedAt: new Date(),
  })
}

/**
 * Publish an article (set status to published and publishedAt to now)
 */
export async function publishArticle(id: string): Promise<void> {
  const db = getFirestoreDb()
  const articleRef = doc(db, COLLECTIONS.ARTICLES, id)
  
  // Check if article exists
  const snapshot = await getDoc(articleRef)
  if (!snapshot.exists()) {
    throw new Error(`Article with id "${id}" not found`)
  }
  
  await updateDoc(articleRef, {
    status: 'published' as ArticleStatus,
    publishedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string): Promise<void> {
  const db = getFirestoreDb()
  const articleRef = doc(db, COLLECTIONS.ARTICLES, id)
  
  await deleteDoc(articleRef)
}

// ============================================================================
// Topic Functions
// ============================================================================

/**
 * List all topics
 */
export async function listTopics(filters: ListTopicsFilters = {}): Promise<Topic[]> {
  const db = getFirestoreDb()
  const topicsRef = collection(db, COLLECTIONS.TOPICS).withConverter(topicConverter)
  
  const constraints: QueryConstraint[] = []
  
  // Apply filters
  if (filters.featured !== undefined) {
    constraints.push(where('featured', '==', filters.featured))
  }
  
  // Apply ordering
  const orderByField = filters.orderBy || 'order'
  const orderDirection = filters.orderDirection || 'asc'
  constraints.push(orderBy(orderByField, orderDirection))
  
  const q = query(topicsRef, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => doc.data())
}

/**
 * Get topics by their IDs
 */
export async function getTopicsByIds(topicIds: string[]): Promise<Topic[]> {
  if (topicIds.length === 0) return []

  const db = getFirestoreDb()
  const topicsRef = collection(db, COLLECTIONS.TOPICS).withConverter(topicConverter)

  // Firestore 'in' query has a limit of 10 items, so we need to batch if necessary
  const batches: string[][] = []
  for (let i = 0; i < topicIds.length; i += 10) {
    batches.push(topicIds.slice(i, i + 10))
  }

  const results: Topic[] = []
  for (const batch of batches) {
    const q = query(topicsRef, where('__name__', 'in', batch))
    const snapshot = await getDocs(q)
    results.push(...snapshot.docs.map(doc => doc.data()))
  }

  return results
}

/**
 * Get topic by ID
 */
export async function getTopicById(id: string): Promise<Topic | null> {
  const db = getFirestoreDb()
  const topicRef = doc(db, COLLECTIONS.TOPICS, id).withConverter(topicConverter)
  
  const snapshot = await getDoc(topicRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  return snapshot.data()
}

/**
 * Get topic by slug
 */
export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const db = getFirestoreDb()
  const topicsRef = collection(db, COLLECTIONS.TOPICS).withConverter(topicConverter)
  
  const q = query(topicsRef, where('slug', '==', slug), firestoreLimit(1))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return null
  }
  
  return snapshot.docs[0].data()
}

/**
 * Save a new topic
 */
export async function saveTopic(input: TopicInput): Promise<string> {
  const validatedInput = TopicInputSchema.parse(input)
  
  const db = getFirestoreDb()
  const topicsRef = collection(db, COLLECTIONS.TOPICS).withConverter(topicConverter)
  
  // Check for duplicate slug
  const existing = await getTopicBySlug(validatedInput.slug)
  if (existing) {
    throw new Error(`Topic with slug "${validatedInput.slug}" already exists`)
  }
  
  const docRef = await addDoc(topicsRef, {
    ...validatedInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Topic)
  
  return docRef.id
}

/**
 * Update an existing topic
 */
export async function updateTopic(id: string, updates: TopicUpdate): Promise<void> {
  const validatedUpdates = TopicUpdateSchema.parse(updates)
  
  const db = getFirestoreDb()
  const topicRef = doc(db, COLLECTIONS.TOPICS, id).withConverter(topicConverter)
  
  const snapshot = await getDoc(topicRef)
  if (!snapshot.exists()) {
    throw new Error(`Topic with id "${id}" not found`)
  }
  
  if (validatedUpdates.slug) {
    const existing = await getTopicBySlug(validatedUpdates.slug)
    if (existing && existing.id !== id) {
      throw new Error(`Topic with slug "${validatedUpdates.slug}" already exists`)
    }
  }
  
  await updateDoc(topicRef, {
    ...validatedUpdates,
    updatedAt: new Date(),
  })
}

/**
 * Delete a topic
 */
export async function deleteTopic(id: string): Promise<void> {
  const db = getFirestoreDb()
  const topicRef = doc(db, COLLECTIONS.TOPICS, id)
  
  await deleteDoc(topicRef)
}

// ============================================================================
// Source Functions
// ============================================================================

/**
 * List all sources
 */
export async function listSources(activeOnly = false): Promise<Source[]> {
  const db = getFirestoreDb()
  const sourcesRef = collection(db, COLLECTIONS.SOURCES).withConverter(sourceConverter)
  
  const constraints: QueryConstraint[] = []
  
  if (activeOnly) {
    constraints.push(where('active', '==', true))
  }
  
  constraints.push(orderBy('name', 'asc'))
  
  const q = query(sourcesRef, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => doc.data())
}

/**
 * Get source by ID
 */
export async function getSourceById(id: string): Promise<Source | null> {
  const db = getFirestoreDb()
  const sourceRef = doc(db, COLLECTIONS.SOURCES, id).withConverter(sourceConverter)
  
  const snapshot = await getDoc(sourceRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  return snapshot.data()
}

/**
 * Save a new source
 */
export async function saveSource(input: SourceInput): Promise<string> {
  const validatedInput = SourceInputSchema.parse(input)
  
  const db = getFirestoreDb()
  const sourcesRef = collection(db, COLLECTIONS.SOURCES).withConverter(sourceConverter)
  
  const docRef = await addDoc(sourcesRef, {
    ...validatedInput,
    lastFetchedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Source)
  
  return docRef.id
}

/**
 * Update an existing source
 */
export async function updateSource(id: string, updates: SourceUpdate): Promise<void> {
  const validatedUpdates = SourceUpdateSchema.parse(updates)
  
  const db = getFirestoreDb()
  const sourceRef = doc(db, COLLECTIONS.SOURCES, id).withConverter(sourceConverter)
  
  const snapshot = await getDoc(sourceRef)
  if (!snapshot.exists()) {
    throw new Error(`Source with id "${id}" not found`)
  }
  
  await updateDoc(sourceRef, {
    ...validatedUpdates,
    updatedAt: new Date(),
  })
}

/**
 * Delete a source
 */
export async function deleteSource(id: string): Promise<void> {
  const db = getFirestoreDb()
  const sourceRef = doc(db, COLLECTIONS.SOURCES, id)
  
  await deleteDoc(sourceRef)
}

// ============================================================================
// Newsletter Functions
// ============================================================================

/**
 * List newsletters
 */
export async function listNewsletters(limit?: number): Promise<Newsletter[]> {
  const db = getFirestoreDb()
  const newslettersRef = collection(db, COLLECTIONS.NEWSLETTERS).withConverter(newsletterConverter)
  
  const constraints: QueryConstraint[] = [
    orderBy('publishedAt', 'desc'),
  ]
  
  if (limit) {
    constraints.push(firestoreLimit(limit))
  }
  
  const q = query(newslettersRef, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => doc.data())
}

/**
 * Get newsletter by ID
 */
export async function getNewsletterById(id: string): Promise<Newsletter | null> {
  const db = getFirestoreDb()
  const newsletterRef = doc(db, COLLECTIONS.NEWSLETTERS, id).withConverter(newsletterConverter)
  
  const snapshot = await getDoc(newsletterRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  return snapshot.data()
}

/**
 * Get newsletter by issue number
 */
export async function getNewsletterByIssueNumber(issueNumber: number): Promise<Newsletter | null> {
  const db = getFirestoreDb()
  const newslettersRef = collection(db, COLLECTIONS.NEWSLETTERS).withConverter(newsletterConverter)
  
  const q = query(newslettersRef, where('issueNumber', '==', issueNumber), firestoreLimit(1))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return null
  }
  
  return snapshot.docs[0].data()
}

/**
 * Save a new newsletter
 */
export async function saveNewsletter(input: NewsletterInput): Promise<string> {
  const validatedInput = NewsletterInputSchema.parse(input)
  
  const db = getFirestoreDb()
  const newslettersRef = collection(db, COLLECTIONS.NEWSLETTERS).withConverter(newsletterConverter)
  
  // Check for duplicate issue number
  const existing = await getNewsletterByIssueNumber(validatedInput.issueNumber)
  if (existing) {
    throw new Error(`Newsletter with issue number ${validatedInput.issueNumber} already exists`)
  }
  
  const docRef = await addDoc(newslettersRef, {
    ...validatedInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Newsletter)
  
  return docRef.id
}

/**
 * Update an existing newsletter
 */
export async function updateNewsletter(id: string, updates: NewsletterUpdate): Promise<void> {
  const validatedUpdates = NewsletterUpdateSchema.parse(updates)
  
  const db = getFirestoreDb()
  const newsletterRef = doc(db, COLLECTIONS.NEWSLETTERS, id).withConverter(newsletterConverter)
  
  const snapshot = await getDoc(newsletterRef)
  if (!snapshot.exists()) {
    throw new Error(`Newsletter with id "${id}" not found`)
  }
  
  if (validatedUpdates.issueNumber) {
    const existing = await getNewsletterByIssueNumber(validatedUpdates.issueNumber)
    if (existing && existing.id !== id) {
      throw new Error(`Newsletter with issue number ${validatedUpdates.issueNumber} already exists`)
    }
  }
  
  await updateDoc(newsletterRef, {
    ...validatedUpdates,
    updatedAt: new Date(),
  })
}

/**
 * Delete a newsletter
 */
export async function deleteNewsletter(id: string): Promise<void> {
  const db = getFirestoreDb()
  const newsletterRef = doc(db, COLLECTIONS.NEWSLETTERS, id)
  
  await deleteDoc(newsletterRef)
}

// ============================================================================
// User Functions
// ============================================================================

/**
 * Get user by ID (Auth UID)
 */
export async function getUserById(id: string): Promise<User | null> {
  const db = getFirestoreDb()
  const userRef = doc(db, COLLECTIONS.USERS, id).withConverter(userConverter)
  
  const snapshot = await getDoc(userRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  return snapshot.data()
}

/**
 * Save a new user
 */
export async function saveUser(id: string, input: UserInput): Promise<void> {
  const validatedInput = UserInputSchema.parse(input)
  
  const db = getFirestoreDb()
  const userRef = doc(db, COLLECTIONS.USERS, id).withConverter(userConverter)
  
  const batch = writeBatch(db)
  batch.set(userRef, {
    ...validatedInput,
    id,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  } as User)
  
  await batch.commit()
}

/**
 * Update an existing user
 */
export async function updateUser(id: string, updates: UserUpdate): Promise<void> {
  const validatedUpdates = UserUpdateSchema.parse(updates)
  
  const db = getFirestoreDb()
  const userRef = doc(db, COLLECTIONS.USERS, id).withConverter(userConverter)
  
  const snapshot = await getDoc(userRef)
  if (!snapshot.exists()) {
    throw new Error(`User with id "${id}" not found`)
  }
  
  await updateDoc(userRef, validatedUpdates)
}

/**
 * Update user's last login time
 */
export async function updateUserLastLogin(id: string): Promise<void> {
  const db = getFirestoreDb()
  const userRef = doc(db, COLLECTIONS.USERS, id)
  
  await updateDoc(userRef, {
    lastLoginAt: Timestamp.now(),
  })
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Check if a slug is unique for articles
 */
export async function isArticleSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await getArticleBySlug(slug)
  return !existing || (excludeId ? existing.id === excludeId : false)
}

/**
 * Check if a slug is unique for topics
 */
export async function isTopicSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await getTopicBySlug(slug)
  return !existing || (excludeId ? existing.id === excludeId : false)
}

