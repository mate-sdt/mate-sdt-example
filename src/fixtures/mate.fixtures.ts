import { test as base, expect, Page } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { NavbarComponent } from '../components/navbar.component';
import { AuthApiClient } from '../api/auth.client';

/**
 * M.A.T.E. Framework - Dependency Inversion Fixtures (DIP)
 *
 * Rules:
 * 1. Tests must never manually instantiate `new SomePage(page)`.
 * 2. Injected fixtures manage initialization, page dependencies, and authenticated contexts.
 */
export type MateFixtures = {
  catalogPage: CatalogPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  navbar: NavbarComponent;
  authApiClient: AuthApiClient;
  authenticatedCustomerPage: Page;
  authenticatedAdminPage: Page;
};

export const test = base.extend<MateFixtures>({
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  navbar: async ({ page }, use) => {
    await use(new NavbarComponent(page));
  },

  authApiClient: async ({ request }, use) => {
    await use(new AuthApiClient(request));
  },

  authenticatedCustomerPage: async ({ page }, use) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    await page.goto('/auth/login');
    await page.locator('[data-test="email"]').fill(email);
    await page.locator('[data-test="password"]').fill(password);
    await page.locator('[data-test="login-submit"]').click();
    await expect(page.locator('[data-test="nav-menu"]')).toBeVisible({ timeout: 15000 });

    await use(page);
  },

  authenticatedAdminPage: async ({ browser }, use) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@practicesoftwaretesting.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'admin123';

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/auth/login');
    await page.locator('[data-test="email"]').fill(adminEmail);
    await page.locator('[data-test="password"]').fill(adminPassword);
    await page.locator('[data-test="login-submit"]').click();
    await expect(page.locator('[data-test="nav-menu"]')).toBeVisible({ timeout: 15000 });

    await use(page);
    await context.close();
  },
});

export { expect };
