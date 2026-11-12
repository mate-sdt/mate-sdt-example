# 🐛 M.A.T.E. Structured Bug Report
<!-- Generated via: npx mate-sdt bug user-registration -->

## 📋 Defect Metadata
- **Bug ID:** `BUG-20261112-USER-REGISTRATION-01`
- **Title:** `[MOD-01] Duplicate registration error message copy mismatch against Acceptance Criteria AC-06`
- **Date Reported:** `2026-11-12`
- **Violated Specification:** `./specs/user-registration.mate-spec.md`
- **Violated Clause / Oracle:** `AC-06 / Invariant INV-04 / Forbidden Transition: SUBMITTING -> REGISTERED`
- **Severity:** `Medium (P2)`
- **Reproduction Rate:** `Deterministic (3/3)`

---

## 🌍 Environment & Context
- **Environment:** `Live Production Staging (https://practicesoftwaretesting.com)`
- **Target Application:** `Practice Software Testing (Toolshop v5.0)`
- **Browser / Device / Runtime:** `Chromium Headless / Node 24 / Playwright`
- **Automated Guard:** `tests/e2e/auth-registration.spec.ts` -> `TC-REG-06` annotated with `test.fail()`

---

## 📝 Description & Business Impact
Under Sprint 5 User Story **MOD-01 (User Registration)**, Acceptance Criteria **AC-06** explicitly requires that when a visitor attempts to register with an email that is already present in the database, the UI must alert the user with the exact copy:
> *"Email is already in use."*

However, the live application and API currently return:
> *"A customer with this email address already exists."*

While functionally rejecting the duplicate registration, this divergence violates the strict copy contract defined in the user story and product specification. In accordance with the **M.A.T.E. Anti-Greenwashing Mandate**, this test has NOT been altered or loosened to fit the broken behavior. Instead, it has been annotated with `test.fail(true, 'BUG-20261112-USER-REGISTRATION-01')`.

---

## 🔄 Steps to Reproduce
1. **Precondition:** Existing customer account registered with `customer@practicesoftwaretesting.com`.
2. **Action:** Navigate to `https://practicesoftwaretesting.com/auth/register`.
3. **Action:** Complete all mandatory fields using email `customer@practicesoftwaretesting.com`.
4. **Action:** Click Register button (`[data-test="register-submit"]`).
5. **Observed Fault:** Red alert banner displays:
   `"A customer with this email address already exists."`
   instead of specified:
   `"Email is already in use."`

---

## ⚖️ Expected vs. Actual Behavior

- **Expected (Per `specs/user-registration.mate-spec.md` & Sprint 5 AC-06):**  
  The system displays an alert with the exact text:  
  `"Email is already in use."`
- **Actual (Observed):**  
  The system displays:  
  `"A customer with this email address already exists."`

---

## 🔬 Forensic Evidence
- **DOM Locator:** `div.alert.alert-danger` / `[data-test="register-error"]`
- **Backend API Response:** `POST https://api.practicesoftwaretesting.com/users/register` -> `HTTP 422 Unprocessable Entity`:
  ```json
  {
    "email": ["A customer with this email address already exists."]
  }
  ```
- **Regression Test Coverage:**  
  [tests/e2e/auth-registration.spec.ts](file:///C:/Users/cresp/Documents/Projectos/mate-test-sdt/tests/e2e/auth-registration.spec.ts#L73) (`TC-REG-06: Duplicate Email Registration Rejection`)
