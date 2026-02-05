# 📦 INVENTORY

> **Auto-generated** — Run `pnpm generate:inventory` to update
> **Regla:** SIEMPRE consultar antes de crear algo nuevo.
> **Last updated:** 2026-02-05

---

## 📚 Dependencies

| Package | Version |
|---------|--------|
| @auth/drizzle-adapter | 1.11.1 |
| @ducanh2912/next-pwa | 10.2.9 |
| @headlessui/react | 2.2.9 |
| @hookform/resolvers | 5.2.2 |
| @neondatabase/serverless | 1.0.2 |
| @radix-ui/react-alert-dialog | 1.1.15 |
| @radix-ui/react-dialog | 1.1.15 |
| @radix-ui/react-dropdown-menu | 2.1.16 |
| @radix-ui/react-separator | 1.1.8 |
| @radix-ui/react-slot | 1.2.4 |
| @radix-ui/react-switch | 1.2.6 |
| @radix-ui/react-tabs | 1.1.13 |
| @radix-ui/react-tooltip | 1.2.8 |
| @sentry/nextjs | 10.36.0 |
| @upstash/ratelimit | 2.0.8 |
| @upstash/redis | 1.36.1 |
| bcryptjs | 3.0.3 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| drizzle-orm | 0.45.1 |
| lucide-react | 0.562.0 |
| next | 16.1.6 |
| next-auth | 5.0.0-beta.30 |
| next-themes | 0.4.6 |
| nodemailer | 7.0.12 |
| react | 19.2.3 |
| react-dom | 19.2.3 |
| react-hook-form | 7.71.1 |
| resend | 6.8.0 |
| sonner | 2.0.7 |
| tailwind-merge | 3.4.0 |
| zod | 4.3.6 |

---

## 🛠️ NPM Scripts

| Command | Script |
|---------|--------|
| `pnpm dev` | `node scripts/tools/dev.mjs` |
| `pnpm dev:next` | `next dev --turbopack` |
| `pnpm build` | `next build` |
| `pnpm start` | `next start` |
| `pnpm lint` | `eslint .` |
| `pnpm lint:fix` | `eslint . --fix` |
| `pnpm update-board` | `tsx scripts/tools/update-board.ts` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | `prettier --write .` |
| `pnpm format:check` | `prettier --check .` |
| `pnpm test` | `vitest run` |
| `pnpm test:watch` | `vitest` |
| `pnpm test:coverage` | `vitest run --coverage` |
| `pnpm test:e2e` | `tsx scripts/e2e/e2e-isolated.ts` |
| `pnpm test:e2e:ui` | `playwright test --ui` |
| `pnpm verify` | `pnpm lint && pnpm typecheck && pnpm test` |
| `pnpm env:check` | `node -e "require('./lib/env.ts')" 2>/dev/null |...` |
| `pnpm db:generate` | `drizzle-kit generate` |
| `pnpm db:migrate` | `drizzle-kit migrate` |
| `pnpm db:push` | `drizzle-kit push` |
| `pnpm db:studio` | `drizzle-kit studio` |
| `pnpm db:seed` | `tsx --require dotenv/config lib/db/seed.ts dote...` |
| `pnpm db:seed:admin` | `tsx --require dotenv/config lib/db/seeds/admin....` |
| `pnpm prepare` | `husky` |
| `pnpm pwa:check` | `echo 'Starting Lighthouse PWA audit...' && npx ...` |
| `pnpm setup:e2e` | `tsx scripts/e2e/setup-e2e.ts` |
| `pnpm lighthouse` | `lhci autorun` |
| `pnpm lighthouse:collect` | `lhci collect --url=http://localhost:3000` |
| `pnpm lighthouse:assert` | `lhci assert` |
| `pnpm generate:inventory` | `node scripts/tools/generate-inventory.mjs` |

---

## 🛣️ Page Routes

