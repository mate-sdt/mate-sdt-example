import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

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
  readonly errorMessage: Locator;
  readonly passwordStrengthLabel: Locator;

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
    this.errorMessage = page.locator('[data-test="register-error"], [data-test="email-error"], .alert-danger');
    this.passwordStrengthLabel = page.locator('.progress-bar, .help-block');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/auth/register');
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

  async assertPasswordStrength(expectedLevel: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' | 'Excellent'): Promise<void> {
    const strengthIndicator = this.page.getByText(expectedLevel, { exact: true });
    await expect(strengthIndicator.first()).toBeVisible({ timeout: 5000 });
  }

  async assertDuplicateEmailError(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10000 });
    await expect(this.errorMessage.first()).toContainText(/already in use|already exists/i);
  }

  async assertDuplicateEmailErrorStrict(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10000 });
    // AC-06 mandated text: "Email is already in use."
    await expect(this.errorMessage.first()).toContainText('Email is already in use.');
  }
}
