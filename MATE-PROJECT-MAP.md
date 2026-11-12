# 🗺️ MATE-PROJECT-MAP (Living Architecture & QA Context Index)
<!-- Auto-updated: 2026-11-12 | Target: Practice Software Testing (Toolshop v5.0) | Status: ZERO-TO-ONE ONBOARDING -->

This living document is the **single source of truth** for AI coding agents and Quality Engineers. It merges M.A.T.E. specification governance with project conventions, reusable components, execution commands, and agent guardrails to prevent full-repository context saturation and pattern drift.

> **CRITICAL AGENT RULE:** Every agent MUST read `MATE-PROJECT-MAP.md` before planning, generating, refactoring, or triaging any test or specification.

---

## 1. Project Identity & Technical Stack

- **Target Application:** Practice Software Testing (Toolshop) v5.0
- **Base URLs:**
  - Frontend: `https://practicesoftwaretesting.com/`
  - Backend REST API: `https://api.practicesoftwaretesting.com`
  - User Stories Source: `https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5`
- **Primary Language:** `TypeScript`
- **UI / E2E Framework:** `Playwright (@playwright/test)` with `@playwright/cli`
- **API / Contract Framework:** `Playwright APIRequestContext` (`BaseApiClient`)
- **Performance / NFR Engine:** `Grafana k6 (via rootless Podman)`
- **Mutation Testing Engine:** `Stryker Mutator (via rootless Podman, threshold >= 85%)`
- **Execution Mode:** Standalone Black-Box QA Repository (`mate-test-sdt`)

---

## 2. System Modules & Specifications (Sprint 5 Inventory)

| Module ID | Module Name | Specification File | Status | Priority Tier | Page Object / API Client |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **MOD-01** | **User Registration & Password Strength** | `specs/user-registration.mate-spec.md` | `AUTOMATED` | **P0** | `src/pages/register.page.ts` / `src/api/auth.client.ts` |
| **MOD-02** | **User Login, Locking & TOTP (2FA)** | `specs/user-login.mate-spec.md` | `AUTOMATED` | **P0** | `src/pages/login.page.ts` / `src/api/auth.client.ts` |
| **MOD-03** | **Product Overview, Search & Filters** | `specs/product-overview.mate-spec.md` | `DRAFT` | **P0** | `src/pages/catalog.page.ts` / `src/api/products.client.ts` |
| **MOD-04** | **Product Detail & Add to Cart** | `specs/product-detail.mate-spec.md` | `DRAFT` | **P0** | `src/pages/product-detail.page.ts` / `src/api/products.client.ts` |
| **MOD-05** | **Checkout – Cart Review & Discounts** | `specs/checkout-lifecycle.mate-spec.md` | `AUTOMATED` | **P0** | `src/pages/checkout.page.ts` / `src/pages/cart.page.ts` |
| **MOD-06** | **Checkout – Sign In Gate** | `specs/checkout-lifecycle.mate-spec.md` | `AUTOMATED` | **P0** | `src/pages/checkout.page.ts` |
| **MOD-07** | **Checkout – Billing & Address** | `specs/checkout-lifecycle.mate-spec.md` | `AUTOMATED` | **P0** | `src/pages/checkout.page.ts` |
| **MOD-08** | **Checkout – Payment (Advanced)** | `specs/checkout-lifecycle.mate-spec.md` | `AUTOMATED` | **P0** | `src/pages/checkout.page.ts` |
| **MOD-09** | **Rental Products & Duration Engine** | `specs/rental-products.mate-spec.md` | `DRAFT` | **P1** | `src/pages/rentals.page.ts` / `src/api/rentals.client.ts` |
| **MOD-10** | **Two-Factor Auth Setup (2FA)** | `specs/two-factor-setup.mate-spec.md` | `DRAFT` | **P1** | `src/pages/two-factor.page.ts` / `src/api/auth.client.ts` |
| **MOD-11** | **Customer Profile & Password Change** | `specs/customer-profile.mate-spec.md` | `DRAFT` | **P1** | `src/pages/profile.page.ts` / `src/api/users.client.ts` |
| **MOD-12** | **Favorites Management** | `specs/favorites.mate-spec.md` | `DRAFT` | **P1** | `src/pages/favorites.page.ts` / `src/api/favorites.client.ts` |
| **MOD-13** | **Invoices & PDF Generation** | `specs/invoices.mate-spec.md` | `DRAFT` | **P1** | `src/pages/invoices.page.ts` / `src/api/invoices.client.ts` |
| **MOD-14** | **Admin Dashboard & CRUD** | `specs/admin-dashboard.mate-spec.md` | `DRAFT` | **P1** | `src/pages/admin.page.ts` / `src/api/admin.client.ts` |
| **MOD-15** | **Geo-Location & Combination Discounts** | `specs/discounts.mate-spec.md` | `DRAFT` | **P1** | `src/components/discount.component.ts` / `src/api/cart.client.ts` |
| **MOD-16** | **Forgot Password Recovery** | `specs/forgot-password.mate-spec.md` | `DRAFT` | **P2** | `src/pages/forgot-password.page.ts` / `src/api/auth.client.ts` |
| **MOD-17** | **Messages & Inquiries** | `specs/messages.mate-spec.md` | `DRAFT` | **P2** | `src/pages/messages.page.ts` / `src/api/messages.client.ts` |
| **MOD-18** | **Contact Form (Advanced + Attachments)** | `specs/contact-form.mate-spec.md` | `DRAFT` | **P2** | `src/pages/contact.page.ts` / `src/api/contact.client.ts` |
| **MOD-19** | **Chat Widget** | `specs/chat-widget.mate-spec.md` | `DRAFT` | **P2** | `src/components/chat-widget.component.ts` |
| **MOD-20** | **Multi-Language Support (Localization)** | `specs/multi-language.mate-spec.md` | `DRAFT` | **P2** | `src/components/language-switcher.component.ts` |
| **MOD-21** | **Privacy Policy & Cookie Consent** | `specs/privacy-policy.mate-spec.md` | `DRAFT` | **P2** | `src/pages/privacy.page.ts` |
| **MOD-22** | **Browse Products by Category** | `specs/browse-categories.mate-spec.md` | `DRAFT` | **P2** | `src/components/navbar.component.ts` / `src/api/categories.client.ts` |

