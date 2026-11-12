import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage - User Authentication and Account Locking.
 * Covers MOD-02 (User Login, Locking & TOTP).
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly totpInput: Locator;
  readonly totpSubmitButton: Locator;
  readonly googleSignInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.submitButton = page.locator('[data-test="login-submit"]');
    this.errorMessage = page.locator('[data-test="login-error"]');
    this.registerLink = page.locator('[data-test="register-link"]');
    this.totpInput = page.locator('[data-test="totp"], [data-test="totp-code"], input[name="totp"]');
    this.totpSubmitButton = page.locator('[data-test="totp-submit"], button:has-text("Verify")');
    this.googleSignInButton = page.locator('[data-test="google-signin"], button:has-text("Google")');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/auth/login');
    await expect(this.emailInput).toBeVisible({ timeout: 15000 });
  }

  async login(email: string, pass: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }

  async assertErrorMessage(expectedSnippet: string): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10000 });
    await expect(this.errorMessage.first()).toContainText(expectedSnippet);
  }

  async assertAccountLockedMessage(): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10000 });
    await expect(this.errorMessage.first()).toContainText(/Account locked|too many failed attempts/i);
  }

  async assertTotpPromptVisible(): Promise<void> {
    await expect(this.totpInput).toBeVisible({ timeout: 10000 });
  }

  async submitTotp(code: string): Promise<void> {
    await this.totpInput.fill(code);
    await this.totpSubmitButton.click();
  }
}