| Route | File |
|-------|------|
| / | `src/app/page.tsx` |
| /accept-invite | `src/app/(auth)/accept-invite/page.tsx` |
| /dashboard | `src/app/(protected)/dashboard/page.tsx` |
| /error | `src/app/(auth)/error/page.tsx` |
| /fondos | `src/app/(protected)/fondos/page.tsx` |
| /fondos/[id] | `src/app/(protected)/fondos/[id]/page.tsx` |
| /fondos/[id]/beneficiarios | `src/app/(protected)/fondos/[id]/beneficiarios/page.tsx` |
| /fondos/[id]/cuentas | `src/app/(protected)/fondos/[id]/cuentas/page.tsx` |
| /fondos/[id]/proyectos | `src/app/(protected)/fondos/[id]/proyectos/page.tsx` |
| /fondos/[id]/proyectos/[proyectoId] | `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/page.tsx` |
| /fondos/[id]/proyectos/[proyectoId]/documentos | `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/documentos/page.tsx` |
| /fondos/[id]/proyectos/[proyectoId]/inversiones | `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/inversiones/page.tsx` |
| /fondos/[id]/proyectos/[proyectoId]/movimientos | `src/app/(protected)/fondos/[id]/proyectos/[proyectoId]/movimientos/page.tsx` |
| /forgot-password | `src/app/(auth)/forgot-password/page.tsx` |
| /inversiones/[id] | `src/app/(protected)/inversiones/[id]/page.tsx` |
| /inversiones/[id]/calendario | `src/app/(protected)/inversiones/[id]/calendario/page.tsx` |
| /inversiones/[id]/movimientos | `src/app/(protected)/inversiones/[id]/movimientos/page.tsx` |
| /inversionistas | `src/app/(protected)/inversionistas/page.tsx` |
| /inversionistas/[id] | `src/app/(protected)/inversionistas/[id]/page.tsx` |
| /inversionistas/[id]/documentos | `src/app/(protected)/inversionistas/[id]/documentos/page.tsx` |
| /inversionistas/[id]/inversiones | `src/app/(protected)/inversionistas/[id]/inversiones/page.tsx` |
| /inversionistas/[id]/movimientos | `src/app/(protected)/inversionistas/[id]/movimientos/page.tsx` |
| /login | `src/app/(auth)/login/page.tsx` |
| /offline | `src/app/offline/page.tsx` |
| /privacy | `src/app/(legal)/privacy/page.tsx` |
| /register | `src/app/(auth)/register/page.tsx` |
| /reset-password | `src/app/(auth)/reset-password/page.tsx` |
| /settings/profile | `src/app/(protected)/settings/profile/page.tsx` |
| /settings/users | `src/app/(protected)/settings/users/page.tsx` |
| /terms | `src/app/(legal)/terms/page.tsx` |

---

## 🔌 API Routes

| Endpoint | File |
|----------|------|
| /api/auth/[...nextauth] | `src/app/api/auth/[...nextauth]/route.ts` |
| /api/auth/forgot-password | `src/app/api/auth/forgot-password/route.ts` |
| /api/auth/reset-password | `src/app/api/auth/reset-password/route.ts` |
| /api/email/test | `src/app/api/email/test/route.ts` |
| /api/health | `src/app/api/health/route.ts` |
| /api/invites/accept | `src/app/api/invites/accept/route.ts` |
| /api/invites/send | `src/app/api/invites/send/route.ts` |
| /api/invites/validate | `src/app/api/invites/validate/route.ts` |

---

## UI Primitives (shadcn)

📁 `components/ui/`

| Name | Import |
|------|--------|
| Avatar | `@/components/ui/Avatar` |
| Badge | `@/components/ui/Badge` |
| Breadcrumb | `@/components/ui/Breadcrumb` |
| ConfirmDialog | `@/components/ui/ConfirmDialog` |
| DataTable | `@/components/ui/DataTable` |
| Pagination | `@/components/ui/Pagination` |
| Skeleton | `@/components/ui/Skeleton` |
| Table | `@/components/ui/Table` |
| TableExtras | `@/components/ui/TableExtras` |
| TableFilter | `@/components/ui/TableFilter` |
| ThemeToggle | `@/components/ui/ThemeToggle` |
| alert-dialog | `@/components/ui/alert-dialog` |
| button | `@/components/ui/button` |
| card | `@/components/ui/card` |
| dialog | `@/components/ui/dialog` |
| dropdown-menu | `@/components/ui/dropdown-menu` |
| input | `@/components/ui/input` |
| separator | `@/components/ui/separator` |
| sheet | `@/components/ui/sheet` |
| sonner | `@/components/ui/sonner` |
| switch | `@/components/ui/switch` |
| tabs | `@/components/ui/tabs` |
| tooltip | `@/components/ui/tooltip` |

---

## Common Components

📁 `components/common/`

| Name | Import |
|------|--------|
| BreadcrumbSetter | `@/components/common/BreadcrumbSetter` |
| EmptyState | `@/components/common/EmptyState` |
| ErrorBoundary | `@/components/common/ErrorBoundary` |
| Footer | `@/components/common/Footer` |
| OfflineBanner | `@/components/common/OfflineBanner` |

---

## Layout Components

📁 `components/layout/`

| Name | Import |
|------|--------|
| DashboardLayout | `@/components/layout/DashboardLayout` |
| Header | `@/components/layout/Header` |
| MobileDrawer | `@/components/layout/MobileDrawer` |
| NavigationControls | `@/components/layout/NavigationControls` |
| Sidebar | `@/components/layout/Sidebar` |