---

## 3. System Invariants (Sacred Rules)

Non-negotiable mathematical and business rules that must never be violated under any state transition:

- **`INV-01`**: Cart item quantities must be integers `>= 1`; zero or negative quantities must trigger item removal or validation error.
- **`INV-02`**: Checkout total calculation must hold invariant: `Total = Sum(Items * Price) - Discount + Shipping + Tax`.
- **`INV-03`**: Account locking must activate after exactly 3 consecutive failed login attempts.
- **`INV-04`**: Discount coupon codes must reject expired, invalid, or already-consumed promotional tokens.
- **`INV-05`**: Invoices must be downloadable as valid PDF files with status transitions strictly respecting `NEW -> PAID -> COMPLETED`.
- **`INV-06`**: Protected customer endpoints (Profile, Favorites, Invoices) and Admin endpoints must enforce strict 401/403 authorization checks.
- **`ORA-PERF-01`**: Product catalog search and filter responses must render within `p95 <= 800ms`.

---

## 4. Injectable Fixtures, Page Objects & Reusable Components (SOLID / DIP)

- **`BasePage`** (`./src/pages/base.page.ts`): Abstract base class enforcing zero arbitrary sleeps, locator helpers, and semantic navigation.
- **`CatalogPage`** (`./src/pages/catalog.page.ts`): Product catalog grid, search queries, category filters, and sorting.
- **`ProductDetailPage`** (`./src/pages/product-detail.page.ts`): Product information, quantity selector, and add to cart actions.
- **`CartPage`** (`./src/pages/cart.page.ts`): Cart review, totals breakdown, and multi-step checkout navigation.
- **`CheckoutPage`** (`./src/pages/checkout.page.ts`): 4-step purchase wizard (Cart Review -> Sign-In Gate -> Billing Address -> Payment & Order Confirmation).
- **`LoginPage`** (`./src/pages/login.page.ts`): Authentication form, credentials submission, and error validation.
- **`RegisterPage`** (`./src/pages/register.page.ts`): Customer registration form, mandatory field checks, password strength meter, and submission.
- **`BaseComponent`** (`./src/components/base.component.ts`): Reusable UI widget base class.
- **`NavbarComponent`** (`./src/components/navbar.component.ts`): Top navigation bar, language switcher, cart badge, and user menu.
- **`NotificationToastComponent`** (`./src/components/notification-toast.component.ts`): Reusable alert/toast component object.
- **`MateFixtures`** (`./src/fixtures/mate.fixtures.ts`): Dependency inversion fixtures (`catalogPage`, `productDetailPage`, `cartPage`, `checkoutPage`, `loginPage`, `registerPage`, `navbar`, `authenticatedCustomerPage`).
- **`BaseApiClient`** (`./src/api/base-api.client.ts`): Typed request builder with schema validation and error handling.

