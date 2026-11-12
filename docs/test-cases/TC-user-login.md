# 📋 M.A.T.E. QA Companion & Test Case Matrix: user-login (MOD-02)

* **Source User Story:** [Sprint 5 - User Login](https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5)
* **Linked M.A.T.E. Specification:** [user-login.mate-spec.md](file:///C:/Users/cresp/Documents/Projectos/mate-test-sdt/specs/user-login.mate-spec.md)
* **Date:** `2026-11-12`
* **Coverage Summary:** 10 Total Cases (2 Happy Path | 2 Border Cases | 4 Negative Paths | 2 State Transitions)
* **Execution Split:** 5 Automate UI | 3 Automate API | 1 Manual Execution | 1 Exploratory Charter
* **Execution Status:** All automated cases passing

---

## 1. Acceptance Criteria Traceability

| AC ID | User Story Acceptance Criterion | Linked Spec Invariant | Covered By Test Cases | Recommended Execution Mix |
| :--- | :--- | :--- | :--- | :--- |
| **AC1** | Login form displays email, password, and "Sign in with Google" button | `INV-01` | `TC-LOG-01` | `AUTOMATE_UI` |
| **AC2** | Successful login redirects role-based: `/account` for users, `/admin/dashboard` for admins | `INV-01` | `TC-LOG-01`, `TC-LOG-02` | `AUTOMATE_UI` |
| **AC3** | Invalid credentials displays "Invalid email or password" | `INV-02` | `TC-LOG-03` | `AUTOMATE_UI` + `AUTOMATE_API` |
| **AC4** | Account locking after 3 consecutive failed attempts (HTTP 423 Locked) | `INV-03` | `TC-LOG-04` (API), `TC-LOG-05` (UI) | `AUTOMATE_API` + `AUTOMATE_UI` |
| **AC5** | Admin accounts are exempt from account locking | `INV-04` | `TC-LOG-06` | `AUTOMATE_API` |
| **AC6** | Disabled account rejected with "Account disabled." | `INV-02` | `TC-LOG-07` | `AUTOMATE_API` |
| **AC7** | TOTP prompt displayed for 2FA-enabled accounts | `INV-05` | `TC-LOG-08` | `AUTOMATE_UI` |
| **AC8** | Valid TOTP code grants authentication | `INV-05` | `TC-LOG-08` | `AUTOMATE_UI` |
| **AC9** | Invalid TOTP code displays "Invalid TOTP" | `INV-05` | `TC-LOG-09` | `AUTOMATE_UI` |
| **AC10** | Google social login popup (500x400px) | `INV-01` | `TC-LOG-10` | `MANUAL_TEST` + `EXPLORATORY` |

---

## 2. Complete 4-Quadrant Test Case Matrix

| TC ID | Category | Priority | Execution Mode | Engineering Rationale | Title | Test Steps | Expected Result (Oracle) | Live CLI Check | Final Status |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-LOG-01** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Core user session access; executed on every build. | Customer Login Success | 1. Enter valid customer credentials<br>2. Submit form | Authenticated, redirected to `/account`, nav menu shows username [`INV-01`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-02** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Verifies administrative role authorization routing. | Admin Login Success & Dashboard Route | 1. Enter `admin@practicesoftwaretesting.com` / `welcome01`<br>2. Submit | Authenticated, redirected to `/admin/dashboard` [`INV-01`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-03** | `NEGATIVE_PATH` | `@p0` | `AUTOMATE_UI` | Verifies generic secure error messaging against user enumeration. | Invalid Password Error Message | 1. Enter valid email with incorrect password<br>2. Submit | `Invalid email or password` displayed [`INV-02`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-04** | `STATE_TRANSITION` | `@p0` | `AUTOMATE_API` | Critical security invariant; verified fast and deterministically at API layer. | Account Lockout After 3 Failed Attempts (HTTP 423) | 1. Send 3 failed login attempts via `POST /users/login`<br>2. Send 4th attempt | 4th attempt returns `HTTP 423 Locked` with message `Account locked...` [`INV-03`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-05** | `STATE_TRANSITION` | `@p0` | `AUTOMATE_UI` | End-to-end visual confirmation of lockout banner in the browser. | Account Lockout UI Error Notification | 1. Trigger 3 consecutive failed attempts on customer account<br>2. Attempt 4th login | UI banner displays `Account locked, too many failed attempts...` [`INV-03`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-06** | `BORDER_CASE` | `@p1` | `AUTOMATE_API` | Verifies admin immunity from lockout attack vectors. | Admin Account Exemption from Lockout | 1. Send 5 failed attempts on `admin@practicesoftwaretesting.com`<br>2. Send valid admin password | Login succeeds with `HTTP 200` [`INV-04`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-07** | `NEGATIVE_PATH` | `@p1` | `AUTOMATE_API` | Verifies disabled status enforcement on backend. | Disabled Account Access Rejection | 1. Attempt login with disabled account credentials | Returns `HTTP 401` with `Account disabled.` [`INV-02`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-08** | `HAPPY_PATH` | `@p1` | `AUTOMATE_UI` | Verifies two-factor authentication challenge step. | TOTP Two-Factor Authentication Prompt & Validation | 1. Log in with 2FA account<br>2. Submit 6-digit TOTP | 6-digit challenge prompt shown, valid TOTP redirects to `/account` [`INV-05`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-09** | `NEGATIVE_PATH` | `@p1` | `AUTOMATE_UI` | Verifies rejection of incorrect TOTP tokens. | Invalid TOTP Token Rejection | 1. Submit incorrect 6-digit TOTP code | Error displays `Invalid TOTP` [`INV-05`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-LOG-10** | `HAPPY_PATH` | `@p2` | `MANUAL_TEST` | External OAuth Google popup interaction and third-party credential sandbox. | Google Social Login Popup & OAuth Consent | 1. Click "Sign in with Google"<br>2. Authenticate in Google OAuth window | Popup opens at 500x400px; upon completion user session is established | ➖ Manual | 🧑‍💻 Manual Checklist |

---

## 3. 🧑‍💻 Manual Test Execution Guide

### Manual Case `TC-LOG-10`: [Google Social Login Popup & OAuth Consent]
* **Why Not Automate?** Automating Google OAuth prompts frequently violates Google Bot detection policies (reCAPTCHA) and produces flaky tests due to third-party rate limits.
* **Preconditions:** Registered Google test account.
* **Step-by-Step Instructions:**
  1. Navigate to `/auth/login`.
  2. Click **"Sign in with Google"**.
  3. Verify a popup window opens with approximate dimensions `500x400px`.
  4. Complete Google authentication.
  5. Verify popup closes and parent window transitions to `/account`.

---

## 4. 🧭 Tailored Exploratory Testing Recommendations

### Exploratory Mission `EXP-LOG-01` (30 min): [Brute-Force & Session Persistence]
* **Heuristics to Probe:**
  1. **Lockout Reset Interval:** Does the lockout timer expire after a cooldown period, or does it require administrative intervention?
  2. **Multi-Tab Lockout Propagation:** If an account is locked in Tab 1, does Tab 2 immediately get blocked on its next API call?
  3. **Case Sensitivity:** Test email case permutations (`Customer@PracticeSoftwareTesting.com` vs `customer@practicesoftwaretesting.com`).
