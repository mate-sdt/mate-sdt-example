import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { PasswordStrengthComponent, PasswordStrengthLevel } from '../components/password-strength.component';

export type RegistrationFormData = {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
};

/**
 * RegisterPage - Customer Registration and Password Strength.
 * Covers MOD-01 (User Registration).
 * Implements M.A.T.E. Enterprise Anti-Bloated Page Object pattern:
 * - Public readonly locators for expect.soft() flexibility
 * - Extracted PasswordStrengthComponent
 * - Parameterized assertAlertMessage()
 */
export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerSubmitButton: Locator;

  // Public readonly locators for assertion flexibility & expect.soft()
  readonly alertBanner: Locator;
  readonly fieldErrors: Locator;
  readonly errorMessage: Locator; // Backwards-compatible alias

  // Extracted Component Object
  readonly passwordStrength: PasswordStrengthComponent;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dobInput = page.locator('[data-test="dob"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.registerSubmitButton = page.locator('[data-test="register-submit"]');
    this.alertBanner = page.locator('[data-test="register-error"], [data-test="email-error"], .alert-danger');
    this.errorMessage = this.alertBanner;
    this.fieldErrors = page.locator('.invalid-feedback, input:invalid');
    this.passwordStrength = new PasswordStrengthComponent(page.locator('form'));
  }

  async goto(): Promise<void> {
    await this.navigateTo('/auth/register');
    // Internal Guard: wait for first input to be interactive
    await expect(this.firstNameInput).toBeVisible({ timeout: 15000 });
  }

  async fillForm(data: Partial<RegistrationFormData>): Promise<void> {
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.dob) await this.dobInput.fill(data.dob);
    if (data.country) await this.countrySelect.selectOption(data.country);
    if (data.postalCode) await this.postalCodeInput.fill(data.postalCode);
    if (data.houseNumber) await this.houseNumberInput.fill(data.houseNumber);
    if (data.street) await this.streetInput.fill(data.street);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.state) await this.stateInput.fill(data.state);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.password) await this.passwordInput.fill(data.password);
  }

  async submit(): Promise<void> {
    await this.registerSubmitButton.click();
  }

  async focusPassword(): Promise<void> {
    await this.passwordInput.focus();
  }

  async typePassword(pw: string): Promise<void> {
    await this.passwordInput.fill(pw);
  }

  /**
   * Delegates to extracted PasswordStrengthComponent.
   */
  async assertPasswordStrength(expectedLevel: PasswordStrengthLevel): Promise<void> {
    await this.passwordStrength.assertLevel(expectedLevel);
  }

  /**
   * Parameterized Alert Message assertion.
   * Replaces single-case methods (MATE-ANTI-07).
   */
  async assertAlertMessage(expectedSnippet: string | RegExp): Promise<void> {
    await expect(this.alertBanner.first()).toBeVisible({ timeout: 10000 });
    await expect(this.alertBanner.first()).toContainText(expectedSnippet);
  }
}
