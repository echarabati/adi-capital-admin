# E2E Testing with Neon Branch Isolation

> Complete guide for running end-to-end tests with isolated database branches.

---

## Overview

This project uses **Playwright** for E2E testing with **Neon database branching** for complete test isolation. Each test run creates a temporary database branch that is automatically deleted after tests complete.

### Why Neon Branching?

| Problem                          | Solution                          |
| -------------------------------- | --------------------------------- |
| Tests pollute production data    | Each run uses isolated branch     |
| Test cleanup failures leave data | Branch deletion cleans everything |
| Schema drift between test/prod   | Branch inherits latest schema     |
| Manual database maintenance      | Automatic cleanup after tests     |

---

## Quick Start

```bash
# Run all E2E tests (isolated, recommended)
pnpm test:e2e

# Run specific test file
pnpm test:e2e tests/e2e/auth.spec.ts

# Run with Playwright UI for debugging (requires pnpm dev)
pnpm test:e2e:ui
```

---

## Setup

### 1. Environment Variables

Add to `.env.local`:

```bash
# Required for E2E tests
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id
```

### 2. Get Neon Credentials

1. **NEON_API_KEY**:
   - Go to [Neon Console](https://console.neon.tech)
   - Click your profile → Account Settings → API Keys
   - Generate new key and copy

2. **NEON_PROJECT_ID**:
   - Go to your project dashboard
   - Settings → General → Project ID

---

## How It Works

```
┌─────────────────────────────────────────────────────┐
│                  pnpm test:e2e                      │
├─────────────────────────────────────────────────────┤
│  1. Create Neon branch (e2e-{timestamp})           │
│  2. Start dev server with branch DATABASE_URL      │
│  3. Wait for server ready                          │
│  4. Run Playwright tests                           │
│  5. Stop server                                    │
│  6. Delete Neon branch                             │
└─────────────────────────────────────────────────────┘
```

### Branch Lifecycle

```
main (production)
  │
  ├── e2e-1770224726659 (created)
  │     ↳ Tests run here
  │     ↳ All test data created here
  │
  └── Branch deleted after tests
```

### Safety Features

- **Auto-expiration**: Branches expire in 1 hour if cleanup fails
- **Isolation**: Tests cannot affect production data
- **Schema sync**: Branch inherits current schema from main

---

## Architecture

### Key Files

```
scripts/
├── neon-branch.ts      # Neon API utilities (create/delete branch)
└── e2e-isolated.ts     # Test runner wrapper

tests/
├── global-setup.ts     # Playwright global setup (minimal)
├── global-teardown.ts  # Playwright global teardown (minimal)
└── e2e/
    ├── auth.spec.ts    # Authentication tests
    ├── rbac-fondos.spec.ts  # RBAC tests
    └── user-admin.spec.ts   # User admin tests

playwright.config.ts    # Playwright configuration
```

### How `e2e-isolated.ts` Works

```typescript
// 1. Load env vars
dotenv.config({ path: '.env.local' });

// 2. Create Neon branch
const { branchId, connectionUri } = await createE2EBranch();

// 3. Start dev server with branch DB
spawn('pnpm', ['dev:next'], {
  env: { ...process.env, DATABASE_URL: connectionUri },
});

// 4. Run Playwright
spawn('pnpm', ['playwright', 'test']);

// 5. Cleanup
await deleteE2EBranch(branchId);
```

---

## Commands

| Command                                | Description                        | Requires `pnpm dev`? |
| -------------------------------------- | ---------------------------------- | -------------------- |
| `pnpm test:e2e`                        | Run all tests with isolated branch | No                   |
| `pnpm test:e2e tests/e2e/auth.spec.ts` | Run specific file                  | No                   |
| `pnpm test:e2e:ui`                     | Playwright UI for debugging        | Yes                  |

---

## Writing Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { createTestUser, cleanupTestUser } from '../fixtures/auth';

test.describe('Feature Tests', () => {
  let testUser: { email: string; password: string };

  test.beforeAll(async () => {
    // Create test data in branch
    testUser = await createTestUser();
  });

  test.afterAll(async () => {
    // Cleanup (optional, branch is deleted anyway)
    await cleanupTestUser(testUser.email);
  });

  test('should do something', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', testUser.email);
    // ...
  });
});
```

### Test Fixtures

Located in `tests/fixtures/`:

```typescript
// tests/fixtures/auth.ts
export async function createTestUser(role = 'agente') {
  // Creates user in database
  // Returns { email, password }
}

export async function cleanupTestUser(email: string) {
  // Deletes user from database
}
```

---

## Troubleshooting

### "Missing NEON_API_KEY or NEON_PROJECT_ID"

Ensure `.env.local` contains both variables:

```bash
NEON_API_KEY=neon_api_key_xxx
NEON_PROJECT_ID=xxx-xxx-xxx
```

### Branch Not Deleted

If tests crash, branch may persist. Options:

1. **Wait 1 hour** — auto-expires
2. **Manual delete** — Neon Console → Branches → Delete

### Port 3000 Blocked

The script auto-kills port 3000. If issues persist:

```bash
lsof -ti:3000 | xargs kill -9
```

### Tests Failing with Empty Database

The branch is a copy of main. Ensure main has required seed data, or create test data in `beforeAll`.

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm install

      - run: pnpm playwright install --with-deps

      - run: pnpm test:e2e
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
          NEON_PROJECT_ID: ${{ secrets.NEON_PROJECT_ID }}
```

### Required Secrets

Add to GitHub → Settings → Secrets:

- `DATABASE_URL` — Main Neon connection string
- `NEON_API_KEY` — Neon API key
- `NEON_PROJECT_ID` — Neon project ID

---

## Neon Branch Limits

| Plan | Active Branches |
| ---- | --------------- |
| Free | 10              |
| Pro  | 100             |

Since branches are deleted after tests, you typically only use 1 at a time.

---

## Best Practices

1. **Always use `pnpm test:e2e`** — ensures isolation
2. **Create test data in tests** — don't rely on main DB data
3. **Cleanup is optional** — branch deletion handles it
4. **Use fixtures** — centralize test data creation
5. **Run serially for RBAC tests** — avoid race conditions

---

## Related Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Neon Branching](https://neon.tech/docs/introduction/branching)
- [NextAuth.js Testing](https://next-auth.js.org/getting-started/example)
