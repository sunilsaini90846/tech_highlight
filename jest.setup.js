/**
 * Jest setup for Firestore security rules testing
 */

const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing')
const fs = require('fs')
const path = require('path')

// Load Firestore rules
const rules = fs.readFileSync(path.join(__dirname, 'firestore.rules'), 'utf8')

let testEnv

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'test-highlight',
    firestore: {
      rules: rules,
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

// Make helper functions available globally
global.assertSucceeds = assertSucceeds
global.assertFails = assertFails
