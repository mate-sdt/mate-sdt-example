# 📋 M.A.T.E. QA Companion & Test Case Matrix: user-registration (MOD-01)

* **Source User Story:** [Sprint 5 - User Registration](https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5)
* **Linked M.A.T.E. Specification:** [user-registration.mate-spec.md](file:///C:/Users/cresp/Documents/Projectos/mate-test-sdt/specs/user-registration.mate-spec.md)
* **Date:** `2026-11-12`
* **Coverage Summary:** 8 Total Cases (2 Happy Path | 3 Border Cases | 2 Negative Paths | 1 State Transition)
* **Execution Split:** 4 Automate UI | 2 Automate API | 1 Manual Execution | 1 Exploratory Charter
* **Execution Status:** All automated cases passing

---

## 1. Acceptance Criteria Traceability

| AC ID | User Story Acceptance Criterion | Linked Spec Invariant | Covered By Test Cases | Recommended Execution Mix |
| :--- | :--- | :--- | :--- | :--- |
| **AC1** | Required fields displayed: First/Last name, DOB (YYYY-MM-DD), Street, Postal code, City, State, Country, Phone, Email, Password | `INV-01` | `TC-REG-01`, `TC-REG-04` | `AUTOMATE_UI` |
| **AC2** | Password requirements displayed on focus: >=8 chars, uppercase + lowercase, number, special character | `INV-02` | `TC-REG-02` | `AUTOMATE_UI` |
| **AC3** | Real-time password validation updating criteria dynamically | `INV-02` | `TC-REG-02`, `TC-REG-03` | `AUTOMATE_UI` |
| **AC4** | Password strength indicator (Weak 20%, Moderate 40%, Strong 60%, Very Strong 80%, Excellent 100%) | `INV-03` | `TC-REG-03` | `AUTOMATE_UI` |
| **AC5** | Duplicate email rejected with "Email is already in use." | `INV-04` | `TC-REG-05` (API), `TC-REG-06` (UI) | `AUTOMATE_API` + `AUTOMATE_UI` |
| **AC6** | Successful registration creates account, sends confirmation email, redirects to login | `INV-01` | `TC-REG-01`, `TC-REG-07` (Manual) | `AUTOMATE_UI` + `MANUAL_TEST` |

---

## 2. Complete 4-Quadrant Test Case Matrix

| TC ID | Category | Priority | Execution Mode | Engineering Rationale | Title | Test Steps | Expected Result (Oracle) | Live CLI Check | Final Status |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-REG-01** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Core user acquisition journey; must be verified on every build in the browser. | Valid Customer Registration Flow | 1. Navigate to `/auth/register`<br>2. Fill all mandatory fields with unique email<br>3. Submit form | Account created, redirected to `/auth/login` [`INV-01`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-REG-02** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Verifies dynamic helper reactivity when focusing password input. | Password Requirements Focus & Real-time Rule Toggling | 1. Focus password input<br>2. Type lowercase, uppercase, number, symbol | Requirement items dynamically toggle completed state [`INV-02`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-REG-03** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Ensures mathematical precision of strength evaluation (20% to 100%). | Password Strength Levels (Weak to Excellent) | 1. Type password meeting 1, 2, 3, 4, and 5 rules | Strength progresses: Weak (20%) -> Moderate (40%) -> Strong (60%) -> Very Strong (80%) -> Excellent (100%) [`INV-03`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-REG-04** | `NEGATIVE_PATH` | `@p0` | `AUTOMATE_UI` | Fast client-side feedback preventing invalid DB ingestion. | Missing Mandatory Fields Validation | 1. Leave required fields empty<br>2. Click Register button | Form submission blocked, validation messages shown [`INV-01`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-REG-05** | `NEGATIVE_PATH` | `@p0` | `AUTOMATE_API` | 20x faster duplicate check at API layer with exact HTTP 422 contract validation. | Duplicate Email Registration via API | 1. `POST /users/register` with already existing email | API returns `HTTP 422 Unprocessable` with `Email is already in use.` [`INV-04`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-REG-06** | `NEGATIVE_PATH` | `@p0` | `AUTOMATE_UI` | End-to-end visual confirmation of backend error toast in the UI. | Duplicate Email Registration UI Warning | 1. Fill registration with `customer@practicesoftwaretesting.com`<br>2. Submit | Error banner displays `Email is already in use.` [`INV-04`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-REG-07** | `HAPPY_PATH` | `@p2` | `MANUAL_TEST` | Email server inbox deliverability and template layout validation. | Confirmation Email Delivery & Visual Layout | 1. Complete registration<br>2. Check external email client | Confirmation email arrives with brand logo and valid activation link | ➖ Manual | 🧑‍💻 Manual Checklist |
| **TC-REG-08** | `STATE_TRANSITION` | `@p1` | `AUTOMATE_UI` | Prevents illegal state jumps before form completion. | Direct Submission Without Entering Required Data | 1. Navigate to `/auth/register`<br>2. Press Enter immediately | Submission blocked; browser/UI highlights missing fields [`Forbidden Transition`] | ✅ PASS | ✅ Automated (`PASS`) |

---

## 3. 🧑‍💻 Manual Test Execution Guide

### Manual Case `TC-REG-07`: [Confirmation Email Delivery & Visual Rendering]
* **Why Not Automate?** Verifying third-party SMTP deliverability, spam filter score, and cross-client email CSS rendering (Outlook, Apple Mail, Gmail dark mode) has low automation ROI.
* **Preconditions:** Registered email address hooked to Mailosaur or QA inbox.
* **Step-by-Step Instructions:**
  1. Register a new user using a designated test domain mailbox.
  2. Inspect inbox within 60 seconds.
  3. Verify email subject line, brand typography, and that the verification button points to the correct domain.

---

## 4. 🧭 Tailored Exploratory Testing Recommendations

### Exploratory Mission `EXP-REG-01` (30 min): [International Postcodes & Phone Formats]
* **Heuristics to Probe:**
  1. **Alphanumeric Postcodes:** Enter UK style postcodes (`SW1A 1AA`) or Canadian postcodes (`K1A 0B1`) vs pure digits (`90210`).
  2. **Phone Number Special Characters:** Test input formatting with `+`, `()`, `-`, and spaces (`+1 (555) 234-5678`).
  3. **DOB Leap Year & Future Dates:** Attempt registration with February 29 on non-leap years and future dates.
