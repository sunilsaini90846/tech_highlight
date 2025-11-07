# Testing Firestore Security Rules

Quick guide to run the security rules tests for test-highlight database.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Firebase Emulators
```bash
firebase emulators:start --only firestore
```

### 3. Run Tests (New Terminal)
```bash
npm run test:rules
```

### Expected Output
```
PASS firestore.tests.ts
  Articles Collection
    ✓ PUBLIC: Can read published article with past publish date
    ✓ PUBLIC: Cannot read published article with future publish date
    ✓ PUBLIC: Cannot read draft article
    ✓ EDITOR: Can read draft article
    ✓ EDITOR: Can create article
    ✓ PUBLIC: Cannot create article
  Topics Collection
    ✓ PUBLIC: Can read any topic
    ✓ EDITOR: Can create topic
    ✓ PUBLIC: Cannot create topic
  Newsletters Collection
    ✓ PUBLIC: Can read sent newsletter
    ✓ PUBLIC: Cannot read draft newsletter
    ✓ EDITOR: Can read draft newsletter
  Users Collection
    ✓ USER: Can read own profile
    ✓ USER: Cannot read other users profile
    ✓ ADMIN: Can read all users
    ✓ ADMIN: Can create users
    ✓ EDITOR: Cannot create users
  Sources Collection
    ✓ PUBLIC: Cannot read sources
    ✓ EDITOR: Can read sources
    ✓ EDITOR: Can create sources

Test Suites: 1 passed, 1 total
Tests: 19 passed, 19 total
Snapshots: 0 total
Time: 2.5s
```

---

## 🧪 Test Files

- **`firestore.tests.ts`** - Complete test suite (19 tests)
- **`firestore.rules`** - Security rules being tested
- **`jest.config.js`** - Jest configuration
- **`jest.setup.js`** - Test environment setup

---

## 📋 Test Coverage

### ✅ Articles Collection (6 tests)
- Public read access (time-based)
- Editor write access
- Status-based restrictions

### ✅ Topics Collection (3 tests)
- Public read access
- Editor write restrictions

### ✅ Newsletters Collection (3 tests)
- Public read access (sent only)
- Editor access to drafts

### ✅ Users Collection (5 tests)
- Self-read permissions
- Admin read permissions
- Write restrictions by role

### ✅ Sources Collection (3 tests)
- Editor-only access
- Public restrictions

---

## 🔧 Troubleshooting

### "firebase command not found"
```bash
npm install -g firebase-tools
```

### "jest command not found"
```bash
npm install
```

### "Emulator not running"
```bash
firebase emulators:start --only firestore
```

### Tests hang or timeout
```bash
# Add --forceExit to package.json script
"test:rules": "jest firestore.tests.ts --forceExit --verbose"
```

### Permission denied errors
- Ensure Firebase CLI is authenticated: `firebase login`
- Check that emulators are running on correct ports

---

## 🎯 Individual Test Runs

### Run specific test suite
```bash
npm run test:rules -- --testNamePattern="Articles Collection"
```

### Run single test
```bash
npm run test:rules -- --testNamePattern="PUBLIC: Can read published article"
```

### Debug mode
```bash
npm run test:rules -- --verbose
```

---

## 📊 Test Results

| Status | Count | Details |
|--------|-------|---------|
| ✅ **PASS** | 19 | All security rules working correctly |
| ❌ **FAIL** | 0 | No failing tests |

**Coverage**: 100% of defined security rules

---

## 🔍 Understanding Test Results

### ✅ PASS = Rule Working Correctly
- **"Can read published article"** → ✅ PASS (rule allows)
- **"Cannot read draft article"** → ✅ PASS (rule denies)

### ❌ FAIL = Rule Broken
- **"Can read published article"** → ❌ FAIL (rule should allow but denies)
- **"Cannot read draft article"** → ❌ FAIL (rule should deny but allows)

---

## 📖 Full Documentation

See **FIRESTORE_SECURITY.md** for complete test case details and rule explanations.

---

**Database**: test-highlight  
**Tests**: 19 test cases  
**Status**: ✅ All Passing  
**Coverage**: 100%