---

## 5. Naming Conventions & Agent Guardrails (`MUST` / `MUST NOT`)

### ✅ Agents MUST Follow:
- **Specs First:** Never generate test automation without an approved or reviewable `specs/[module].mate-spec.md`.
- **Dependency Inversion (DIP):** Inject Page Objects and API clients via fixtures (`test.extend()`).
- **Semantic Locators:** Prioritize `getByRole`, `getByLabel`, `getByTestId`.
- **Handling Uncertainty:** Never guess SLAs, auth flows, or undocumented business rules. Ask the user or mark `[TBD: needs clarification on X]` with confidence level (`Observed` vs. `Inferred`).
- **Anti-Greenwashing Mandate:** If a live feature fails against its User Story or Invariant, keep the real assertion, annotate with `test.fail(true, 'BUG-XXX: ...')`, and file a bug report in `tests/bugs/`.

### ⛔ Agents MUST NOT Do:
- **Zero Arbitrary Sleeps:** Never use `page.waitForTimeout()`, `Thread.sleep()`, or `time.sleep()`.
- **No Direct Instantiation in Tests:** Do not scatter `new SomePage(page)` across test bodies when a fixture exists.
- **No Cosmetic Assertions:** Never write `expect(res).toBeDefined()` without validating schema and business invariants.

---

## 6. Execution Commands Reference

| Operation | Command |
| :--- | :--- |
| **Validate M.A.T.E. Specs** | `npx mate-sdt validate` |
| **Audit Test Suite Health (A–F)** | `npx mate-sdt audit` |
| **Run E2E & API Tests** | `npx playwright test` |
| **Run Wave 1 P0 Smoke Shield** | `npm run test:smoke` (or `npx playwright test --project=smoke`) |
| **Run Full E2E Suite** | `npm run test:e2e` |
| **Run API Contract Suite** | `npm run test:api` |
| **Run Mutation Suite (Podman)** | `npx mate-sdt mutate` |
| **Run k6 Performance Suite (Podman)** | `npx mate-sdt k6 tests/nfr/order-load.k6.js` |
| **Create Exploratory Charter** | `npx mate-sdt charter <module>` |
| **Create Bug Report** | `npx mate-sdt bug <module>` |
| **Create Release Waiver** | `npx mate-sdt waiver <module>` |

---

## 7. Current Quality Status, Gaps & Release Governance

- **Latest Release Verdict:** `[IN_PROGRESS]` | Target: `Toolshop v5.0 Onboarding` | Date: `2026-11-12`
- **Wave 1 P0 Smoke Shield:** `14/14 PASSED` (`11.7s` runtime via `npm run test:smoke`)
- **Wave 2 Depth Modules:**
  - `MOD-01` (User Registration & Password Strength): `APPROVED` & `AUTOMATED` (UI E2E + API contract)
  - `MOD-02` (User Login, Locking & TOTP): `APPROVED` & `AUTOMATED` (UI E2E + API contract)
  - `MOD-05` to `MOD-08` (Checkout, Cart Review, Address & Payment Lifecycle): `APPROVED` & `AUTOMATED` (`specs/checkout-lifecycle.mate-spec.md`, `tests/e2e/checkout-e2e.spec.ts`)
- **Test Suite Health Score:** `A` (100/100 across 19 files verified via `npx mate-sdt audit`)
- **Podman Mutation Engine:** `Configured` (`stryker.config.json`, threshold `>= 85%`)
- **Active Release Waivers:** `None` (`./specs/waivers/`)
- **Tracked Known Defects (`test.fail` Anti-Greenwashing):**
  - `BUG-20261112-USER-REGISTRATION-01` (`./tests/bugs/BUG-20261112-user-registration.md`): Duplicate registration error message copy mismatch against Acceptance Criteria AC-06 (`"A customer with this email address already exists."` vs specified `"Email is already in use."`). Guarded by `test.fail(true)` in `tests/e2e/auth-registration.spec.ts` (`TC-REG-06`).
- **Identified Gaps & Flakiness Radar:**
  - *MOD-01, MOD-02, and MOD-05..MOD-08 fully automated with 100% AC traceability and 4-quadrant matrices. All 16 E2E tests and 4 API contract tests pass cleanly with 1 expected defect captured via test.fail(). Next priority in Wave 2: MOD-03 (Search & Filters) & MOD-04 (Product Detail & Add to Cart).*
