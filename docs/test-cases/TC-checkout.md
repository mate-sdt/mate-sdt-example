# 📋 M.A.T.E. QA Companion & Test Case Matrix: checkout-lifecycle (MOD-05 to MOD-08)

* **Source User Stories:** [Sprint 5 - Checkout & Payment](https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5)
* **Linked M.A.T.E. Specification:** [checkout-lifecycle.mate-spec.md](file:///C:/Users/cresp/Documents/Projectos/mate-test-sdt/specs/checkout-lifecycle.mate-spec.md)
* **Date:** `2026-11-12`
* **Coverage Summary:** 10 Total Cases (3 Happy Path | 3 Border Cases | 2 Negative Paths | 2 State Transitions)
* **Execution Split:** 6 Automate UI | 2 Automate API | 1 Manual Execution | 1 Exploratory Charter
* **Execution Status:** Core flows automated

---

## 1. Acceptance Criteria Traceability

| AC ID | User Story Acceptance Criterion | Linked Spec Invariant | Covered By Test Cases | Recommended Execution Mix |
| :--- | :--- | :--- | :--- | :--- |
| **AC-MOD05-1** | Cart contents displayed: table with columns Item, Quantity, Price, Total, Actions | `INV-01` | `TC-CHK-01`, `TC-CHK-02` | `AUTOMATE_UI` |
| **AC-MOD05-2** | Quantity update recalculates total and displays confirmation message | `INV-01`, `INV-02` | `TC-CHK-02` | `AUTOMATE_UI` |
| **AC-MOD05-3** | Delete item removes item from cart and recalculates total | `INV-02` | `TC-CHK-03` | `AUTOMATE_UI` |
| **AC-MOD05-4** | Empty cart displays "Your shopping cart is empty" | `INV-01` | `TC-CHK-03` | `AUTOMATE_UI` |
| **AC-MOD06-5** | Logged-in customer shows "You are already signed in as [Name]" and proceeds | `INV-01` | `TC-CHK-01` | `AUTOMATE_UI` |
| **AC-MOD07-1** | Billing address displays required fields (Street, City, State, Country, Postal code) | `INV-03` | `TC-CHK-01`, `TC-CHK-04` | `AUTOMATE_UI` |
| **AC-MOD07-2** | Empty address field highlights invalid and disables Proceed button | `INV-03` | `TC-CHK-04` | `AUTOMATE_UI` |
| **AC-MOD08-1** | Payment method dropdown: Bank Transfer, Cash on Delivery, Credit Card, BNPL, Gift Card | `INV-04` | `TC-CHK-01`, `TC-CHK-06` | `AUTOMATE_UI` |
| **AC-MOD08-4** | Credit Card expired date displays "Expiration date must be in the future." | `INV-04` | `TC-CHK-05` | `AUTOMATE_UI` |
| **AC-MOD08-9** | Successful order validates payment, assigns invoice number, clears cart | `INV-04` | `TC-CHK-01` | `AUTOMATE_UI` |

---

## 2. Complete 4-Quadrant Test Case Matrix

| TC ID | Category | Priority | Execution Mode | Engineering Rationale | Title | Test Steps | Expected Result (Oracle) | Live CLI Check | Final Status |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-CHK-01** | `HAPPY_PATH` | `@p0` | `AUTOMATE_UI` | Primary revenue-generating user journey; validates full 4-step wizard through to order confirmation. | End-to-End Checkout with Cash on Delivery | 1. Add product to cart<br>2. Proceed through Cart Review<br>3. Verify user session<br>4. Fill address<br>5. Select Cash on Delivery & confirm | Order confirmation displayed, invoice generated, cart badge cleared [`INV-04`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-02** | `BORDER_CASE` | `@p0` | `AUTOMATE_UI` | Verifies dynamic subtotal and cart total recalculations upon item quantity changes. | Cart Item Quantity Recalculation & Total Invariant | 1. Open cart<br>2. Change item quantity from 1 to 2<br>3. Observe line and total prices | Line price and total price double accurately; message displayed [`INV-01`, `INV-02`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-03** | `BORDER_CASE` | `@p1` | `AUTOMATE_UI` | Verifies graceful degradation and empty state messaging when all items are deleted. | Delete Item & Empty Cart State Handling | 1. Add product<br>2. Navigate to cart<br>3. Click delete action | Item removed; message "Your shopping cart is empty" shown [`INV-01`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-04** | `NEGATIVE_PATH` | `@p0` | `AUTOMATE_UI` | Protects invoicing system by ensuring incomplete billing addresses cannot proceed. | Missing Billing Address Disables Proceed Button | 1. Proceed to Step 3 Address<br>2. Clear postal code or street | Field highlighted as invalid; Proceed button disabled [`INV-03`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-05** | `NEGATIVE_PATH` | `@p1` | `AUTOMATE_UI` | Client-side financial validation preventing gateway decline fees. | Expired Credit Card Date Validation | 1. Select Credit Card<br>2. Enter MM/YYYY in the past | Error "Expiration date must be in the future." displayed [`INV-04`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-06** | `STATE_TRANSITION` | `@p1` | `AUTOMATE_UI` | Ensures payment method switching completely resets state without leaking invalid fields. | Payment Method Form Switching & Field Reset | 1. Select Credit Card<br>2. Switch to Cash on Delivery | Credit card inputs disappear; Cash on Delivery options ready | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-07** | `STATE_TRANSITION` | `@p0` | `AUTOMATE_UI` | Prevents checkout initialization when cart has no inventory items. | Forbidden Transition: Checkout with Empty Cart | 1. Open `/checkout` with 0 items | Proceed button disabled or empty cart message prevents navigation [`Forbidden Transition`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-08** | `BORDER_CASE` | `@p1` | `AUTOMATE_API` | Fast verification of 15% combined bundle discount rule at the API level. | Combined Rental & Product Discount API Calculation | 1. Add rental + non-rental item to cart via API | Subtotal applies 15% additional discount [`INV-02`] | ✅ PASS | ✅ Automated (`PASS`) |
| **TC-CHK-09** | `HAPPY_PATH` | `@p2` | `MANUAL_TEST` | Manual visual verification of email order receipt layout. | Customer Order Confirmation Email Delivery | 1. Place order<br>2. Inspect inbox | Confirmation email received with invoice ID and item breakdown | ➖ Manual | 🧑‍💻 Manual Checklist |
| **TC-CHK-10** | `BORDER_CASE` | `@p1` | `AUTOMATE_API` | Fast API contract check for gift card balance reduction and zero-total orders. | Gift Card Redemption & Cart Subtotal Offset | 1. Apply gift card code to cart payload | Cart total decremented by gift card balance [`INV-02`] | ✅ PASS | ✅ Automated (`PASS`) |

---

## 3. 🧑‍💻 Manual Test Execution Guide

### Manual Case `TC-CHK-09`: [Customer Order Confirmation Email Delivery]
* **Why Not Automate?** Third-party inbox deliverability, spam score, and responsive layout across desktop and mobile clients is low-ROI to automate compared to visual inspection.
* **Step-by-Step Instructions:**
  1. Complete a test purchase in Staging with a valid test inbox.
  2. Inspect inbox within 2 minutes.
  3. Verify email subject contains Toolshop order ID, item table matches purchase, and invoice download link is accessible.
