# ♟️ Master Test Strategy — Practice Software Testing (Toolshop v5.0)

* **Document Status:** `ACTIVE (ZERO-TO-ONE QA REPO ONBOARDING)`
* **Last Updated:** `2026-11-12`
* **QA Repository Topology:** `Standalone Black-Box QA Repo (mate-test-sdt)`
* **Target Application URLs:**
  * **Frontend (Production Live):** `https://practicesoftwaretesting.com/`
  * **Backend REST API:** `https://api.practicesoftwaretesting.com`
  * **User Stories Reference:** `https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5`

---

## 1. Executive Summary & Quality Objectives

This Master Test Strategy governs the quality engineering architecture for **Practice Software Testing (Toolshop v5.0)** using the **M.A.T.E. Method (Spec-Driven Testing Framework)**.

* **Primary Objective:** Build a robust, scalable, Object-Oriented (OOP/SOLID) test automation framework in TypeScript with Playwright to achieve 100% specification traceability across all Sprint 5 user stories.
* **Anti-Greenwashing Mandate:** The User Stories (`v5.md`) and formalized specifications (`*.mate-spec.md`) are the source of truth—never the live application when it misbehaves. If a test fails against the live website due to an application bug, **the test is preserved with its true expected assertion**, annotated with `test.fail(true, 'BUG-XXX: ...')`, and documented in `docs/bugs/BUG-*.md`. We never weaken assertions or delete tests to produce fake green dashboards.
* **Execution Paradigm:** Two-Wave rollout—Wave 1 builds an immediate P0 Smoke Survival Shield across critical user journeys; Wave 2 deepens coverage module-by-module across all 4 quadrants (Happy, Border, Negative, and Forbidden State Transitions).

---

## 2. Sprint 5 Module Inventory & Business Risk Matrix

Risk scores are calculated using the deterministic M.A.T.E. formula:
$$\text{Risk Score} = \text{Business Impact } (1\text{–}5) \times \text{Failure Probability / Technical Complexity } (1\text{–}5)$$

| Module ID | Business Module / User Story | Impact (1–5) | Prob (1–5) | Risk Score | Priority Tier | Wave 1 Smoke | Wave 2 Deep Spec |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **MOD-01** | **User Registration & Password Strength** | 5 | 4 | **20** | **P0 (Critical)** | ✅ Yes | `specs/user-registration.mate-spec.md` |
| **MOD-02** | **User Login, Locking & TOTP (2FA)** | 5 | 5 | **25** | **P0 (Critical)** | ✅ Yes | `specs/user-login.mate-spec.md` |
| **MOD-03** | **Product Overview, Search & Filters** | 4 | 4 | **16** | **P0 (Critical)** | ✅ Yes | `specs/product-overview.mate-spec.md` |
| **MOD-04** | **Product Detail & Add to Cart** | 5 | 4 | **20** | **P0 (Critical)** | ✅ Yes | `specs/product-detail.mate-spec.md` |
| **MOD-05** | **Checkout – Cart Review & Discounts** | 5 | 4 | **20** | **P0 (Critical)** | ✅ Yes | `specs/checkout-lifecycle.mate-spec.md` |
| **MOD-06** | **Checkout – Sign In Gate** | 5 | 3 | **15** | **P0 (Critical)** | ✅ Yes | `specs/checkout-lifecycle.mate-spec.md` |
| **MOD-07** | **Checkout – Billing & Address** | 5 | 3 | **15** | **P0 (Critical)** | ✅ Yes | `specs/checkout-lifecycle.mate-spec.md` |
| **MOD-08** | **Checkout – Payment (Advanced Methods)** | 5 | 5 | **25** | **P0 (Critical)** | ✅ Yes | `specs/checkout-lifecycle.mate-spec.md` |
| **MOD-09** | **Rental Products & Duration Engine** | 4 | 3 | **12** | **P1 (High)** | ➖ Post-P0 | `specs/rental-products.mate-spec.md` |
| **MOD-10** | **Two-Factor Auth Setup (2FA)** | 4 | 3 | **12** | **P1 (High)** | ➖ Post-P0 | `specs/two-factor-setup.mate-spec.md` |
| **MOD-11** | **Customer Profile & Password Change** | 4 | 3 | **12** | **P1 (High)** | ➖ Post-P0 | `specs/customer-profile.mate-spec.md` |
| **MOD-12** | **Favorites Management** | 3 | 3 | **9** | **P1 (High)** | ➖ Post-P0 | `specs/favorites.mate-spec.md` |
| **MOD-13** | **Invoices & PDF Generation** | 4 | 3 | **12** | **P1 (High)** | ➖ Post-P0 | `specs/invoices.mate-spec.md` |
| **MOD-14** | **Admin Dashboard & CRUD Operations** | 4 | 4 | **16** | **P1 (High)** | ➖ Post-P0 | `specs/admin-dashboard.mate-spec.md` |
| **MOD-15** | **Geo-Location & Combination Discounts** | 4 | 3 | **12** | **P1 (High)** | ➖ Post-P0 | `specs/discounts.mate-spec.md` |
| **MOD-16** | **Forgot Password Recovery** | 3 | 2 | **6** | **P2 (Normal)** | ➖ Post-P1 | `specs/forgot-password.mate-spec.md` |
| **MOD-17** | **Messages & Inquiries** | 3 | 2 | **6** | **P2 (Normal)** | ➖ Post-P1 | `specs/messages.mate-spec.md` |
| **MOD-18** | **Contact Form (Advanced + Attachments)** | 3 | 2 | **6** | **P2 (Normal)** | ➖ Post-P1 | `specs/contact-form.mate-spec.md` |
| **MOD-19** | **Chat Widget** | 2 | 2 | **4** | **P2 (Normal)** | ➖ Post-P1 | `specs/chat-widget.mate-spec.md` |
| **MOD-20** | **Multi-Language Support (Localization)** | 3 | 2 | **6** | **P2 (Normal)** | ➖ Post-P1 | `specs/multi-language.mate-spec.md` |
| **MOD-21** | **Privacy Policy & Cookie Consent** | 2 | 1 | **2** | **P2 (Normal)** | ➖ Post-P1 | `specs/privacy-policy.mate-spec.md` |
| **MOD-22** | **Browse Products by Category** | 3 | 2 | **6** | **P2 (Normal)** | ➖ Post-P1 | `specs/browse-categories.mate-spec.md` |

