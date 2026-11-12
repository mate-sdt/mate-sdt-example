# 📋 M.A.T.E. QA Companion & Test Case Matrix: product-overview (MOD-03)

* **Source User Story:** [Sprint 5 - Product Overview + Price Range](https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5)
* **Linked M.A.T.E. Specification:** [product-overview.mate-spec.md](file:///C:/Users/cresp/Documents/Projectos/mate-test-sdt/specs/product-overview.mate-spec.md)
* **Date:** `2026-11-12`
* **Coverage Summary:** 20 Total Cases (7 Happy Path | 6 Border Cases | 5 Negative/Boundary Paths | 2 State Transitions)
* **Execution Split:** 18 Automate UI | 0 Automate API | 1 Manual Execution | 1 Exploratory Charter
* **Execution Status:** 18/18 automated cases passing (TC-OVR-20 added 2026-11-12 to pin DEC-OVR-01) (`tests/e2e/product-overview.spec.ts`, locale pinned to `en-US`)
* **Live CLI Verification:** 2026-11-12 via `playwright-cli` + scripted Playwright probes against `https://practicesoftwaretesting.com/`

---

## 1. Acceptance Criteria Traceability

| AC ID | User Story Acceptance Criterion | Linked Spec Invariant | Covered By Test Cases | Recommended Execution Mix |
| :--- | :--- | :--- | :--- | :--- |
| **AC1** | Product grid displayed; each card shows image, name, price | `INV-01` | `TC-OVR-01` | `AUTOMATE_UI` |
| **AC2** | Clicking a card navigates to product detail | - | `TC-OVR-02` | `AUTOMATE_UI` |
| **AC3** | Pagination controls displayed; clicking a page number updates the grid | - | `TC-OVR-03` | `AUTOMATE_UI` |
| **AC4** | Valid search (3-40 chars) shows only matching products and resets all filters | `INV-02`, `INV-03` | `TC-OVR-04`..`TC-OVR-09`, `TC-OVR-20` | `AUTOMATE_UI` |
| **AC5** | Category checkboxes restrict the grid to those categories | - | `TC-OVR-10` | `AUTOMATE_UI` |
| **AC6** | Parent category checks all children; unchecking all children unchecks parent | `INV-04` | `TC-OVR-11` | `AUTOMATE_UI` |
| **AC7** | Brand checkboxes restrict the grid to those brands | - | `TC-OVR-12` | `AUTOMATE_UI` |
| **AC8** | Categories + brands combine (intersection) | `INV-05` | `TC-OVR-13` | `AUTOMATE_UI` |
| **AC9** | Sort options reorder the grid (Name A-Z/Z-A, Price High-Low/Low-High) | `INV-07` | `TC-OVR-14`, `TC-OVR-15` | `AUTOMATE_UI` |
| **AC10** | Price slider shown with default $1-$100 and maximum $200 | - | `TC-OVR-16` | `AUTOMATE_UI` |
| **AC11** | Moving slider handles restricts products to the range | `INV-06` | `TC-OVR-17` | `AUTOMATE_UI` |
| **AC12** | Discounted products show struck-through original price and discounted price | - | `TC-OVR-18` | `EXPLORATORY_CHARTER` |
| **AC13** | Out-of-stock products show "Out of stock" on the card | - | `TC-OVR-19` | `MANUAL_TEST` |

---

## 2. Complete 4-Quadrant Test Case Matrix

| TC ID | Category | Priority | Execution Mode | Engineering Rationale | Title | Steps | Expected Result | Live CLI Check | Automation Status |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-OVR-01** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Core discovery surface hit on every visit; DOM regression risk. | Grid shows image, name, price | 1. Open `/` | 9 cards, each with image, name and `$` price [`INV-01`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-02** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Entry to the purchase funnel. | Card opens detail page | 1. Click first card | URL `/product/<id>`, detail name equals card name | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-03** | `HAPPY_PATH` | `@p1` | `AUTOMATE_UI` | Pagination state is front-end rendered. | Pagination updates grid | 1. Click page 2 | Grid content differs from page 1 | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-04** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Primary search journey. | Valid 3-char search | 1. Enter `ham`; 2. Submit | Caption `Searched for: ham`, ≥1 result | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-05** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Upper boundary of the 3-40 rule. | 40-character query accepted | 1. Enter 40 × `x`; 2. Submit | Request issued, caption echoes the query | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-06** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Lower boundary min-1 (2 chars). | 2-char query does not search | 1. Enter `ha`; 2. Submit | No caption, grid unchanged (9 cards) [`INV-02`] | ✅ PASS (no request, no message) | ✅ Automated (`PASS`) |
| **TC-OVR-07** | `NEGATIVE_PATH` | `@p0` | `AUTOMATE_UI` | Empty-state UX. | No-match search | 1. Search `zzzzqqq` | `There are no products found.`, 0 cards | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-08** | `NEGATIVE_PATH` | `@p1` | `AUTOMATE_UI` | Injection payloads are inert in the UI. | XSS / SQLi search text | 1. Search `<script>alert(1)</script>` and `' OR 1=1 --` | Echoed as plain text, empty state, no dialog, no 5xx | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-09** | `STATE_TRANSITION` | `@p1` | `AUTOMATE_UI` | Forbidden transition: stale filters surviving a search. | Search resets filters | 1. Check `Hammer`; 2. Search `pliers` | `Hammer` unchecked; results match query [`INV-03`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-10** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Main narrowing mechanism. | Category filter | 1. Check `Hammer` | Only hammer products listed | ✅ PASS (7 products) | ✅ Automated (`PASS`) |
| **TC-OVR-11** | `STATE_TRANSITION` | `@p1` | `AUTOMATE_UI` | Tri-state hierarchy logic. | Parent/child category sync | 1. Check `Hand Tools`; 2. Uncheck all 7 children | All 7 children checked after step 1; parent unchecked after step 2 [`INV-04`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-12** | `HAPPY_PATH` | `@p1` | `AUTOMATE_UI` | Brand filter wiring. | Brand filter | 1. Check `ForgeFlex Tools` | Grid differs from unfiltered, ≥1 result | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-13** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Filter combination logic. | Category ∩ brand | 1. Check `Hammer`; 2. Check `ForgeFlex Tools` | Result set ⊆ hammer-only set, non-empty [`INV-05`] | ✅ PASS (6 of 7) | ✅ Automated (`PASS`) |
| **TC-OVR-14** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Sort correctness. | Sort by name | 1. Select Name A-Z, then Z-A | Names alphabetical ascending then descending [`INV-07`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-15** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Sort correctness. | Sort by price | 1. Select Price Low-High, then High-Low | Prices ascending then descending [`INV-07`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-16** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Documented default values. | Slider defaults | 1. Open `/` | Handles at 1 and 100, ceiling 200 | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-17** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Price range behaviour. | Lower max price handle | 1. Move max handle to $10 | All prices within $1-$10 [`INV-06`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-OVR-20** | `BORDER_CASE` | `@p2` | `AUTOMATE_UI` | Pins the provisional product decision `DEC-OVR-01` so any future trimming change is detected as a deliberate Spec Update. | Whitespace-only search accepted (`DEC-OVR-01`) | 1. Enter 3 spaces; 2. Submit | Request issued, caption echoes the raw text, empty state `There are no products found.` (**accepted behavior, not a defect**) [`INV-02`] | ✅ PASS (observed 2026-11-12) | ✅ Automated (`PASS`) |
| **TC-OVR-18** | `HAPPY_PATH` | `@p2` | `EXPLORATORY_CHARTER` | Discounts are location/data based; none seen on page 1. | Discount price display | 1. Find a discounted product; 2. Inspect card | Struck-through original price + discounted price | ⚠️ NOT OBSERVED `[TBD]` | 🧭 Charter `CHR-OVR-03` |
| **TC-OVR-19** | `HAPPY_PATH` | `@p2` | `MANUAL_TEST` | Stock is volatile shared test data; automation would be flaky without a data fixture. | Out-of-stock indicator | 1. Browse pages until an out-of-stock product appears | `Out of stock` shown on card | ✅ PASS (observed once on page 1) | 🧑‍💻 Manual Checklist |

---

## 3. 🧑‍💻 Manual Test Execution Guide

### Manual Case `TC-OVR-19`: [Out-of-Stock Indicator]
* **Why Not Automate?** Stock levels are shared, mutable seed data; the product that is out of stock changes between runs. A deterministic version needs an API mock or seeded fixture (future work).
* **Preconditions:** Anonymous visitor, English locale.
* **Step-by-Step Instructions:**
  1. Open `https://practicesoftwaretesting.com/`.
  2. Page through the grid (and sort by name) looking for a card with an `Out of stock` label.
  3. Verify the label is shown on the card and the card is still clickable.
  4. Open the product and confirm `Add to Cart` is disabled (MOD-04 AC9).

---

## 4. 🧭 Tailored Exploratory Testing Recommendations

### Exploratory Mission `EXP-OVR-01` (45 min): [Filter Combinatorics]
* **Heuristics to Probe:**
  1. Does the page number reset to 1 when a filter changes while on page 3?
  2. Rapidly toggle filters; is the final grid consistent with the final checkbox state (no stale response overwrite)?
  3. Combine eco-friendly + brand + category + price range + sort.

### Exploratory Mission `EXP-OVR-02` (30 min): [Price Slider & Search Edge Cases]
* **Heuristics to Probe:**
  1. Cross the handles (min > max), drag to the $200 ceiling, use keyboard and touch.
  2. Whitespace-only query (`"   "`) issues a search and shows the empty state - **accepted for now (`DEC-OVR-01`, provisional)**; probe mixed whitespace/tab/newline and leading/trailing spaces around a valid term (e.g. `" ham "`) for consistency.
  3. Unicode / emoji / RTL text and 41+ character queries.

### Exploratory Mission `EXP-OVR-03` (30 min): [Discounts & Stock]
* **Heuristics to Probe:** Find discounted products (AC12) across pages and geo-locations; verify strikethrough and layout; verify out-of-stock cards in all sort/filter states.

---

## 5. 🐞 Discovered Bugs & Anti-Greenwashing Log

| Bug ID | Test Case | Description | Status |
| :--- | :--- | :--- | :--- |
| - | - | No product defects found in AC1-AC11 during live verification. | ✅ Clean |
| `DEC-OVR-01` | `TC-OVR-20` | Whitespace-only (3 spaces) search is executed and returns the empty state; AC4 is silent on trimming. **Engineer decision 2026-11-12: acceptable for now** (provisional, not a defect). | ✅ Accepted (revisit if Product defines trimming) |

**Environment note (not a defect, decision 2026-11-12):** with a non-English browser locale the app renders localized copy (e.g. `No se encontraron productos.`). The Playwright config now pins `locale: 'en-US'`. Mixed-language copy observed (English search caption `Searched for: …` inside a Spanish page) was classified by the engineer as environment noise.
