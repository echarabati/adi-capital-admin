# TimeKast Starter Kit — Changelog

> Registro de cambios y mejoras del Starter Kit.

---

## [2.2.0] - 2026-02-01

> 🚀 **Full CRUD + Agent Workflows + Quality Gates**

### Highlights

- Complete User Admin CRUD with RBAC
- 25 E2E tests (all passing)
- Agent workflows enhanced with /qc and /proposal
- Lighthouse PWA assertions removed (deprecated in v12+)

---

### 🆕 Features

#### User Admin CRUD (CRUD-002)

- Full CRUD for user management at `/settings/users`
- Role-based access control (ADMIN/SUPER_ADMIN only)
- Inline editing with UserFormDialog
- User invitation system with InviteUserDialog
- Soft delete pattern implementation

#### User Profile (CRUD-001)

- Self-service profile editing at `/settings/profile`
- Name and avatar management
- Secure password change flow

#### Schema Improvements

- **SCHEMA-001:** Audit fields (`createdBy`, `modifiedBy`) on all tables
- **SCHEMA-002:** Soft delete pattern (`deletedAt`, `deletedBy`)
- **SCHEMA-003:** Human ID pattern (UUID + readable ID)

#### Auth Improvements

- **AUTH-001:** Removed auto-register for SuperAdmin (security)
- **SEED-001:** SuperAdmin seed now sets `createdBy` properly

#### Database

- **DB-001:** Migrated to Neon Serverless Driver for better edge compatibility

#### PWA

- **PWA-001:** Install prompt only shown in protected routes

#### UX Improvements

- **UX-020:** Login email memory (remembers last email)
- **UX-021:** Breadcrumb global context
- **UX-023:** LCP fix for logo header
- **UX-025:** Table sorting and pagination improvements

#### Components

- **COMP-001:** Added missing shadcn components
- **COMP-002:** Renamed TableFilters → TableExtras

---

### 🧪 Testing

#### E2E Tests (TEST-004)

- `tests/e2e/user-admin.spec.ts` — 7 test cases
- Create, edit, delete user flows
- Filter by role, search by name/email
- RBAC: USER denied, ADMIN can't create SUPER_ADMIN
- Total: 25 E2E tests passing (22s)

---

### 🏭 Factory Workflows

#### /qc — Post-Implementation Quality Check (NEW)

- 9 mandatory checks before closing issues
- Issue Compliance, Tests, Patterns, Rules, Duplication
- Breaking Changes (🛑 STOP), Migration Check, Scope Creep
- Integrated in `/implement` as Phase 5

#### /proposal — Client Proposal Workflow (NEW)

- Generates client-facing proposal document
- Output: `docs/proposal/PROPOSAL.md`
- Confirmation checkpoints before delivery

#### /audit Improvements

- Agent Enforcement Rules (7 unbreakable rules)
- Verdict Decision Rules table
- Coverage < 80% en R3 = BLOCKER
- Removed PWA assertions (deprecated Lighthouse 12+)

#### /implement Improvements

- Renumbered: Phase 5 = QC, Phase 6 = Closure
- Now calls /qc automatically before closing

#### Domain Skills

- `ui/SKILL.md` — Added SIEMPRE/NUNCA section
- All workflows now have Gates/Escalation section

---

### 📚 Documentation

- **DOCS-020:** CRUD Patterns documented
- **DOCS-021:** Best Practices guide
- **DOCS-022:** Editable Tables UX patterns
- **DOCS-023:** Known Issues documented

---

### 🐛 Fixes

- `.neon` removed from git tracking (local config)
- Lighthouse PWA assertions removed (deprecated v12+)
- `docs.md` trimmed to stay under 12KB
- `implement.md` condensed for size limits

---

## [2.0.0] - 2026-01-29

### 🏭 Factory 2.0 - Skills Architecture

Major refactor of the AI-first development infrastructure. Replaces agent-based architecture with skills-based approach for better modularity and context efficiency.

### Added

#### Skills System (`.gemini/skills/`)

- **Domain Skills:** `api/`, `db/`, `security/`, `testing/`, `ui/` — Domain-specific knowledge and patterns
- **Role Skills:** `discovery/`, `docs/`, `design/`, `backlog/`, `implement/`, `architect/`, `quality-engineer/` — Role-based behaviors with templates

#### Workflows (`.agent/workflows/`)

- `/start` — Session initialization with context loading
- `/discovery` — Product discovery, generates Discovery Brief
- `/docs` — Generate planning docs (01-05)
- `/design` — Generate 06_DESIGN.md with screens, flows, components
- `/backlog` — Create issues from design spec
- `/implement` — Execute issues through 5-phase pipeline
- `/park` — Capture ideas without interrupting flow
- `/audit` — Dynamic quality audit (R0-R3 tiers)
- `/consult-architect` — Technical decisions with ADRs
- `/consult-qe` — Quality review consultation

#### Documentation

- `docs/rules/AI_RULES.md` — SSOT for agent behavior
- `docs/rules/SSOT_HIERARCHY.md` — Document authority chain

### Changed

- Moved legacy agents/prompts to `.github/` for VS Code/Copilot compatibility
- Restructured templates into skill-specific locations
- Updated `copilot-instructions.md` as lightweight pointer to AI_RULES

### Removed

- Old agent files (now in `.github/agents/` as legacy)
- Redundant workflow files (`/bugfix`, `/refactor`, `/verify`, `/pause`, `/resume`)
- Old template structure (consolidated into skills)

### Migration

No breaking changes for existing projects. New workflows are additive.

