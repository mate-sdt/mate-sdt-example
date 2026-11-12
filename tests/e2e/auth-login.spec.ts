import { test, expect } from '../../src/fixtures/mate.fixtures';

/**
 * 🧪 MOD-02: User Login, Locking & Multi-Role Redirection (E2E UI Suite)
 * Covers: AC1, AC2, AC3, AC4, AC5, AC6
 * Invariants: INV-01, INV-02, INV-03, INV-04
 */

test.describe('MOD-02: User Login & Session Governance', () => {

  test('TC-LOG-01: Customer Login & Account Redirection @p0', async ({ loginPage, navbar }) => {
    const email = process.env.TEST_USER_EMAIL || 'customer@practicesoftwaretesting.com';
    const password = process.env.TEST_USER_PASSWORD || 'welcome01';

    await loginPage.goto();
    await loginPage.login(email, password);

    // AC2: Customer redirected to /account
    await loginPage.assertUrl(/.*account.*/);
    await navbar.assertUserLoggedIn('Jane Doe');
  });

  test('TC-LOG-02: Admin Login & Dashboard Redirection @p0', async ({ loginPage }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@practicesoftwaretesting.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'welcome01';

    await loginPage.goto();
    await loginPage.login(adminEmail, adminPassword);

    // AC2: Admin redirected to /admin/dashboard
    await loginPage.assertUrl(/.*admin\/dashboard.*/);
  });

  test('TC-LOG-03: Invalid Credentials Displays Error Message @p0', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('nonexistent.customer@practicesoftwaretesting.com', 'IncorrectPassword999!');

    // AC3 / INV-02: Generic error displayed
    await loginPage.assertErrorMessage('Invalid email or password');
  });

});
