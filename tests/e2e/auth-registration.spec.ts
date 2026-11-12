import { test, expect } from '../../src/fixtures/mate.fixtures';

/**
 * 🧪 MOD-01: User Registration & Password Strength (E2E UI Suite)
 * Covers: AC1, AC2, AC3, AC4, AC5, AC6
 * Invariants: INV-01, INV-02, INV-03, INV-04
 */

test.describe('MOD-01: User Registration & Password Strength', () => {

  test('TC-REG-01: Valid Customer Registration Flow @p0', async ({ registerPage }) => {
    const uniqueEmail = `qa.user.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`;

    await registerPage.goto();
    await registerPage.fillForm({
      firstName: 'Tony',
      lastName: 'Tester',
      dob: '1990-05-15',
      country: 'NL',
      postalCode: '1012AB',
      houseNumber: '42',
      street: 'Damrak',
      city: 'Amsterdam',
      state: 'North Holland',
      phone: '0612345678',
      email: uniqueEmail,
      password: 'StrongP@ssw0rd123!',
    });

    await registerPage.submit();

    // AC6: On successful registration, redirects to /auth/login
    await registerPage.assertUrl(/.*auth\/login.*/);
  });

  test('TC-REG-02 & TC-REG-03: Password Requirements Display & Strength Progression @p1', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.focusPassword();

    // 1. Weak password (only lowercase)
    await registerPage.typePassword('abcdef');
    await registerPage.passwordStrength.assertLevel('Weak');

    // 2. Moderate password (letters + numbers)
    await registerPage.typePassword('abcdef12');
    await registerPage.passwordStrength.assertLevel('Moderate');

    // 3. Strong password (lower + upper + numbers)
    await registerPage.typePassword('Abcdef12');
    await registerPage.passwordStrength.assertLevel('Strong');

    // 4. Very Strong password (lower + upper + numbers + symbols)
    await registerPage.typePassword('Abcdef12!');
    await registerPage.passwordStrength.assertLevel('Very Strong');

    // 5. Excellent password (12+ characters meeting all criteria)
    await registerPage.typePassword('VerySecureP@ssword2026!');
    await registerPage.passwordStrength.assertLevel('Excellent');
  });

  test('TC-REG-04: Missing Mandatory Fields Blocks Submission @p0', async ({ registerPage, page }) => {
    await registerPage.goto();
    await registerPage.submit();

    // Verify form does not submit and stays on registration page
    await registerPage.assertUrl(/.*auth\/register.*/);

    // Verify HTML5 / Angular invalid control state on mandatory fields
    const invalidInputs = page.locator('input:invalid, .is-invalid');
    await expect(invalidInputs.first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-REG-06: Duplicate Email Registration Rejection @p0', async ({ registerPage }) => {
    // M.A.T.E. Anti-Greenwashing Mandate:
    // AC-06 mandates error copy: "Email is already in use."
    // Live UI actually displays: "A customer with this email address already exists."
    // We preserve the true assertion and annotate with test.fail() linked to BUG-20261112-USER-REGISTRATION-01.
    test.fail(true, 'BUG-20261112-USER-REGISTRATION-01: UI displays "A customer with this email address already exists." instead of specified "Email is already in use."');

    await registerPage.goto();
    await registerPage.fillForm({
      firstName: 'Jane',
      lastName: 'Doe',
      dob: '1985-02-10',
      country: 'NL',
      postalCode: '1012AB',
      houseNumber: '1',
      street: 'Main Street',
      city: 'Amsterdam',
      state: 'North Holland',
      phone: '0687654321',
      email: 'customer@practicesoftwaretesting.com', // Pre-existing email
      password: 'StrongPassword123!',
    });

    await registerPage.submit();

    // AC-06 / INV-04 strict expectation: "Email is already in use."
    // Parameterized assertion replaces single-case hardcoded methods (MATE-ANTI-07)
    await registerPage.assertAlertMessage('Email is already in use.');
  });

});
