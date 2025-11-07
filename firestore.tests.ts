/**
 * Firestore Security Rules Test Cases
 *
 * Run these tests with Firebase Emulators:
 * firebase emulators:start --only firestore
 * npm run test:rules
 */

import {
  initializeTestApp,
  clearFirestoreData,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load Firestore rules
const rules = readFileSync(join(__dirname, 'firestore.rules'), 'utf8')

// Test configuration
const PROJECT_ID = 'test-highlight'
const auth = { uid: 'test-user-id' }
const adminAuth = { uid: 'admin-user-id' }
const editorAuth = { uid: 'editor-user-id' }

// Helper function to create test apps
function createTestApp(auth?: any) {
  return initializeTestApp({
    projectId: PROJECT_ID,
    auth: auth || null,
  })
}

// Clean up before tests
beforeEach(async () => {
  await clearFirestoreData({ projectId: PROJECT_ID })
})

// ============================================================================
// Test Cases
// ============================================================================

describe('Firestore Security Rules - test-highlight', () => {

  // ============================================================================
  // Articles Collection Tests
  // ============================================================================

  describe('Articles Collection', () => {

    test('PUBLIC: Can read published article with past publish date', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Create a published article with past publish date
      const pastDate = new Date('2023-01-01')
      await db.collection('articles').doc('published-past').set({
        title: 'Published Article',
        slug: 'published-article',
        summary: 'Summary',
        body: 'Content',
        category: 'news',
        topics: ['topic1'],
        tags: ['tag1'],
        status: 'published',
        authorRef: 'author1',
        publishedAt: pastDate,
        seo: { title: 'SEO Title', description: 'SEO Desc' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('articles').doc('published-past').get()
      )
      expect(doc.data()?.status).toBe('published')
    })

    test('PUBLIC: Cannot read published article with future publish date', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Create a published article with future publish date
      const futureDate = new Date('2030-01-01')
      await db.collection('articles').doc('published-future').set({
        title: 'Future Article',
        slug: 'future-article',
        summary: 'Summary',
        body: 'Content',
        category: 'news',
        topics: ['topic1'],
        tags: ['tag1'],
        status: 'published',
        authorRef: 'author1',
        publishedAt: futureDate,
        seo: { title: 'SEO Title', description: 'SEO Desc' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should fail
      await assertFails(
        db.collection('articles').doc('published-future').get()
      )
    })

    test('PUBLIC: Cannot read draft article', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Create a draft article
      await db.collection('articles').doc('draft').set({
        title: 'Draft Article',
        slug: 'draft-article',
        summary: 'Summary',
        body: 'Content',
        category: 'news',
        topics: ['topic1'],
        tags: ['tag1'],
        status: 'draft',
        authorRef: 'author1',
        publishedAt: null,
        seo: { title: 'SEO Title', description: 'SEO Desc' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should fail
      await assertFails(
        db.collection('articles').doc('draft').get()
      )
    })

    test('EDITOR: Can read draft article', async () => {
      const app = createTestApp(editorAuth)
      const db = app.firestore()

      // First, create the user document (editor role)
      await db.collection('users').doc(editorAuth.uid).set({
        displayName: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Create a draft article
      await db.collection('articles').doc('draft').set({
        title: 'Draft Article',
        slug: 'draft-article',
        summary: 'Summary',
        body: 'Content',
        category: 'news',
        topics: ['topic1'],
        tags: ['tag1'],
        status: 'draft',
        authorRef: 'author1',
        publishedAt: null,
        seo: { title: 'SEO Title', description: 'SEO Desc' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('articles').doc('draft').get()
      )
      expect(doc.data()?.status).toBe('draft')
    })

    test('EDITOR: Can create article', async () => {
      const app = createTestApp(editorAuth)
      const db = app.firestore()

      // Create the user document (editor role)
      await db.collection('users').doc(editorAuth.uid).set({
        displayName: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should succeed
      await assertSucceeds(
        db.collection('articles').doc('new-article').set({
          title: 'New Article',
          slug: 'new-article',
          summary: 'Summary',
          body: 'Content',
          category: 'news',
          topics: ['topic1'],
          tags: ['tag1'],
          status: 'draft',
          authorRef: editorAuth.uid,
          publishedAt: null,
          seo: { title: 'SEO Title', description: 'SEO Desc' },
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    })

    test('PUBLIC: Cannot create article', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Should fail
      await assertFails(
        db.collection('articles').doc('new-article').set({
          title: 'New Article',
          slug: 'new-article',
          summary: 'Summary',
          body: 'Content',
          category: 'news',
          topics: ['topic1'],
          tags: ['tag1'],
          status: 'draft',
          authorRef: 'author1',
          publishedAt: null,
          seo: { title: 'SEO Title', description: 'SEO Desc' },
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    })

  })

  // ============================================================================
  // Topics Collection Tests
  // ============================================================================

  describe('Topics Collection', () => {

    test('PUBLIC: Can read any topic', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Create a topic
      await db.collection('topics').doc('topic1').set({
        name: 'AI Basics',
        slug: 'ai-basics',
        description: 'Learn AI fundamentals',
        featured: true,
        order: 1,
        articleCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('topics').doc('topic1').get()
      )
      expect(doc.data()?.name).toBe('AI Basics')
    })

    test('EDITOR: Can create topic', async () => {
      const app = createTestApp(editorAuth)
      const db = app.firestore()

      // Create the user document (editor role)
      await db.collection('users').doc(editorAuth.uid).set({
        displayName: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should succeed
      await assertSucceeds(
        db.collection('topics').doc('new-topic').set({
          name: 'New Topic',
          slug: 'new-topic',
          description: 'Topic description',
          featured: false,
          order: 10,
          articleCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    })

    test('PUBLIC: Cannot create topic', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Should fail
      await assertFails(
        db.collection('topics').doc('new-topic').set({
          name: 'New Topic',
          slug: 'new-topic',
          description: 'Topic description',
          featured: false,
          order: 10,
          articleCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    })

  })

  // ============================================================================
  // Newsletters Collection Tests
  // ============================================================================

  describe('Newsletters Collection', () => {

    test('PUBLIC: Can read sent newsletter', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Create a sent newsletter
      await db.collection('newsletters').doc('newsletter1').set({
        issueNumber: 1,
        title: 'Newsletter #1',
        intro: 'Welcome to our newsletter',
        items: [
          { articleRef: 'article1', customNote: 'Must read!' },
          { articleRef: 'article2' }
        ],
        status: 'sent',
        publishedAt: new Date('2023-01-01'),
        seo: { title: 'Newsletter #1', description: 'Weekly AI news' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('newsletters').doc('newsletter1').get()
      )
      expect(doc.data()?.status).toBe('sent')
    })

    test('PUBLIC: Cannot read draft newsletter', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Create a draft newsletter
      await db.collection('newsletters').doc('draft-newsletter').set({
        issueNumber: 2,
        title: 'Newsletter #2',
        intro: 'This is a draft',
        items: [{ articleRef: 'article1' }],
        status: 'draft',
        publishedAt: null,
        seo: { title: 'Newsletter #2', description: 'Draft newsletter' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should fail
      await assertFails(
        db.collection('newsletters').doc('draft-newsletter').get()
      )
    })

    test('EDITOR: Can read draft newsletter', async () => {
      const app = createTestApp(editorAuth)
      const db = app.firestore()

      // Create the user document (editor role)
      await db.collection('users').doc(editorAuth.uid).set({
        displayName: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Create a draft newsletter
      await db.collection('newsletters').doc('draft-newsletter').set({
        issueNumber: 2,
        title: 'Newsletter #2',
        intro: 'This is a draft',
        items: [{ articleRef: 'article1' }],
        status: 'draft',
        publishedAt: null,
        seo: { title: 'Newsletter #2', description: 'Draft newsletter' },
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('newsletters').doc('draft-newsletter').get()
      )
      expect(doc.data()?.status).toBe('draft')
    })

  })

  // ============================================================================
  // Users Collection Tests
  // ============================================================================

  describe('Users Collection', () => {

    test('USER: Can read own profile', async () => {
      const app = createTestApp(auth)
      const db = app.firestore()

      // Create a user document
      await db.collection('users').doc(auth.uid).set({
        displayName: 'Test User',
        email: 'test@example.com',
        role: 'reader',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('users').doc(auth.uid).get()
      )
      expect(doc.data()?.email).toBe('test@example.com')
    })

    test('USER: Cannot read other users profile', async () => {
      const app = createTestApp(auth)
      const db = app.firestore()

      // Create another user's document
      await db.collection('users').doc('other-user').set({
        displayName: 'Other User',
        email: 'other@example.com',
        role: 'reader',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should fail
      await assertFails(
        db.collection('users').doc('other-user').get()
      )
    })

    test('ADMIN: Can read all users', async () => {
      const app = createTestApp(adminAuth)
      const db = app.firestore()

      // Create admin user
      await db.collection('users').doc(adminAuth.uid).set({
        displayName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Create another user
      await db.collection('users').doc('other-user').set({
        displayName: 'Other User',
        email: 'other@example.com',
        role: 'reader',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('users').doc('other-user').get()
      )
      expect(doc.data()?.email).toBe('other@example.com')
    })

    test('ADMIN: Can create users', async () => {
      const app = createTestApp(adminAuth)
      const db = app.firestore()

      // Create admin user
      await db.collection('users').doc(adminAuth.uid).set({
        displayName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should succeed
      await assertSucceeds(
        db.collection('users').doc('new-user').set({
          displayName: 'New User',
          email: 'new@example.com',
          role: 'editor',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        })
      )
    })

    test('EDITOR: Cannot create users', async () => {
      const app = createTestApp(editorAuth)
      const db = app.firestore()

      // Create editor user
      await db.collection('users').doc(editorAuth.uid).set({
        displayName: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should fail
      await assertFails(
        db.collection('users').doc('new-user').set({
          displayName: 'New User',
          email: 'new@example.com',
          role: 'editor',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        })
      )
    })

  })

  // ============================================================================
  // Sources Collection Tests
  // ============================================================================

  describe('Sources Collection', () => {

    test('PUBLIC: Cannot read sources', async () => {
      const app = createTestApp() // No auth (public)
      const db = app.firestore()

      // Create a source
      await db.collection('sources').doc('source1').set({
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed',
        type: 'rss',
        active: true,
        fetchInterval: 24,
        lastFetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should fail
      await assertFails(
        db.collection('sources').doc('source1').get()
      )
    })

    test('EDITOR: Can read sources', async () => {
      const app = createTestApp(editorAuth)
      const db = app.firestore()

      // Create editor user
      await db.collection('users').doc(editorAuth.uid).set({
        displayName: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Create a source
      await db.collection('sources').doc('source1').set({
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed',
        type: 'rss',
        active: true,
        fetchInterval: 24,
        lastFetchedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Should succeed
      const doc = await assertSucceeds(
        db.collection('sources').doc('source1').get()
      )
      expect(doc.data()?.name).toBe('TechCrunch')
    })

    test('EDITOR: Can create sources', async () => {
      const app = createTestApp(editorAuth)
      const db = app.firestore()

      // Create editor user
      await db.collection('users').doc(editorAuth.uid).set({
        displayName: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      })

      // Should succeed
      await assertSucceeds(
        db.collection('sources').doc('new-source').set({
          name: 'New Source',
          url: 'https://example.com/feed',
          type: 'rss',
          active: true,
          fetchInterval: 24,
          lastFetchedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    })

  })

})
