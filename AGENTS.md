<!-- MATE-SDT-START -->
# AGENTS.md — M.A.T.E. Spec-Driven Testing (SDT) & Agent Governance

> Governed by the **M.A.T.E. Method** (`mate-sdt` — Model-Agnostic Test Engineering).
> Built on **Context Engineering** (*Write, Select, Compress, Isolate*) and **Harness Engineering** ($\text{Agent} = \text{Model} + \text{Harness}$).

## 1. Environment & Test Execution Commands
- **P0 Smoke Suite:** `npm run test:smoke` (Golden Paths, < 3 min execution)
- **Full E2E Suite:** `npm run test:e2e` (Playwright UI regression)
- **API Contract Suite:** `npm run test:api` (Backend endpoints & schemas)
- **Threats & Concurrency:** `npm run test:threats` (Idempotency, races, fuzzing)
- **Performance (k6):** `npx mate-sdt k6 <script>` (SLA validation in rootless Podman)
- **Spec Validation:** `npx mate-sdt validate` (Lints `specs/*.mate-spec.md` with explicit Forbidden Transitions)
- **Codebase Health Audit:** `npx mate-sdt audit` (Health Grade A gate; zero sleeps, zero `.only`)
- **Closed Verification Gate:** `npx mate-sdt gate` (Execute before concluding any agent turn)

## 2. Context Engineering Protocol
- **Living Map First:** Always read and update `MATE-PROJECT-MAP.md` (< 3,000 tokens) before scanning code.
- **Tool-First Grounding:** NEVER guess or deduce DOM selectors, CSS classes, or component hierarchies in internal reasoning loops. Ground every locator using `@playwright/cli` live discovery (`playwright-cli open/snapshot`) or accessibility-first locators (`getByRole`, `getByLabel`, `getByTestId`).
- **Epistemic Isolation:** Isolate facts from assumptions using `[OBSERVED]`, `[INFERRED]`, and `[TBD]` tags. Never guess undocumented endpoints.
- **User Story Ingestion:** Generate 4-quadrant test case matrices in `docs/test-cases/TC-*.md` and `.csv` (`npx mate-sdt cases <module>`).

## 3. Anti-Greenwashing & Architecture Guardrails
- **Anti-Greenwashing Mandate & Zero Permissive Regexes (`MATE-ANTI-06`):** Never write ambiguous alternative regexes (e.g. `/A|B/` or `/already in use|already exists/`) to mask copy discrepancies, and never delete/alter assertions to force a green test suite! If an automatable test fails due to a real product defect, keep the test with its true assertion, annotate with `test.fail(true, "BUG-XXX: ...")`, generate a formal bug report (`npx mate-sdt bug <module>`), and notify the engineer.
- **Mandatory Discrepancy Escalation:** When live app behavior differs from User Stories (undocumented fields, differing copy, state reset on reload), STOP and ask the engineer before writing code: Is it a Defect (`test.fail()`) or an intentional Spec Update?
- **Zero Arbitrary Sleeps:** `page.waitForTimeout()` or `sleep()` are strictly forbidden. Use auto-retrying web assertions (`await expect(locator).toBeVisible()`).
- **SOLID Playwright Architecture:** Adhere to Page Object Model (`src/pages/*.page.ts`), Component Objects (`src/components/`), API clients (`src/api/`), and custom fixtures (`src/fixtures/`).
<!-- MATE-SDT-END -->