---

## Form Components

📁 `components/form/`

| Name | Import |
|------|--------|
| Form | `@/components/form/Form` |
| FormCheckbox | `@/components/form/FormCheckbox` |
| FormField | `@/components/form/FormField` |
| FormSelect | `@/components/form/FormSelect` |
| SubmitButton | `@/components/form/SubmitButton` |

---

## Dashboard Components

📁 `components/dashboard/`

| Name | Import |
|------|--------|
| QuickActions | `@/components/dashboard/QuickActions` |
| RecentUsersTable | `@/components/dashboard/RecentUsersTable` |
| StatsCards | `@/components/dashboard/StatsCards` |

---

## Auth Components

📁 `components/auth/`

| Name | Import |
|------|--------|
| AcceptInviteForm | `@/components/auth/AcceptInviteForm` |
| ForgotPasswordForm | `@/components/auth/ForgotPasswordForm` |
| LoginForm | `@/components/auth/LoginForm` |
| ResetPasswordForm | `@/components/auth/ResetPasswordForm` |

---

## PWA Components

📁 `components/pwa/`

| Name | Import |
|------|--------|
| IosA2hsHint | `@/components/pwa/IosA2hsHint` |
| PwaInstallToast | `@/components/pwa/PwaInstallToast` |
| PwaUpdateToast | `@/components/pwa/PwaUpdateToast` |

---

## Branding Components

📁 `components/branding/`

| Name | Import |
|------|--------|
| BrandLogo | `@/components/branding/BrandLogo` |

---

## Providers

📁 `components/providers/`

| Name | Import |
|------|--------|
| Providers | `@/components/providers/Providers` |
| ThemeProvider | `@/components/providers/ThemeProvider` |

---

## Hooks

📁 `lib/hooks/`

| Name | Import |
|------|--------|
| useMounted | `@/lib/hooks/useMounted` |
| usePermissions | `@/lib/hooks/usePermissions` |
| useServerTableState | `@/lib/hooks/useServerTableState` |
| useTableState | `@/lib/hooks/useTableState` |

---

## Auth Utilities

📁 `lib/auth/`

| Name | Import |
|------|--------|
| auth | `@/lib/auth/auth` |
| password-reset | `@/lib/auth/password-reset` |
| permissions | `@/lib/auth/permissions` |
| super-admin | `@/lib/auth/super-admin` |
| utils | `@/lib/auth/utils` |

---

## Database Schema

📁 `lib/db/schema/`

| Name | Import |
|------|--------|
| audit | `@/lib/db/schema/audit` |
| beneficiarios | `@/lib/db/schema/beneficiarios` |
| calendario-pagos | `@/lib/db/schema/calendario-pagos` |
| cuentas-bancarias | `@/lib/db/schema/cuentas-bancarias` |
| enums | `@/lib/db/schema/enums` |
| fondos | `@/lib/db/schema/fondos` |
| inversiones | `@/lib/db/schema/inversiones` |
| inversionistas | `@/lib/db/schema/inversionistas` |
| invites | `@/lib/db/schema/invites` |
| movimientos | `@/lib/db/schema/movimientos` |
| proyectos | `@/lib/db/schema/proyectos` |
| user-fondos | `@/lib/db/schema/user-fondos` |
| users | `@/lib/db/schema/users` |

---

## Email Templates

📁 `lib/email/templates/`

| Name | Import |
|------|--------|
| invite-accepted | `@/lib/email/templates/invite-accepted` |
| invite-user | `@/lib/email/templates/invite-user` |
| layout | `@/lib/email/templates/layout` |
| login-alert | `@/lib/email/templates/login-alert` |
| magic-link | `@/lib/email/templates/magic-link` |
| password-changed | `@/lib/email/templates/password-changed` |
| password-reset | `@/lib/email/templates/password-reset` |
| password-reset-confirm | `@/lib/email/templates/password-reset-confirm` |
| verify-email | `@/lib/email/templates/verify-email` |

---

## Utilities

📁 `lib/utils/`

| Name | Import |
|------|--------|
| cn | `@/lib/utils/cn` |
| human-id | `@/lib/utils/human-id` |
| human-id.test | `@/lib/utils/human-id.test` |

---

## PWA Utilities

📁 `lib/pwa/`

| Name | Import |
|------|--------|
| sw-listener | `@/lib/pwa/sw-listener` |
| usePwaInstall | `@/lib/pwa/usePwaInstall` |

---

## 📊 Summary

| Metric | Value |
|--------|-------|
| Dependencies | 32 |
| Page Routes | 30 |
| API Routes | 8 |
| Components & Utils | 117 |
| **Total items** | **187** |

---

_Generated by `scripts/generate-inventory.mjs`_