---

## 3. Two-Wave Implementation Roadmap

### Wave 1: The 72-Hour P0 Smoke Survival Shield (`npm run test:smoke`)
* **Goal:** Immediately establish an automated safety net protecting the revenue and primary customer journeys across the live application.
* **Scope:** 5 Core Golden Paths:
  1. **Catalog & Search:** Navigate to homepage, search for a product, apply category filter, verify results.
  2. **Product Detail & Cart:** Open product, select quantity, add to cart, verify cart badge increments.
  3. **Cart Review & Checkout Navigation:** Proceed to checkout, review cart totals, verify breakdown formula (`INV-02`).
  4. **Authentication & Session:** Customer login with valid credentials, session establishment, profile menu visibility.
  5. **Checkout & Order Completion:** Complete checkout with payment method, verify confirmation order ID and invoice creation.
* **Target Execution Time:** `< 2.5 minutes` total execution in CI/CD.

### Wave 2: Module-by-Module 4-Quadrant Deepening
Following the priority tiers (`P0` ➔ `P1` ➔ `P2`), each module executes the standardized M.A.T.E. engineering loop:
1. **Model (`mate-model`):** Author `specs/[module].mate-spec.md` with Finite State Machine, Invariants, and Explicit Forbidden Transitions. Validate with `npx mate-sdt validate`.
2. **QA Companion (`mate-story-testcases`):** Generate `docs/test-cases/TC-[module].md` and `.csv` covering:
   - `HAPPY_PATH` (standard successful user flows)
   - `BORDER_CASE` (boundary values, min/max characters, price edge cases)
   - `NEGATIVE_PATH` (invalid formats, missing required fields, 4xx responses)
   - `STATE_TRANSITION` (forbidden lifecycle jumps, unauthenticated access)
   - Automated vs. Manual classification rationale with exploratory recommendations.
3. **Reconnaissance & Live Verification (`mate-pw-recon`):** Walk through cases in `@playwright/cli`, map semantic locators, inspect network API calls.
4. **OOP / SOLID Automation (`mate-pw-codegen` + `mate-assert-playwright`):**
   - Page Objects extending `BasePage` (`src/pages/*.page.ts`).
   - Component Objects extending `BaseComponent` (`src/components/*.component.ts`).
   - Dependency Inversion fixtures (`src/fixtures/mate.fixtures.ts`).
   - API contract clients extending `BaseApiClient` (`src/api/*.client.ts`).
5. **Anti-Greenwashing Enforcement (`mate-triage`):** Every verified bug is automated with its true expected assertion and annotated with `test.fail(true, 'BUG-XXX: ...')`.

---

## 4. Test Pyramid & Layer Allocation Strategy

