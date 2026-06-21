# CitySalon Codebase Audit Report

**Date:** June 18, 2026  
**Scope:** Full stack — Backend (Express/Supabase) + Frontend (Next.js 16/React 19)  
**Severity Legend:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | ℹ️ Info

---

## Table of Contents

1. [Security Issues](#1-security-issues)
2. [Performance Issues](#2-performance-issues)
3. [Bugs & Logic Issues](#3-bugs--logic-issues)
4. [Code Quality & Maintainability](#4-code-quality--maintainability)
5. [Architecture Issues](#5-architecture-issues)
6. [Accessibility Issues](#6-accessibility-issues)
7. [Infrastructure & DevOps](#7-infrastructure--devops)

---

## 1. Security Issues

### 🔴 CRITICAL

#### 1.1 Google OAuth Mock Bypass Allows Authentication Without Real Google Verification
**File:** `backend/src/services/auth.service.ts:127-140`  
**Issue:** When `GOOGLE_CLIENT_ID` is not set or the token starts with `mock-gsi-token`, the system accepts fabricated email/name from the token string and creates a fully verified user account with admin-level access. In production, this is a **full authentication bypass**.

```typescript
const isMockBypass = idToken.startsWith("mock-gsi-token") || !env.GOOGLE_CLIENT_ID;
```

**Risk:** An attacker can craft any identity (`mock-gsi-token|admin@target.com|Admin`) and get a verified, logged-in session.  
**Fix:** Remove mock bypass in production, or gate it behind `NODE_ENV === "development"`.

#### 1.2 Demo Judge Auto-Seed in Production Login Path
**File:** `backend/src/services/auth.service.ts:70-85`  
**Issue:** The login method auto-creates a hardcoded `judge@citysalon.com` user with a known password (`Password123!`) if they don't exist. This is **always active** regardless of environment.

```typescript
if (!user && normalizedEmail === "judge@citysalon.com") {
  const password_hash = await bcrypt.hash("Password123!", 12);
  user = await UserRepository.create({ ... });
}
```

**Risk:** Anyone who knows the email gets a verified account created in the DB.  
**Fix:** Remove or wrap in `NODE_ENV === "development"` check.

#### 1.3 Frontend Client-Side Auth Bypass Fallback
**File:** `frontend/src/app/auth/login/page.tsx:45-56, 78-90`  
**Issue:** When the backend is unreachable, the login page falls back to **client-side authentication** — creating a fake JWT token (`demo-jwt-bypass-token`) and storing it in localStorage, then setting the user context. This bypasses all server-side auth.

```typescript
login({ id: "demo-judge-id", full_name: "Demo Judge", email: "judge@citysalon.com" }, "demo-jwt-bypass-token");
```

**Risk:** Complete auth bypass if backend is down; fake tokens are stored and trusted by the frontend.  
**Fix:** Never perform client-side auth bypass. Show an error instead.

#### 1.4 Google Maps API Key Exposed in Client-Side Code
**File:** `frontend/src/app/(main)/salon/[id]/page.tsx:868`  
**Issue:** A Google Maps Embed API key (`AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`) is hardcoded directly in the JSX.

**Risk:** API key theft, unauthorized usage, billing fraud.  
**Fix:** Move to `NEXT_PUBLIC_` env var and restrict key by HTTP referrer in Google Cloud Console.

#### 1.5 Hardcoded Demo Credentials in Login Page
**File:** `frontend/src/app/auth/login/page.tsx:20-22`  
**Issue:** Demo credentials (`judge@citysalon.com` / `Password123!`) are displayed in the UI and used as a "Fast Pass" for judges. This is fine for hackathons but **must be removed before production**.

---

### 🟠 HIGH

#### 1.6 Supabase Admin Client Bypasses Row Level Security (RLS)
**File:** `backend/src/config/db.ts:26-34`  
**Issue:** `getSupabaseAdmin()` uses the `service_role` key which **bypasses all RLS policies**. All repository classes use this client.

**Risk:** Any authenticated owner can potentially read/modify data they don't own if ownership checks are missing in the service/controller layer.  
**Mitigation:** Verify ownership in every service method (partially done in `SalonService`, missing in others like `OwnerCustomerController`, `OwnerAppointmentController`).

#### 1.7 Missing Ownership Verification on Many Owner Endpoints
**Files:** `backend/src/controllers/owner/customer.controller.ts`, `appointment.controller.ts`  
**Issue:** Several owner endpoints accept `salonId` from params but don't verify the authenticated user actually owns that salon. For example:
- `OwnerCustomerController.list(salonId)` — no ownership check
- `OwnerAppointmentController.getByDate(salonId)` — no ownership check
- `OwnerAnalyticsController.getDashboard(salonId)` — no ownership check

**Risk:** An authenticated owner could access another salon's data by guessing/brute-forcing UUIDs.  
**Fix:** Add `SalonService.getMySalon(ownerId, salonId)` check in all owner endpoints.

#### 1.8 Customer Search Query Injection via Supabase `.or()` Filter
**File:** `backend/src/repositories/customer.repository.ts:40`  
**Issue:** The `search` parameter is interpolated directly into a Supabase `.or()` filter without sanitization:
```typescript
query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
```

**Risk:** Supabase's PostgREST `.or()` filter allows injection of additional filter conditions. An attacker could craft `search` to bypass the `salon_id` constraint and list customers from other salons.  
**Fix:** Sanitize the search input, remove commas/periods, or use a separate `ilike` filter chain.

#### 1.9 Rate Limiting is a No-Op
**File:** `backend/src/middlewares/rateLimit.middleware.ts`  
**Issue:** The global rate limiter middleware is a **pass-through placeholder** — it does nothing.

```typescript
export const rateLimitMiddleware = (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};
```

**Risk:** The auth endpoints (`/auth/login`, `/auth/register`) have no rate limiting, enabling brute-force attacks. Only the `/advisor` and `/discover` routes have proper rate limiting.  
**Fix:** Implement actual rate limiting using `express-rate-limit` (already installed but unused).

#### 1.10 Refresh Token Stored in HttpOnly Cookie But Never Validated
**Files:** `backend/src/controllers/auth.controller.ts`, `backend/src/api/v1/routes/`  
**Issue:** The refresh token is set as an HttpOnly cookie, but there is **no refresh token endpoint** to validate and rotate it. The `verifyRefreshToken` function exists but is never called.

**Risk:** Tokens cannot be rotated; long-lived tokens remain valid until expiry.  
**Fix:** Implement `/auth/refresh` endpoint that validates the refresh cookie and issues new access tokens.

#### 1.11 No CSRF Protection
**Issue:** The backend uses CORS with credentials but has no CSRF token validation. While HttpOnly cookies help, the API also accepts tokens in the `Authorization` header, making it vulnerable to CSRF in certain configurations.

**Fix:** Implement CSRF protection for cookie-based auth endpoints.

---

### 🟡 MEDIUM

#### 1.12 Sensitive Error Messages Leaked in Health Check
**Files:** `backend/src/config/app.ts:36-50`, `backend/src/api/v1/routes/health.routes.ts:14-30`  
**Issue:** The health check endpoint exposes database error messages including status codes and.statusText.

```typescript
dbStatus = `ERROR: Status ${response.status} - ${response.statusText}`;
```

**Fix:** Return only "CONNECTED" or "ERROR" without details.

#### 1.13 No Input Length Validation on Phone Numbers in Owner Schemas
**File:** `backend/src/schemas/owner.schema.ts`  
**Issue:** Staff and customer phone fields use `z.string().max(50)` but no min length or format validation.  
**Fix:** Add E.164 format validation like the auth schema.

#### 1.14 JWT Secret Strength Not Validated Beyond Min Length
**File:** `backend/src/config/env.ts:21-23`  
**Issue:** `JWT_SECRET` and `JWT_REFRESH_SECRET` only require `min(32)` characters. This is insufficient — a 32-char lowercase string has ~190 bits of entropy, which is fine, but the schema doesn't enforce complexity.

#### 1.15 Advisor Input Validation is Basic
**File:** `backend/src/controllers/advisor.controller.ts:1-45`  
**Issue:** The input sanitizer blocks SQL keywords but doesn't handle all prompt injection vectors (e.g., Unicode homoglyphs, encoded payloads). The length limit of 500 chars is good but could be stricter for the AI endpoint.

---

## 2. Performance Issues

### 🟠 HIGH

#### 2.1 N+1 Query in Analytics Service
**File:** `backend/src/services/analytics.service.ts:53-58`  
**Issue:** For each unique customer ID, a separate database query is executed to check `visit_count`:
```typescript
for (const cid of customerIds) {
  const c = await CustomerRepository.findById(cid); // N separate queries
  if (c && c.visit_count && c.visit_count <= 1) newCount++;
}
```

**Impact:** With 100 customers, this fires 100 individual DB queries.  
**Fix:** Use a batch query — `SELECT id, visit_count FROM customers WHERE id IN (...)`.

#### 2.2 Analytics Fetches All Appointments for Date Range
**File:** `backend/src/services/analytics.service.ts:14`  
**Issue:** `getStatsForPeriod` fetches **all columns** (`select("*")`) for every appointment in the range. For a busy salon with thousands of appointments, this loads massive amounts of data into memory only to count/aggregate it.

**Fix:** Use Supabase aggregation functions (count, sum) or fetch only needed columns.

#### 2.3 HeroSection Parallax Causes Re-Render on Every Scroll
**File:** `frontend/src/components/boty/hero-section.tsx:11-17`  
**Issue:** `scrollY` state updates on every scroll event, causing a re-render of the entire hero section on each pixel of scroll.

```typescript
const handleScroll = () => { setScrollY(window.scrollY) }
```

**Fix:** Use `requestAnimationFrame` throttling or CSS-only parallax (`transform: translateZ`).

#### 2.4 ProductGrid Preloads All Images on Mount
**File:** `frontend/src/components/boty/product-grid.tsx:82-86`  
**Issue:** All 12 product images are preloaded immediately via `new Image()` on mount, even if the user never scrolls to that section.

```typescript
products.forEach((product) => {
  const img = new window.Image();
  img.src = product.image;
});
```

**Fix:** Use Next.js `Image` with `loading="lazy"` and remove manual preloading.

#### 2.5 `next.config.mjs` Disables TypeScript Errors and Image Optimization
**File:** `frontend/next.config.mjs`  
**Issue:**
```javascript
typescript: { ignoreBuildErrors: true },
images: { unoptimized: true },
```
- `ignoreBuildErrors: true` means type errors won't block builds, allowing bugs to ship to production.
- `unoptimized: true` disables Next.js image optimization (resizing, format conversion, CDN caching), resulting in much larger image payloads.

**Fix:** Set `ignoreBuildErrors: false` and remove `unoptimized: true` (or use a custom image loader if not on Vercel).

#### 2.6 No React Memoization on Heavy Components
**Files:** `frontend/src/app/(main)/salon/[id]/page.tsx`, `salons-content.tsx`  
**Issue:** The salon detail page is a ~900-line component with 20+ useState hooks. Every state change re-renders the entire component tree. No `React.memo`, `useMemo`, or `useCallback` is used for expensive computations or child components.

**Fix:** Extract tab content into separate memoized components; memoize expensive computations.

#### 2.7 Advisor Routes Use In-Memory Rate Limit Tracking
**File:** `backend/src/api/v1/routes/advisor.routes.ts:7-20`  
**Issue:** `requestTimestamps` is stored in a `Map` in memory. This doesn't work in multi-instance deployments and accumulates stale entries (no cleanup/TTL).

**Fix:** Use Redis-backed rate limiting or the `express-rate-limit` store with a proper TTL.

---

## 3. Bugs & Logic Issues

### 🔴 CRITICAL

#### 3.1 User Role Fallback Always Returns "customer"
**Files:** `backend/src/services/auth.service.ts:103, 174`  
**Issue:** The JWT payload uses `(user as any).role || "customer"`, which always falls back to `"customer"` because `role` is never populated from the database:
```typescript
const payload = { userId: user.id!, email: user.email, role: (user as any).role || "customer" };
```

The `UserRow` interface doesn't include a `role` field that maps from the database, so **even salon owners get the `"customer"` role** in their JWT, meaning `requireOwner` middleware would reject them.

**Fix:** Either add `role` to `UserRow` and ensure it's fetched from the DB, or use a separate lookup.

#### 3.2 Owner Routes Would Be Inaccessible (Role Mismatch)
**Files:** `backend/src/middlewares/auth.middleware.ts:29-35`, `backend/src/api/v1/routes/owner.routes.ts`  
**Issue:** Combined with Bug 3.1, all owner dashboard routes would fail with 403 Forbidden because the JWT role is always `"customer"`.

**Fix:** This is critical — the owner dashboard is completely non-functional without this fix.

### 🟠 HIGH

#### 3.3 `verifyEmail` Returns `undefined` Instead of `UserRow` on Update
**File:** `backend/src/services/auth.service.ts:80-85`  
**Issue:** `UserRepository.update()` returns a `UserRow`, but `googleLogin` assigns the result without awaiting:
```typescript
user = await UserRepository.update(user.id!, { ... });
```
This works, but the type is `UserRow` which could be null if the update fails silently. The `update` method in `UserRepository` uses `.single()` which will throw, so this is actually okay — but the pattern is inconsistent.

#### 3.4 `forgotPasswordSchema` Validates Body but Controller Doesn't Validate Schema
**File:** `backend/src/controllers/auth.controller.ts:37-41`  
**Issue:** The `verifyEmail` controller uses `req.query.token` but there's no query schema validation for it — it just does a manual `if (!token)` check. While not a bug per se, the token from `query` could be an array if multiple `?token=` params are provided.

**Fix:** Add Zod validation for the query parameter.

#### 3.5 `DateQuerySchema` Required on Appointment List Endpoint
**File:** `backend/src/api/v1/routes/owner.routes.ts:46`  
**Issue:** The `GET /:salonId/appointments` route requires `validate(dateQuerySchema)`, which mandates a `date` query param. But the controller accesses `req.query.date` without a fallback. If a user navigates to appointments without a date, they get a 400 error instead of defaulting to today.

**Fix:** Make date optional with a default to today's date.

#### 3.6 Salon Detail Page Uses Static Data, Not API
**File:** `frontend/src/app/(main)/salon/[id]/page.tsx:7`  
**Issue:** The salon detail page imports from `@/data/salons` (static mock data) instead of fetching from the API. This means:
- Real salon data from the database is never shown
- Any salon not in the mock data shows "Salon not found"
- The booking page also uses static data

**Fix:** Fetch salon data from the API using the salon ID from params.

#### 3.7 Booking Confirmation Doesn't Actually Call the API
**File:** `frontend/src/app/(main)/salon/[id]/book/page.tsx:93-95`  
**Issue:** The `handleBooking` function just sets `setIsBooked(true)` — it never calls the backend to create an appointment.

**Fix:** Call `apiFetch("/owner/${salonId}/appointments", { method: "POST", bodyData: {...} })`.

### 🟡 MEDIUM

#### 3.8 Cart Context Not Persisted Across Page Refreshes
**File:** `frontend/src/components/boty/cart-context.tsx`  
**Issue:** The cart is stored only in React state. On page refresh, the cart is lost. Unlike the auth context which uses localStorage, the cart doesn't persist.

**Fix:** Add localStorage persistence similar to the auth context.

#### 3.9 `apiFetch` Returns Envelope, Not Data
**File:** `frontend/src/lib/api.ts`  
**Issue:** The `apiFetch` function returns the full response object (including `{success, message, data, meta}`), but callers like the login page access `response.data.accessToken`. This works but is fragile — if the API response shape changes, all callers break.

**Fix:** Unwrap `data` from the response in `apiFetch` or create typed response helpers.

#### 3.10 Enquiry Form Has No Backend Endpoint
**File:** `frontend/src/app/(main)/salon/[id]/page.tsx:883-887`  
**Issue:** The "Send Enquiry" modal just sets `setEnquirySent(true)` locally. No API call is made. The enquiry data (name, phone, message) is discarded.

#### 3.11 Review Form Has No Backend Endpoint
**File:** `frontend/src/app/(main)/salon/[id]/page.tsx:383-420`  
**Issue:** Similar to enquiries — the review form collects data but never submits it anywhere.

---

## 4. Code Quality & Maintainability

### 🟡 MEDIUM

#### 4.1 Excessive `console.log` Statements in Production Code
**Files:** `frontend/src/app/api/advisor/chat/route.ts:93-200`, `frontend/src/app/auth/login/page.tsx:51,89`  
**Issue:** Multiple `console.log`, `console.warn`, `console.error` statements scattered throughout frontend and backend code. The backend has a proper logger, but the frontend uses raw console methods.

**Fix:** Create a frontend logger utility or use a library like `next-logger`.

#### 4.2 Duplicated Rate Limiting Logic
**Files:** `frontend/src/components/advisor/advisor-chat.tsx:58-62`, `advisor-discover.tsx:51-55`  
**Issue:** Client-side rate limiting is implemented identically in two components. Should be extracted to a shared hook.

#### 4.3 Duplicated Input Validation
**Files:** `backend/src/controllers/advisor.controller.ts:1-45`, `frontend/src/components/advisor/advisor-chat.tsx:28-33`, `advisor-discover.tsx:37-42`  
**Issue:** The same injection patterns and validation logic exist in both backend and frontend, with slightly different implementations. The frontend patterns are a subset of the backend ones.

**Fix:** Keep validation authoritative on the backend only. Frontend validation should be UX-only.

#### 4.4 Massive Single-File Components
**Files:** `frontend/src/app/(main)/salon/[id]/page.tsx` (~900 lines), `salons-content.tsx` (~400 lines)  
**Issue:** The salon detail page is a single file with all tabs, sidebar, enquiry modal, and mobile kart bar. This makes maintenance and testing difficult.

**Fix:** Extract each tab into its own component file.

#### 4.5 No Type Definitions for API Responses
**File:** `frontend/src/lib/api.ts`  
**Issue:** `apiFetch<T>` returns `T` but no actual types are defined for API responses. Callers use `any` assertions throughout.

#### 4.6 Unused Imports and Dead Code
**File:** `frontend/src/app/(main)/salon/[id]/page.tsx`  
**Issue:** Many Lucide icons are imported but not all are used (e.g., `Navigation`, `ShoppingBag` may be used but there are many others imported in bulk). The `@tabler/icons-react` package was added to `package.json` but only used in the owner layout — check if both icon libraries are needed.

#### 4.7 Mixed Icon Libraries
**Files:** `frontend/src/app/(owner)/layout.tsx` (uses `@tabler/icons-react`), all other files (use `lucide-react`)  
**Issue:** Two icon libraries are installed. The owner dashboard was migrated to Tabler icons while the rest of the app uses Lucide. This increases bundle size and creates inconsistency.

**Fix:** Standardize on one icon library.

---

## 5. Architecture Issues

### 🟠 HIGH

#### 5.1 No API Response Caching
**Issue:** Every page load and navigation triggers fresh API calls. The frontend doesn't use SWR, React Query, or any caching strategy. Static data like salon listings are hardcoded rather than fetched.

**Fix:** Implement a data fetching library (SWR or TanStack Query) with appropriate cache strategies.

#### 5.2 Frontend Has Two Parallel "Advisor" Implementations
**Files:** `frontend/src/app/api/advisor/chat/route.ts` (Next.js API route), `backend/src/services/advisor.service.ts` + `backend/src/controllers/advisor.controller.ts` (Express backend)  
**Issue:** The AI advisor has **two independent backend implementations**:
1. A Next.js API route (`/api/advisor/chat`) that calls Gemini directly
2. An Express backend route (`/api/v1/advisor`) that also calls Gemini

Both do similar things but with different prompts and behavior. This is confusing and maintenance-heavy.

**Fix:** Consolidate to one implementation (preferably the Express backend).

#### 5.3 No Error Boundaries in Frontend
**Issue:** React Error Boundaries are not implemented. If any component throws during render, the entire app crashes with a white screen.

**Fix:** Add error boundaries around route segments.

#### 5.4 No Database Migrations in Version Control
**File:** `backend/scripts/migration.sql`  
**Issue:** SQL migrations exist but there's no migration runner (like Knex, Prisma Migrate, or Supabase CLI). Migrations appear to be manual one-off scripts.

**Fix:** Adopt a migration tool for reproducible schema changes.

### 🟡 MEDIUM

#### 5.5 Static Data Mixed with API Data
**Files:** `frontend/src/data/salons.ts`, `salons-list.ts`, `salons-advisor.ts`  
**Issue:** Three separate static data files exist for salons with different shapes and content. The actual API database has salon data too. This creates confusion about the source of truth.

**Fix:** Remove static data files and fetch everything from the API.

#### 5.6 No Logging Correlation IDs
**Issue:** Backend logs don't include request IDs for tracing. When debugging production issues, it's impossible to correlate logs across middleware, services, and repositories for a single request.

**Fix:** Add request ID middleware (e.g., using `uuid`) and include it in all log entries.

---

## 6. Accessibility Issues

### 🟡 MEDIUM

#### 6.1 Missing Skip-to-Content Link
**Issue:** No skip navigation link is present. Keyboard users must tab through all header links to reach page content.  
**Fix:** Add `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>`.

#### 6.2 Missing ARIA Labels on Interactive Elements
**Files:** `frontend/src/app/(main)/salons/salons-content.tsx`, `book/page.tsx`  
**Issue:** Several interactive elements lack `aria-label`:
- Category filter buttons in `SalonsContent`
- Date selection buttons in booking flow
- Time slot buttons
- Filter/sort controls

#### 6.3 Focus Management Missing on Modal Open/Close
**Files:** `frontend/src/app/(main)/salon/[id]/page.tsx` (Enquiry Modal)  
**Issue:** When the enquiry modal opens, focus is not trapped inside it. When it closes, focus doesn't return to the trigger button.

**Fix:** Implement focus trapping and return focus on close.

#### 6.4 Color Contrast Issues in Some Combinations
**Issue:** The `muted-foreground` color (`#6E6960` on `#FAFAF7`) has a contrast ratio of ~4.5:1, which barely passes AA for normal text but fails for small text sizes.

#### 6.5 No `prefers-reduced-motion` Support
**File:** `frontend/src/app/globals.css`  
**Issue:** Multiple animations (blur-in, fade-in, float, shimmer) don't respect `prefers-reduced-motion`. Users with vestibular disorders may experience discomfort.

**Fix:** Add `@media (prefers-reduced-motion: reduce)` to disable animations.

---

## 7. Infrastructure & DevOps

### 🟠 HIGH

#### 7.1 No `.env.example` File
**Issue:** The project has no `.env.example` documenting required environment variables. New developers must read the Zod schema in `env.ts` to understand what's needed.

**Fix:** Create `.env.example` with all required vars and descriptions.

#### 7.2 `typescript` Version Mismatch Between Backend and Frontend
**Files:** `backend/package.json` (typescript `^6.0.3`), `frontend/package.json` (typescript `^5.9.3`)  
**Issue:** Backend uses TypeScript 6.x while frontend uses 5.x. This can cause inconsistent type checking behavior and is unusual (TypeScript 6 is very new as of June 2026).

#### 7.3 No Docker or Container Configuration
**Issue:** No `Dockerfile`, `docker-compose.yml`, or container configuration exists. This makes deployment inconsistent across environments.

#### 7.4 No CI/CD Pipeline
**Issue:** No GitHub Actions, GitLab CI, or similar configuration is present. Builds, tests, and deployments are likely manual.

#### 7.5 No Test Files
**Issue:** There are zero test files in the entire codebase. No unit tests, integration tests, or E2E tests exist.

---

## Summary Statistics

| Category | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | Total |
|----------|-------------|---------|-----------|--------|-------|
| Security | 5 | 6 | 4 | 0 | **15** |
| Performance | 0 | 3 | 4 | 0 | **7** |
| Bugs | 2 | 4 | 4 | 0 | **10** |
| Code Quality | 0 | 0 | 7 | 0 | **7** |
| Architecture | 0 | 3 | 3 | 0 | **6** |
| Accessibility | 0 | 0 | 5 | 0 | **5** |
| Infrastructure | 0 | 2 | 3 | 0 | **5** |
| **Total** | **7** | **18** | **30** | **0** | **55** |

---

## Top 10 Prioritized Fixes

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| 1 | Fix user role always being "customer" (Bug 3.1/3.2) | Owner dashboard is broken | Low |
| 2 | Remove Google OAuth mock bypass in production (Sec 1.1) | Auth bypass | Low |
| 3 | Remove demo judge auto-seed from production (Sec 1.2) | Unauthorized account creation | Low |
| 4 | Remove frontend client-side auth bypass (Sec 1.3) | Complete auth bypass | Low |
| 5 | Implement actual rate limiting on auth endpoints (Sec 1.9) | Brute-force protection | Medium |
| 6 | Add ownership verification to all owner endpoints (Sec 1.7) | Data isolation | Medium |
| 7 | Fix N+1 query in analytics (Perf 2.1) | Performance at scale | Low |
| 8 | Remove `ignoreBuildErrors: true` and `unoptimized: true` (Perf 2.5) | Type safety + image perf | Low |
| 9 | Add localStorage persistence to cart (Bug 3.8) | UX improvement | Low |
| 10 | Consolidate advisor implementations (Arch 5.2) | Reduce maintenance burden | Medium |

---

*Report generated by automated codebase audit. Manual review recommended for all critical and high severity items.*
