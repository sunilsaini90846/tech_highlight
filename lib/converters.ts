import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore'
import {
  Article,
  ArticleFirestore,
  ArticleSchema,
  Newsletter,
  NewsletterFirestore,
  NewsletterSchema,
  Source,
  SourceFirestore,
  SourceSchema,
  Topic,
  TopicFirestore,
  TopicSchema,
  User,
  UserFirestore,
  UserSchema,
} from './types'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert Firestore Timestamp to Date
 */
function timestampToDate(timestamp: Timestamp | null): Date | null {
  return timestamp ? timestamp.toDate() : null
}

/**
 * Convert Date to Firestore Timestamp
 */
function dateToTimestamp(date: Date | null): Timestamp | null {
  return date ? Timestamp.fromDate(date) : null
}

// ============================================================================
// Article Converter
// ============================================================================

export const articleConverter: FirestoreDataConverter<Article> = {
  toFirestore: (article: Partial<Article>): DocumentData => {
    // Remove id from the data to be written
    const { id, createdAt, updatedAt, publishedAt, ...data } = article

    return {
      ...data,
      createdAt: createdAt ? dateToTimestamp(createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
      publishedAt: publishedAt ? dateToTimestamp(publishedAt) : null,
    }
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot<ArticleFirestore>,
    options?: SnapshotOptions
  ): Article => {
    const data = snapshot.data(options)

    // Convert Timestamps to Dates
    const article: Article = {
      ...data,
      id: snapshot.id,
      createdAt: timestampToDate(data.createdAt)!,
      updatedAt: timestampToDate(data.updatedAt)!,
      publishedAt: timestampToDate(data.publishedAt),
    }

    // Validate with Zod schema
    return ArticleSchema.parse(article)
  },
}

// ============================================================================
// Source Converter
// ============================================================================

export const sourceConverter: FirestoreDataConverter<Source> = {
  toFirestore: (source: Partial<Source>): DocumentData => {
    const { id, createdAt, updatedAt, lastFetchedAt, ...data } = source

    return {
      ...data,
      createdAt: createdAt ? dateToTimestamp(createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastFetchedAt: lastFetchedAt ? dateToTimestamp(lastFetchedAt) : null,
    }
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot<SourceFirestore>,
    options?: SnapshotOptions
  ): Source => {
    const data = snapshot.data(options)

    const source: Source = {
      ...data,
      id: snapshot.id,
      createdAt: timestampToDate(data.createdAt)!,
      updatedAt: timestampToDate(data.updatedAt)!,
      lastFetchedAt: timestampToDate(data.lastFetchedAt),
    }

    return SourceSchema.parse(source)
  },
}

// ============================================================================
// Topic Converter
// ============================================================================

export const topicConverter: FirestoreDataConverter<Topic> = {
  toFirestore: (topic: Partial<Topic>): DocumentData => {
    const { id, createdAt, updatedAt, ...data } = topic

    return {
      ...data,
      createdAt: createdAt ? dateToTimestamp(createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot<TopicFirestore>,
    options?: SnapshotOptions
  ): Topic => {
    const data = snapshot.data(options)

    const topic: Topic = {
      ...data,
      id: snapshot.id,
      createdAt: timestampToDate(data.createdAt)!,
      updatedAt: timestampToDate(data.updatedAt)!,
    }

    return TopicSchema.parse(topic)
  },
}

// ============================================================================
// Newsletter Converter
// ============================================================================

export const newsletterConverter: FirestoreDataConverter<Newsletter> = {
  toFirestore: (newsletter: Partial<Newsletter>): DocumentData => {
    const { id, createdAt, updatedAt, publishedAt, ...data } = newsletter

    return {
      ...data,
      createdAt: createdAt ? dateToTimestamp(createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now(),
      publishedAt: publishedAt ? dateToTimestamp(publishedAt) : null,
    }
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot<NewsletterFirestore>,
    options?: SnapshotOptions
  ): Newsletter => {
    const data = snapshot.data(options)

    const newsletter: Newsletter = {
      ...data,
      id: snapshot.id,
      createdAt: timestampToDate(data.createdAt)!,
      updatedAt: timestampToDate(data.updatedAt)!,
      publishedAt: timestampToDate(data.publishedAt),
    }

    return NewsletterSchema.parse(newsletter)
  },
}

// ============================================================================
// User Converter
// ============================================================================

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: Partial<User>): DocumentData => {
    const { id, createdAt, lastLoginAt, ...data } = user

    return {
      ...data,
      createdAt: createdAt ? dateToTimestamp(createdAt) : Timestamp.now(),
      lastLoginAt: lastLoginAt ? dateToTimestamp(lastLoginAt) : Timestamp.now(),
    }
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot<UserFirestore>,
    options?: SnapshotOptions
  ): User => {
    const data = snapshot.data(options)

    const user: User = {
      ...data,
      id: snapshot.id,
      createdAt: timestampToDate(data.createdAt)!,
      lastLoginAt: timestampToDate(data.lastLoginAt)!,
    }

    return UserSchema.parse(user)
  },
}