| Layer | Directory | Target Share | Purpose & Scope |
| :--- | :--- | :---: | :--- |
| **API & Contract Suite** | `tests/api/` | ~50% | Direct REST testing against `https://api.practicesoftwaretesting.com` for fast status matrices (`200`, `400`, `401`, `422`), BOLA, and schema validation. |
| **UI End-to-End (E2E)** | `tests/e2e/` | ~30% | P0 Smoke flows (`@smoke`) and critical cross-page user workflows. |
| **Adversarial & Chaos (Pillar T)** | `tests/threats/` | ~10% | Account locking brute-force defense (3-attempt lock `INV-03`), cart race conditions, coupon fuzzing, Stryker mutation (`>=85%`). |
| **Performance Oracles (NFR)** | `tests/nfr/` | ~5% | Grafana k6 scripts verifying catalog query response SLAs (`p95 <= 800ms`) and checkout load. |
| **Human Exploratory (Pillar E)** | `tests/charters/` | ~5% | Structured 30-min SBTM charters for UX ergonomics, multi-language localization, and accessibility (WCAG 2.1 AA). |

---

## 5. Team Roles & Skill Synergy Matrix

| Team Role | M.A.T.E. Skill | Responsibilities in Toolshop v5.0 Framework |
| :--- | :--- | :--- |
| **Architecture & Governance Lead** | **`mate-core`** | Owns `MATE-PROJECT-MAP.md`, quality gates, context budgeting, and SOLID/DIP enforcement. |
| **Strategic QA Director** | **`mate-strategy`** | Owns `TEST-STRATEGY.md`, Sprint Test Plans, P0/P1/P2 Risk Matrix, and 2-Wave Rollout tracking. |
| **Live Browser & DOM/Network Scout** | **`mate-pw-recon`** | Probes live website, inspects ARIA snapshots, extracts semantic locators, and monitors network APIs. |
| **User Story & QA Companion Architect** | **`mate-story-testcases`** | Ingests the 24 Sprint 5 User Stories, designs 4-Quadrant Test Case Matrices (`.md` & `.csv`), and runs Decision Engine. |
| **Pillar M (Model & Invariants)** | **`mate-model`** | Authors `specs/*.mate-spec.md` with explicit Forbidden Transitions and mathematical invariants. |
| **Pillar A (SOLID UI Automation)** | **`mate-assert-playwright` & `mate-pw-codegen`** | Generates `BasePage`, `BaseComponent`, Playwright fixtures, Wave 1 Smoke suite, and enforces `test.fail()`. |
| **Pillar A (API Contracts)** | **`mate-assert-api`** | Builds typed `BaseApiClient` classes and automates backend API matrices in `tests/api/`. |
| **Pillar T (Chaos & Concurrency)** | **`mate-threat`** | Automates concurrency, double-submit, account locking, and executes Stryker mutation in Podman. |
| **Non-Functional Performance Lead** | **`mate-performance-k6`** | Translates performance oracles into k6 load profiles run in Podman (`npx mate-sdt k6`). |
| **Pillar E (Exploratory & Release)** | **`mate-explore`** | Runs human SBTM charters, audits WCAG 2.1 AA, and issues formal Release Verdicts / Waivers. |
| **Day-2 Quality & Flakiness Guardians** | **`mate-triage` & `mate-maintenance`** | Triages failures, files spec-linked bug reports, and audits test health via `npx mate-sdt audit`. |

---

## 6. Release Quality Gates & Verdict Criteria

* 🟢 **`[PASS]`**: 100% of `@smoke` and `@p0` invariants pass, zero unflagged regressions, `npx mate-sdt audit` Grade `A`, Stryker mutation score `>= 85%`.
* 🟡 **`[CONCERNS]`**: Known P2 defects exist; requires signed Release Waiver in `specs/waivers/WVR-*.md`.
* 🔴 **`[FAIL]`**: Broken P0 invariant, failed account security or payment validation, or missing Wave 1 smoke stability.

---

## 7. Execution Status & Active Test Plans

* **Active Test Plan:** [TP-20261112-P0-P1](./test-plans/TP-20261112-P0-P1.md) (P0 + P1 Wave 2 coverage)
* **Wave 1:** Complete (21/21 smoke passing).
* **Wave 2 P0:** MOD-01, 02, 03, 05-08 automated (MOD-05..08 share a single `specs/checkout-lifecycle.mate-spec.md`); MOD-04 next.
* **Wave 2 P1:** MOD-09 to MOD-15 pending, order by Risk Score (MOD-14 first).
* **Pillar T / NFR:** Pending (`tests/threats/`, `tests/nfr/`).
* **CI/CD:** `.github/workflows/mate-qa.yml` pending (`[TBD]` CI platform).
