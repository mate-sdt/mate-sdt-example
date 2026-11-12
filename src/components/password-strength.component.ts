import { Locator, expect } from '@playwright/test';
import { BaseComponent } from './base.component';

export type PasswordStrengthLevel = 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' | 'Excellent';

/**
 * PasswordStrengthComponent - Reusable Password Strength Indicator Widget
 * Extracted per M.A.T.E. Enterprise Anti-Bloated Page Object pattern.
 */
export class PasswordStrengthComponent extends BaseComponent {
  readonly progressBar: Locator;
  readonly strengthLabel: Locator;

  constructor(rootLocator: Locator) {
    super(rootLocator);
    this.progressBar = rootLocator.locator('.progress-bar');
    this.strengthLabel = rootLocator.locator('.help-block, .progress-bar, span');
  }

  /**
   * Asserts the displayed password strength level.
   */
  async assertLevel(expectedLevel: PasswordStrengthLevel): Promise<void> {
    const indicator = this.rootLocator.page().getByText(expectedLevel, { exact: true });
    await expect(indicator.first()).toBeVisible({ timeout: 5000 });
  }
}