---

## [1.1.0] — 2026-01-26

> 🚀 **Documentation, DX & Quality Improvements**

### Highlights

- Backlog Visualization: Auto-generated `BOARD.md` Kanban view
- Enhanced `/implement` traceability with detailed Implementation Notes
- Lighthouse CI integrated into `/audit-pre-release` workflow
- Documentation consolidation (removed duplicate QUICKSTART.md)
- SSOT cleanup: Factory owns process, Starter Kit owns product

### New Features

- **Sprint Board (`docs/backlog/BOARD.md`):** Auto-generated from issues via `pnpm update-board`
- **Implementation Notes:** Mandatory "Context & Decisions" section in issue closure
- **Lighthouse Assertions:** Pre-release workflow now validates LCP, CLS, TBT metrics

### Developer Experience

- `scripts/tools/update-board.ts` — CLI tool for board generation
- `lint-staged` hook auto-updates board when issues are modified
- ESLint config updated to allow `console.*` in scripts
- Dependencies updated (zod 4.3.6, vitest 4.0.18, playwright 1.58.0)

### Documentation

- Consolidated QUICKSTART.md into `docs/guides/getting-started.md`
- Fixed SSOT references in `docs/README.md`
- Added documentation link section to main README

### Factory Methodology

- Git Strategy defined (`main` → `dev` → `feat/*` branches)
- Audit workflow standardized (Workflow + Prompt pattern)
- Factory `seed/` cleaned: only process files, no product docs

---

## [1.0.0] — 2026-01-22

> 🎉 **First production-ready release of TimeKast Starter Kit**

### Starter Kit

#### Highlights

- Complete auth system: password, magic link, OAuth (Google/GitHub)
- Super admin auto-provisioning
- Password reset with secure tokens
- PWA support with offline mode
- 3-theme system (Light, Midnight, Dark)
- Logger utility with environment-aware logging
- 17 routes, 12 unit tests, 13 E2E tests

#### Dependencies

- Next.js 16.1.4
- NextAuth.js 5.0.0-beta.30
- Drizzle ORM 0.45.1
- sonner 2.0.7
- lucide-react 0.562.0
- @tailwindcss v4

#### Security

**ISSUE-SK-001:** Fixed password validation bypass en super admin authentication

- **Severidad:** CRITICAL — Complete authentication bypass
- **Archivos:** `lib/auth/super-admin.ts`, `lib/auth/auth.ts`
- **Cambios:**
  - Added `password` parameter to `handleSuperAdminAccess()`
  - Implemented password validation before granting super admin access
  - Updated `SuperAdminUser` type to include password field
  - Added `verifyPassword` function to options
- **Status:** ✅ Fixed

**esbuild vulnerability:** Resolved via pnpm override (>=0.25.0)

#### Sprint 2: Email & Password Reset

- Factory pattern for email providers (Resend, SMTP, none)
- Branded email templates with optional logo
- Test endpoint `/api/email/test` with rate limiting
- Secure token generation (SHA-256 hashed)
- One token per user, 1-hour expiration
- No user enumeration (consistent responses)
- Pre-built UI: `/forgot-password`, `/reset-password`

#### Sprint 3: PWA Features

- Native manifest via Next.js (`src/app/manifest.ts`)
- Service Worker with `next-pwa` (security-first caching)
- Install UX: toast (7-day cooldown) + iOS A2HS hint
- Offline UX: banner + `/offline` fallback page
- Update UX: "Nueva versión" toast with proper SW update flow
- Cache policy: API routes `NetworkOnly` by default
- Documentation: `CACHE_POLICY.md`, `PERFORMANCE.md`

#### Sprint 4: UI Polish & DX Improvements

- Table UI Redesign (Up&Up style layout)
- Logger utility (`lib/logger.ts`)
- Icon migration from `@heroicons/react` to `lucide-react`
- OAuth account linking (Google/GitHub link to existing email)
- Custom auth error page in Spanish
- Typography plugin for legal pages
- ESLint `no-console` rule
- Tailwind spacing tokens (min-w-10, min-h-50)

#### Schema Changes

- `users.isDeleted` (boolean) → `users.deletedAt` (timestamp)
- All timestamps now use `withTimezone: true`

---

## Factory Methodology

### 2026-01-19

**Created comprehensive backlog from test-auth-app learnings:**

- EPIC-SK-001: Starter Kit Critical Fixes (9 issues)
- EPIC-FACTORY-001: Factory Methodology Improvements (3 issues)
- Total: 12 issues documented

**Issues identified:**

- 2 P0 (Critical): Password validation, drizzle.config
- 7 P1 (Important): TypeScript warnings, UX improvements
- 3 P2 (Nice to have): Polish and DX improvements

---

## Previous Work

### 2026-01-18 - 2026-01-19

**Implemented complete auth system (ADR-007):**

- NextAuth.js v5 with credentials, OAuth (Google, GitHub)
- RBAC with 3-tier roles (SUPER_ADMIN, ADMIN, USER)
- Super admin auto-registration and promotion
- Database schema compatible with Drizzle adapter
- Build passes without DATABASE_URL (conditional adapter)

**Documentation centralized:**

- Created `seed/docs/` structure in Factory
- Updated CI/CD to sync docs to starter-kit
- Moved AUTH_SETUP.md to seed/docs (SSOT)

**Testing and validation:**

- Created test-auth-app project
- Found and documented 12 bugs/improvements
- Created LEARNINGS.md and parking-lot.md

---

_Factory changelog — gestión del proyecto y templates_
