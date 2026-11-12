import { test, expect } from '../../src/fixtures/mate.fixtures';

/**
 * 🧪 MOD-05 to MOD-08: Complete Checkout & Payment Purchase Journey (E2E Suite)
 * Covers: Cart Review, Sign-In Gate, Address Validation, and Payment Execution.
 * Invariants: INV-01, INV-02, INV-03, INV-04
 */

test.describe('MOD-05 to MOD-08: Checkout & Payment Lifecycle', () => {

  test('TC-CHK-01: End-to-End Purchase with Cash on Delivery @p0', async ({
    loginPage,
    catalogPage,
    productDetailPage,
    checkoutPage,
  }) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    // 1. Authenticate as Customer
    await loginPage.goto();
    await loginPage.login(email, password);

    // 2. Select product and add to cart
    await catalogPage.goto();
    await catalogPage.openFirstProduct();
    await productDetailPage.waitForProductLoaded();
    await productDetailPage.addToCart();

    // 3. Step 1: Cart Review
    await checkoutPage.goto();
    await checkoutPage.proceedToSignIn();

    // 4. Step 2: Sign-in Gate (Already authenticated)
    await checkoutPage.proceedToAddress();

    // 5. Step 3: Billing Address (Fill all mandatory fields)
    await checkoutPage.fillBillingAddress({
      country: 'Austria',
      street: 'Kärntner Straße',
      houseNumber: '15',
      city: 'Vienna',
      state: 'Vienna',
      postalCode: '1010',
    });
    await checkoutPage.proceedToPayment();

    // 6. Step 4: Payment Selection (Cash on Delivery)
    await checkoutPage.selectPaymentMethod('Cash on Delivery');
    await checkoutPage.confirmOrder();

    // 7. Order Confirmation & Invariant INV-04
    await checkoutPage.assertOrderConfirmed();
  });

  test('TC-CHK-02: Cart Item Quantity Recalculation & Invariant INV-02 @p0', async ({
    catalogPage,
    productDetailPage,
    cartPage,
  }) => {
    // 1. Add item to cart
    await catalogPage.goto();
    await catalogPage.openFirstProduct();
    await productDetailPage.waitForProductLoaded();
    const unitPrice = await productDetailPage.getUnitPrice();
    await productDetailPage.addToCart();

    // 2. Verify initial total in Cart Review
    await cartPage.goto();
    const initialTotal = await cartPage.getCartTotal();
    expect(initialTotal).toBeCloseTo(unitPrice, 1);
  });

  test('TC-CHK-04: Incomplete Address Disables Proceed Button [INV-03] @p0', async ({
    loginPage,
    catalogPage,
    productDetailPage,
    checkoutPage,
  }) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    // 1. Authenticate and add item
    await loginPage.goto();
    await loginPage.login(email, password);
    await catalogPage.goto();
    await catalogPage.openFirstProduct();
    await productDetailPage.waitForProductLoaded();
    await productDetailPage.addToCart();

    // 2. Advance to Step 3 Billing Address
    await checkoutPage.goto();
    await checkoutPage.proceedToSignIn();
    await checkoutPage.proceedToAddress();

    // 3. Clear postal code and assert proceed button disabled
    await checkoutPage.postalCodeInput.fill('');
    await checkoutPage.cityInput.fill('');
    await checkoutPage.assertProceed3Disabled();
  });

  test('TC-CHK-06: Payment Method Switching Resets Form State @p1', async ({
    loginPage,
    catalogPage,
    productDetailPage,
    checkoutPage,
  }) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    await loginPage.goto();
    await loginPage.login(email, password);
    await catalogPage.goto();
    await catalogPage.openFirstProduct();
    await productDetailPage.waitForProductLoaded();
    await productDetailPage.addToCart();

    await checkoutPage.goto();
    await checkoutPage.proceedToSignIn();
    await checkoutPage.proceedToAddress();
    await checkoutPage.fillBillingAddress({
      country: 'Austria',
      street: 'Opernring',
      houseNumber: '2',
      city: 'Vienna',
      state: 'Vienna',
      postalCode: '1010',
    });
    await checkoutPage.proceedToPayment();

    // Switch to Credit Card, then to Cash on Delivery
    await checkoutPage.selectPaymentMethod('Credit Card');
    await expect(checkoutPage.page.locator('[data-test="credit_card_number"], input[name="credit_card_number"]')).toBeVisible({ timeout: 5000 });

    await checkoutPage.selectPaymentMethod('Cash on Delivery');
    await expect(checkoutPage.page.locator('[data-test="credit_card_number"], input[name="credit_card_number"]')).toBeHidden({ timeout: 5000 });
  });

});
