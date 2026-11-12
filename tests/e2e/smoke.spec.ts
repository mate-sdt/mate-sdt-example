import { test, expect } from '../../src/fixtures/mate.fixtures';

/**
 * 🛡️ Wave 1 P0 Smoke Survival Shield
 * Tests the 5 critical Golden Paths across Practice Software Testing (Toolshop v5.0).
 *
 * Rules:
 * - Annotated with @smoke and @p0 for sub-3-minute CI execution.
 * - Strict Dependency Inversion (DIP): zero manual `new PageObject()` calls.
 * - Anti-Greenwashing: asserts real business invariants (INV-01, INV-02).
 */

test.describe('Wave 1: P0 Smoke Survival Shield @smoke @p0', () => {

  test('P0-01: Product Catalog & Search Discovery', async ({ catalogPage }) => {
    // 1. Navigate to home catalog
    await catalogPage.goto();
    await catalogPage.assertProductCountGreaterThan(0);

    // 2. Perform search query
    await catalogPage.searchProduct('Pliers');
    await catalogPage.assertProductCountGreaterThan(0);
  });

  test('P0-02: Product Detail & Add to Cart', async ({ catalogPage, productDetailPage, navbar }) => {
    // 1. Open first available product
    await catalogPage.goto();
    const productName = await catalogPage.openFirstProduct();

    // 2. Verify product details loaded
    await productDetailPage.waitForProductLoaded();
    const unitPrice = await productDetailPage.getUnitPrice();
    expect(unitPrice).toBeGreaterThan(0);

    // 3. Add to cart & verify badge increment
    await productDetailPage.addToCart();
    await navbar.assertCartQuantity(1);
  });

  test('P0-03: Cart Review & Total Calculation (INV-01 / INV-02)', async ({
    catalogPage,
    productDetailPage,
    cartPage,
  }) => {
    // 1. Add product to cart
    await catalogPage.goto();
    await catalogPage.openFirstProduct();
    await productDetailPage.waitForProductLoaded();
    await productDetailPage.addToCart();

    // 2. Navigate to cart review
    await cartPage.goto();
    await cartPage.assertCartTotalGreaterThanZero();
  });

  test('P0-04: Customer Authentication & Session Establishment', async ({ loginPage, navbar }) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    // 1. Navigate to login and submit credentials
    await loginPage.goto();
    await loginPage.login(email, password);

    // 2. Verify authenticated session menu
    await navbar.assertUserLoggedIn('Jane Doe');
  });

  test('P0-05: Multi-Step Checkout Navigation to Sign-In Gate', async ({
    catalogPage,
    productDetailPage,
    cartPage,
  }) => {
    // 1. Add item to cart
    await catalogPage.goto();
    await catalogPage.openFirstProduct();
    await productDetailPage.waitForProductLoaded();
    await productDetailPage.addToCart();

    // 2. Proceed through Cart Review step
    await cartPage.goto();
    await cartPage.proceedToSignInStep();

    // 3. Verify step 2 sign-in gate reached
    await cartPage.assertUrl(/.*checkout.*/);
  });

});
