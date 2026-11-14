<!-- MATE-SDT-START -->
# AGENTS.md — M.A.T.E. Harness & Context Engineering Map (<= 100 Lines)

> *Humans steer. Agents execute.* (`Agent = Model + Harness + Knowledge`)

## 1. Progressive Disclosure Routing (Where to Look Next)
| Need | Target |
| :--- | :--- |
| **Ambiguous Prompt / Raw URL / "Where do I start?"** | Activate `mate-party` (Council of QA Experts) |
| **Live URL Recon & Discovery** | Activate `mate-pw-recon` (`open`, `snapshot`, `network`) |
| **User Stories & Acceptance Criteria** | Generate 4-Quadrant Matrix: `npx mate-sdt cases <module>` |
| **Pasted Stack Trace / Failure / "Fix this"** | Activate `mate-triage` + `npx mate-sdt heal` (`/mate-flow-triage`) |
| **Framework Coaching & Diagnosis** | Activate `mate-help` (`/mate-help`) |
| **Task Execution & Map Governance** | Activate `mate-core` & read `MATE-PROJECT-MAP.md` (`< 3,000` tokens) |
| **Quality Scorecard & Tech Debt** | `docs/QUALITY_SCORE.md` & `.mate/exec-plans/tech-debt-tracker.md` |
| **Active Execution Plans** | `.mate/exec-plans/active/` (completed -> `.mate/exec-plans/completed/`) |

## 2. Zero-Assumption Escalation & Sub-Agent Delegation Protocols
- **Zero-Assumption & Open-Question Escalation ("Ask, Never Guess"):** Inspect local/live context first. Never invent business thresholds, auth boundaries, or requirements. Tag unknowns `[TBD: <exact question>]` under `## Open Questions for Human QA`, finish unblocked work, and halt on `STATUS: BLOCKED_ON_USER_INPUT` (`GATE-01`/`GATE-02`) to ask the human.
- **Missing Tooling Pre-Flight Check (`@playwright/cli` / `k6`):** If `@playwright/cli` is missing for live recon (`mate-pw-recon`) or neither Podman nor `k6` is available for performance (`mate-performance-k6`), STOP and ask the human: *"We don't have [tool] available. How would you like to proceed?"* with options to install (Recommended), use MCP/native fallback, or inspect code/skip.
- **Sub-Agent Delegation & 3-Phase Pipeline Isolation:** Build scoped sub-agent prompts via `npx mate-sdt context <module> --subagent <skill>`. Isolate Reader/Extractor -> Spec Scorer -> Code Writer -> Independent Reviewer (`mate-review`/`mate-audit`) via `mate.handoff/v1` (or `--compact` fallback in single-agent IDEs).

## 3. Forward-Only 6-Layer Architecture & Strict POM
1. `src/models/` (strict TS schemas, zero `any`) -> 2. `src/api/` & `src/components/` -> 3. `src/pages/` (`<= 300` lines) -> 4. `src/fixtures/` (`test.extend`) -> 5. `tests/{e2e,api,threats,nfr}/**/*.spec.ts`.
- **Test-Design-First Mandate (`MATE-INVARIANT-08`):** Never write `.spec.ts` automation code (even smoke tests) without FIRST generating `docs/test-cases/TC-[module].md` and `.csv` (`mate-story-testcases` / `npx mate-sdt cases <module>`). Every automated test must trace back to explicit cases (`[AUTOMATE_UI]`, `[AUTOMATE_API]`, `[MANUAL_TEST]`, `[EXPLORATORY_CHARTER]`). Specs without test cases fail `GATE-02`.
- **FORBIDDEN IN SPECS (MATE-ANTI-08 & MATE-ANTI-03 CRITICAL):** Zero `page.locator()`, `page.getBy*()`, `page.goto()`, or direct `page.fill/click/selectOption()` inside specs. All UI interactions must be encapsulated in Page Objects (`src/pages/*.page.ts`) or Component Objects (`src/components/*.component.ts`). If a page lacks a Page Object, create it first under `src/pages/*.page.ts`! Zero `new SomePage(page)`, zero `waitForTimeout()`, and zero `.only()`.
- **Anti-Greenwashing (`MATE-ANTI-06`):** Never delete/weaken failing assertions or use permissive regexes (`/A|B/`). Keep failing tests with `test.fail(true, "BUG-XXX")` and file `docs/bugs/BUG-*.md` (`npx mate-sdt bug <mod>`). To eliminate cosmetic test suites, enforce strict deterministic invariants (`specs/*.mate-spec.md`) and validate adversarial vectors in `tests/threats/` (race conditions, idempotency, fuzzing).

## 4. Active `.mate/` Directory Protocol & Memory Provenance
- **Execution Plans:** Before starting any multi-step task, create your plan in `.mate/exec-plans/active/<name>.md` with actionable `- [ ]` tasks. Move completed plans to `.mate/exec-plans/completed/`. Check `.mate/exec-plans/tech-debt-tracker.md` for pending cleanups.
- **Context Hygiene & Scratchpads:** Never dump raw exploratory logs or HTML dumps into project root or `docs/`. Store transient findings in `.mate/scratchpad-<module>.md`. Run `npx mate-sdt context <module>` for phase-scoped JIT packs (`< 2,000` tokens).
- **Provenance Hierarchy:** `[BOOTSTRAPPED] > [USER_EXPLICIT] > [OBSERVED | ISO] > [INFERRED] / [TBD]`. Never put `[INFERRED]`/`[TBD]` in `<invariants>` or Page Objects; halt on `STATUS: BLOCKED_ON_USER_INPUT` to ask the human.

## 5. Verification & Garbage Collection Commands
- `npx mate-sdt gate --loop` — Closed-loop 5-gate verification (max 5 iterations, auto-persisting state in `.mate/harness-state.json`).
- `npx mate-sdt gc` — Continuous doc-gardening, updating `.mate/exec-plans/tech-debt-tracker.md` & `docs/QUALITY_SCORE.md`.
- `npx mate-sdt context <module>` — 3-Bucket / 7-Layer JIT Context Pack (`--subagent <skill>`, `--compact`, `--consolidate`).
- `npx mate-sdt heal [target]` — Compress crash (`<error_digest> <= 400 tokens` in `.mate/scratchpad-heal-*.md`) & 5-Class Heal vs. Quarantine.
- `npx mate-sdt k6 <script>` — Container sandbox (Podman/Docker) or Host Grafana k6 performance & SLA suites.
<!-- MATE-SDT-END -->
